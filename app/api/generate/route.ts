import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    console.log('开始处理奖状生成请求...')
    const { title, subtitle, file_id } = await request.json()
    console.log('收到的参数:', { title, subtitle, file_id })

    // 单次对话不需要传入会话ID， 见： https://www.coze.cn/docs/developer_guides/chat_v3#2824d907
    // const conversation_id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
    // console.log('生成的会话ID:', conversation_id)

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
        stream: false,
        auto_save_history: true,
        additional_messages: [
          {
            role: "user",
            content: JSON.stringify([
              {
                type: "image",
                file_url: file_id
              },
              {
                type: "text",
                text: `title: ${title}\nsubtitle: ${subtitle}`
              }
            ]),
            content_type: "object_string"
          }
        ]
      })
    })

    const data = await response.json()
    console.log('收到 Coze API 响应:', data)
    
    const imageUrl = extractImageUrl(data.msg)
    console.log('提取的图片URL:', imageUrl)
    
    return NextResponse.json({ imageUrl, status: 'success' })
  } catch (error) {
    console.error('奖状生成失败:', error)
    return NextResponse.json(
      { error: "Failed to generate certificate", status: 'error' },
      { status: 500 }
    )
  }
}

function extractImageUrl(message: string) {
  console.log('正在从消息中提取图片URL:', message)
  const urlMatch = message.match(/https?:\/\/[^\s<>"]+?\.(?:jpg|jpeg|gif|png)/i)
  return urlMatch ? urlMatch[0] : null
} 