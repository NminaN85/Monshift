import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MonShift - Time Tracking App",
  description: "Record working hours, breaks, and calculate overtime easily.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MonShift",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" dir="ltr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#1e3a8a" />
        <link rel="apple-touch-icon" href="icons/IMG_9280.jpeg" />

      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
