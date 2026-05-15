// import type { Metadata } from 'next'
// import { Orbitron, Share_Tech_Mono, Rajdhani } from 'next/font/google'
// import { Analytics } from '@vercel/analytics/next'
// import './globals.css'

// const orbitron = Orbitron({ subsets: ["latin"], weight: ['400', '600', '700', '900'] });
// const shareMonoBold = Share_Tech_Mono({ subsets: ["latin"], weight: '400' });
// const rajdhani = Rajdhani({ subsets: ["latin"], weight: ['400', '500', '600', '700'] });

// export const metadata: Metadata = {
//   title: 'SkillsUSA Hunt — Apex Motors',
//   description: 'SkillsUSA Hunt game interface',
//   generator: 'v0.app',
//   icons: {
//     icon: [
//       {
//         url: '/icon-light-32x32.png',
//         media: '(prefers-color-scheme: light)',
//       },
//       {
//         url: '/icon-dark-32x32.png',
//         media: '(prefers-color-scheme: dark)',
//       },
//       {
//         url: '/icon.svg',
//         type: 'image/svg+xml',
//       },
//     ],
//     apple: '/apple-icon.png',
//   },
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en" className="bg-[#0a0a0a]">
//       <body className={`${rajdhani.className} antialiased bg-[#111] text-[#e8eaf0] flex items-center justify-center min-h-screen overflow-hidden`} style={{
//         '--font-orbitron': orbitron.style.fontFamily,
//         '--font-mono': shareMonoBold.style.fontFamily,
//         '--font-rajdhani': rajdhani.style.fontFamily,
//       } as React.CSSProperties}>
//         {children}
//         {process.env.NODE_ENV === 'production' && <Analytics />}
//       </body>
//     </html>
//   )
// }


import type { Metadata } from 'next'
import { Orbitron, Share_Tech_Mono, Rajdhani } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-orbitron',
})

const shareMono = Share_Tech_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-share-mono',   // ← renamed: avoids collision with Tailwind v4's --font-mono
})

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani',
})

export const metadata: Metadata = {
  title: 'SkillsUSA Hunt — Apex Motors',
  description: 'SkillsUSA Hunt game interface',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`bg-[#0a0a0a] ${orbitron.variable} ${shareMono.variable} ${rajdhani.variable}`}
    >
      {/*
        By adding the font variables to <html> via next/font's .variable,
        they become available as CSS custom properties across the whole tree
        without any inline style= prop needed.
      */}
      <body className="antialiased bg-background text-foreground flex items-center justify-center min-h-screen overflow-hidden">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
