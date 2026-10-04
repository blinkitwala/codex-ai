import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Codex_AI - Created by Shreyash and Sibtain',
  description: 'Production-ready AI Assistant with Streaming, Multi-Engine Search, Deep Research & Male Voice',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
  }
};

export const viewport: Viewport = {
  themeColor: '#05070c',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased bg-[#05070c] text-white selection:bg-amber-400 selection:text-black min-h-screen">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) { console.log('PWA ServiceWorker registered with scope: ', registration.scope); },
                    function(err) { console.log('PWA ServiceWorker registration failed: ', err); }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
