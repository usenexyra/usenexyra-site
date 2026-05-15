import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Aria Voss — Digital Strategist & AI Specialist',
  description:
    'Digital marketer, web designer, and AI automation architect helping ambitious brands grow faster',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">

      <head>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "wrjl1pzofb");
            `,
          }}
        />
      </head>

      <body className="bg-bg text-brand font-cabinet antialiased overflow-x-hidden">
        {children}
      </body>

    </html>
  )
}