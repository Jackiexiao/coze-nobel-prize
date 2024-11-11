"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export function CertificateForm() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState<string>('')
  const [title, setTitle] = useState("来都来了奖")
  const [subtitle, setSubtitle] = useState("恭喜你获得本周周周黑客松「来都来了奖」！虽然项目还没做完，但是你来都来了，这个奖必须得给你颁发一下。希望下周继续来都来~")
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('/yiyun.jpg')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const { toast } = useToast()

  // 在组件加载时将默认图片转换为 File 对象
  useEffect(() => {
    async function setDefaultImage() {
      try {
        const response = await fetch('/yiyun.jpg')
        const blob = await response.blob()
        const defaultFile = new File([blob], 'yiyun.jpg', { type: 'image/jpeg' })
        setFile(defaultFile)
      } catch (error) {
        console.error('加载默认图片失败:', error)
      }
    }
    setDefaultImage()
  }, [])

  // 处理文件上传并生成预览
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
    }
  }

  // 在组件卸载时清理预览URL
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl !== '/yiyun.jpg') {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !title || !subtitle) {
      toast({
        variant: "destructive",
        title: "请填写完整信息",
        description: "请确保已填写奖项名称、颁奖词并上传照片",
      })
      return
    }

    setLoading(true)
    setProgress('准备上传文件...')
    try {
      // 上传文件
      const formData = new FormData()
      formData.append('file', file)
      
      setProgress('正在上传文件...')
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      const uploadData = await uploadResponse.json()
      if (uploadData.error) {
        throw new Error(uploadData.error)
      }
      
      setProgress('文件上传完成，开始生成奖状...')
      // 生成奖状
      const generateResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          subtitle,
          file_id: uploadData.file_id
        })
      })

      setProgress('正在等待AI生成奖状（预计需要10-20秒）...')
      const data = await generateResponse.json()
      
      if (data.imageUrl) {
        setProgress('奖状生成完成！')
        setGeneratedImage(data.imageUrl)
        toast({
          title: "生成成功",
          description: "奖状已生成，可以保存使用了",
        })
      } else {
        throw new Error('未能获取生成的图片')
      }
    } catch (error) {
      console.error('生成过程出错:', error)
      toast({
        variant: "destructive",
        title: "生成失败",
        description: error instanceof Error ? error.message : "请稍后重试",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>生成奖状</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">奖项名称</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如: 最佳创意奖"
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subtitle">颁奖词</Label>
            <Textarea
              id="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="请输入颁奖词..."
              disabled={loading}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">上传照片（默认使用一云老师照片）</Label>
            {/* 添加照片预览 */}
            <div className="relative aspect-[1/1] w-full max-w-[200px] mx-auto mb-4 rounded-lg overflow-hidden">
              <Image
                src={previewUrl}
                alt="照片预览"
                fill
                className="object-cover"
              />
            </div>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
            />
            {file && file.name === 'yiyun.jpg' && (
              <p className="text-sm text-muted-foreground">
                当前使用默认图片：一云老师
              </p>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "生成中..." : "生成奖状"}
          </Button>

          {loading && (
            <div className="space-y-2">
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-pulse"></div>
              </div>
              <p className="text-sm text-muted-foreground text-center">{progress}</p>
            </div>
          )}

          {generatedImage && (
            <div className="mt-4">
              <img 
                src={generatedImage} 
                alt="生成的奖状"
                className="w-full rounded-lg shadow-lg" 
              />
              <Button
                variant="outline"
                className="mt-2 w-full"
                onClick={() => window.open(generatedImage, '_blank')}
              >
                下载奖状
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
} 