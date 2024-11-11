import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export function CertificateDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>效果展示</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-[3/4] w-full">
          <Image
            src="/demo-certificate.jpg"
            alt="奖状效果展示"
            fill
            className="object-contain rounded-lg"
          />
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          生成的奖状效果展示（实际效果可能略有不同）
        </p>
      </CardContent>
    </Card>
  )
} 