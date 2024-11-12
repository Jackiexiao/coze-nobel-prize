import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      throw new Error('请上传文件')
    }

    // 调用 Coze API 上传文件
    const response = await fetch('https://api.coze.cn/v3/file/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.COZE_API_KEY}`,
      },
      body: formData,
    })

    const data = await response.json()

    if (!data.id) {
      throw new Error('文件上传失败：服务器未返回文件ID')
    }

    return NextResponse.json({ file_id: data.id })

  } catch (error) {
    console.error('文件上传失败:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error 
          ? error.message 
          : "文件上传失败，请稍后重试"
      },
      { status: 500 }
    )
  }
} 