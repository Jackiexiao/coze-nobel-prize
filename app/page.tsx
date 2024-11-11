import Image from 'next/image'
import { CertificateDemo } from '@/components/certificate-demo'
import { CertificateForm } from '@/components/certificate-form'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <h1 className="text-4xl font-bold mb-8">周周黑客松奖状生成器</h1>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="order-2 md:order-1">
          <CertificateForm />
        </div>
        <div className="order-1 md:order-2">
          <CertificateDemo />
        </div>
      </div>
    </main>
  )
}
