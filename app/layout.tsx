import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Aria Voss — Digital Strategist & AI Specialist',
  description:
    'Digital marketer, web designer, and AI automation architect helping ambitious brands grow faster, look sharper, and work smarter.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-bg text-brand font-cabinet antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}