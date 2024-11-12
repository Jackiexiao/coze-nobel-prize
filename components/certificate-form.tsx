"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import ReactMarkdown from 'react-markdown'
import { useDropzone } from 'react-dropzone'

export function CertificateForm() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState<string>('')
  const [title, setTitle] = useState("来都来了奖")
  const [subtitle, setSubtitle] = useState("恭喜你获得本周周周黑客松「来都来了奖」！虽然项目还没做完，但是你来都来了，这个奖必须得给你颁发一下。希望下周继续来都来~")
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const { toast } = useToast()

  // 使用 react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        setFile(file)
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
      }
    },
    disabled: loading
  })

  // 在组件卸载时清理预览URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
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
      
      setProgress('AI 正在为你精心制作奖状，请耐心等待 10-20 秒...')
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

      const data = await generateResponse.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      // 修改消息处理逻辑
      if (data.messages && data.messages.length > 0) {
        const formattedMessages = data.messages
          .map((msg: string) => msg.trim())
          .filter(Boolean)
          .join('\n\n')
        setProgress(formattedMessages)
      }

      if (data.imageUrl) {
        console.log('Setting image URL:', data.imageUrl)
        // 不要更新 previewUrl，而是保持原始上传的图片预览
        toast({
          title: "生成成功",
          description: "奖状已生成，可以保存使用了",
        })
      } else {
        toast({
          variant: "destructive",
          title: "生成部分成功",
          description: "已收到AI回复，但未能生成奖状图片",
        })
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
    <Card className="max-w-2xl mx-auto border-2 border-primary/10 shadow-lg">
      <CardHeader className="text-center border-b bg-primary/5">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          周周黑客松奖状生成器
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          为每一位参与者定制专属奖状，记录每一个精彩瞬间
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-medium">
              🏆 奖项名称
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如: 最佳创意奖"
              disabled={loading}
              className="h-11"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subtitle" className="text-base font-medium">
              ✨ 颁奖词
            </Label>
            <Textarea
              id="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="在这里书写你的颁奖词，让每个奖项都充满意义..."
              disabled={loading}
              className="min-h-[120px] resize-none"
              rows={4}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="photo" className="text-base font-medium">
              📸 上传照片
            </Label>
            <div
              {...getRootProps()}
              className={`relative aspect-[1/1] w-full max-w-[240px] mx-auto rounded-xl overflow-hidden 
                ${isDragActive 
                  ? 'border-2 border-primary ring-2 ring-primary/20' 
                  : 'border-2 border-dashed border-primary/20'} 
                bg-muted/50 transition-all duration-200 cursor-pointer`}
            >
              <input {...getInputProps()} />
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="照片预览"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-4">
                  <span className="text-2xl mb-2">📷</span>
                  <p className="text-sm text-center">
                    {isDragActive ? '释放鼠标上传图片' : '点击或拖放图片到此处'}
                  </p>
                </div>
              )}
              {isDragActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                  <p className="text-sm font-medium text-primary">
                    释放鼠标上传图片
                  </p>
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mt-2">
                支持 JPG、PNG、GIF 等图片格式
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full h-12 text-lg font-medium transition-all hover:scale-[1.02] relative"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">🔄</span> 
                  生成中...
                </span>
              ) : (
                <>
                  <span className="flex items-center gap-2">
                    <span>✨</span> 
                    生成奖状
                  </span>
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
                    预计需要 10-20 秒
                  </span>
                </>
              )}
            </Button>
          </div>

          {loading && (
            <div className="space-y-3 animate-fade-in">
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-pulse"></div>
              </div>
              <p className="text-sm text-muted-foreground text-center whitespace-pre-wrap">
                {progress}
              </p>
            </div>
          )}

          {progress && (
            <div className="rounded-xl bg-muted/50 p-6 border border-border animate-fade-in">
              <ReactMarkdown 
                className="prose prose-sm dark:prose-invert max-w-none"
                components={{
                  img: ({src, alt}) => (
                    <div className="space-y-4">
                      <div className="rounded-lg overflow-hidden border shadow-lg">
                        <img 
                          src={src} 
                          alt={alt || '生成的奖状'} 
                          className="w-full" 
                        />
                      </div>
                      <Button
                        variant="outline"
                        className="w-full h-11 font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => window.open(src, '_blank')}
                      >
                        <span className="flex items-center gap-2">
                          <span>💾</span> 
                          下载奖状
                        </span>
                      </Button>
                    </div>
                  ),
                  p: ({children}) => <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>,
                  ul: ({children}) => <ul className="list-disc pl-4 mb-4 space-y-2">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal pl-4 mb-4 space-y-2">{children}</ol>,
                  li: ({children}) => <li className="mb-1">{children}</li>,
                  code: ({children}) => <code className="bg-muted-foreground/20 rounded px-1">{children}</code>,
                  pre: ({children}) => <pre className="bg-muted-foreground/20 p-2 rounded overflow-x-auto">{children}</pre>,
                }}
              >
                {progress}
              </ReactMarkdown>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
} 