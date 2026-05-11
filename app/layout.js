export const metadata = {
  title: "buy me a squiggle",
  description: "An on-chain crowdfund to acquire a Chromie Squiggle. Full refund if it fails — you keep the art.",
  openGraph: {
    title: "buy me a squiggle",
    description: "An on-chain crowdfund to acquire a Chromie Squiggle. Full refund if it fails — you keep the art.",
    url: "https://buymeasquiggle.xyz",
    siteName: "buymeasquiggle",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "buy me a squiggle",
    description: "An on-chain crowdfund to acquire a Chromie Squiggle.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
