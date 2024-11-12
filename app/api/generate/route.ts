import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    console.log('开始处理奖状生成请求...')
    const { title, subtitle, file_id } = await request.json()
    console.log('收到的参数:', { title, subtitle, file_id })

    console.log('开始调用 Coze API 生成奖状...')
    const response = await fetch(`https://api.coze.cn/v3/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.COZE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bot_id: process.env.COZE_BOT_ID,
        user_id: "user_" + crypto.randomUUID(),
        stream: true,
        auto_save_history: true,
        additional_messages: [
          {
            role: "user",
            content: JSON.stringify([
              {
                type: "text",
                text: `请根据这张照片生成一个奖状，标题是：${title}，颁奖词是：${subtitle}`
              },
              {
                type: "image",
                file_id: file_id
              }
            ]),
            content_type: "object_string"
          }
        ]
      })
    })

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('无法获取响应流')
    }

    let chatId: string | null = null
    let imageUrl: string | null = null
    let allMessages: string[] = []
    const decoder = new TextDecoder()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (!line.trim()) continue

          if (line.startsWith('event:')) {
            const event = line.slice(6).trim()
            const dataLine = lines[lines.indexOf(line) + 1]
            if (!dataLine?.startsWith('data:')) continue
            
            const data = dataLine.slice(5).trim()
            if (!data || data === '"[DONE]"') continue

            try {
              const jsonData = JSON.parse(data)
              
              if (event !== 'conversation.message.delta') {
                console.log('收到事件:', event, '数据:', jsonData)
              }

              switch (event) {
                case 'conversation.chat.created':
                  chatId = jsonData.id
                  console.log('创建会话成功, chat ID:', chatId)
                  break

                case 'conversation.message.completed':
                  if (jsonData.role === 'assistant' && jsonData.type === 'answer') {
                    console.log('收到助手消息:', jsonData.content)
                    
                    if (typeof jsonData.content === 'string' && jsonData.content.trim()) {
                      allMessages.push(jsonData.content.trim())
                      
                      const urlMatch = jsonData.content.match(/!\[.*?\]\((.*?)\)/)
                      if (urlMatch && urlMatch[1]) {
                        imageUrl = urlMatch[1]
                        console.log('成功提取图片URL:', imageUrl)
                      }
                    }
                  } else if (jsonData.type === 'error') {
                    console.error('AI返回错误:', jsonData.content)
                    allMessages.push(`错误: ${jsonData.content}`)
                  }
                  break

                case 'conversation.chat.completed':
                  console.log('会话完成，状态:', jsonData.status)
                  break
              }
            } catch (e) {
              console.error('解析事件数据失败:', e, '原始数据:', data)
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }

    console.log('处理完成，返回数据:', { 
      messageCount: allMessages.length,
      messages: allMessages,
      imageUrl,
      status: imageUrl ? 'success' : 'partial_success'
    })

    return NextResponse.json({ 
      messages: allMessages,
      imageUrl: imageUrl,
      status: imageUrl ? 'success' : 'partial_success'
    })

  } catch (error) {
    console.error('奖状生成失败:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "生成失败", status: 'error' },
      { status: 500 }
    )
  }
} 