import { CertificateForm } from "@/components/certificate-form"
import Image from "next/image"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/50 py-12 px-4">
      <div className="container max-w-5xl mx-auto space-y-8">
        {/* 页面标题 */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary/90 to-primary/60 bg-clip-text text-transparent">
            周周黑客松奖状生成器
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            使用 AI 为每位参与者生成独特的奖状，记录每一个精彩瞬间。上传照片，填写奖项名称和颁奖词，
            让我们为每一份努力喝彩！
          </p>
        </div>

        {/* 使用说明和样例展示 - 左右布局 */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* 左侧：使用说明 */}
          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-border/50 h-fit">
            <h2 className="font-medium flex items-center gap-2 mb-4 text-lg">
              <span>📝</span> 使用说明
            </h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  1
                </span>
                <span>上传照片</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  2
                </span>
                <span>填写奖项名称和颁奖词</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  3
                </span>
                <span>点击生成按钮，等待 10-20 秒</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  4
                </span>
                <span>下载生成的奖状</span>
              </li>
            </ul>
          </div>

          {/* 右侧：样例展示 */}
          <div className="relative group">
            <div className="relative aspect-[1.414/1] w-full rounded-lg overflow-hidden border border-border/50 bg-card/50">
              <Image
                src="/demo-certificate.jpg"
                alt="奖状样例"
                fill
                className="object-contain p-2 transition-transform group-hover:scale-[1.02]"
                priority
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-center">
              <p className="text-sm font-medium text-muted-foreground bg-background/95 shadow-sm backdrop-blur-sm rounded-full px-4 py-1.5 inline-block">
                生成效果预览
              </p>
            </div>
          </div>
        </div>

        {/* 奖状生成表单 */}
        <CertificateForm />

        {/* 页脚 */}
        <footer className="text-center text-sm text-muted-foreground pt-8">
          <p>
            由{" "}
            <a 
              href="https://github.com/hackathonweekly/coze-nobel-prize" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-primary transition-colors"
            >
              周周黑客松
            </a>
            {" "}提供支持
          </p>
        </footer>
      </div>
    </main>
  )
}
