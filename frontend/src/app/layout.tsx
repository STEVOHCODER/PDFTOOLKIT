import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-[#0a0c10]" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
      </head>
      <body className={`${inter.className} min-h-full flex flex-col bg-[#0a0c10] text-slate-200 selection:bg-blue-500/30`}>
        
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5202519329050813"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />

        {children}
      </body>
    </html>
  );
}
