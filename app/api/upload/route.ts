import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    console.log('开始处理文件上传请求...')
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      console.log('错误：未提供文件')
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    console.log(`准备上传文件: ${file.name}, 大小: ${file.size} bytes`)
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)

    console.log('开始向 Coze API 上传文件...')
    const response = await fetch('https://api.coze.cn/v3/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.COZE_API_KEY}`,
      },
      body: uploadFormData
    })

    const data = await response.json()
    console.log('文件上传完成，获得 file_id:', data.file_id)
    
    return NextResponse.json({ file_id: data.file_id })
  } catch (error) {
    console.error('文件上传失败:', error)
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    )
  }
} 