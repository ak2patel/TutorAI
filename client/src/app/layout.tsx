import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { Providers } from "@/store/provider";
import SocketInitializer from "@/components/SocketInitializer";

export const metadata: Metadata = {
  title: "VedaAI Assessment Creator",
  description: "Generate question papers with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <SocketInitializer />
          <AppShell>
            {children}
          </AppShell>
        </Providers>
      </body>
    </html>
  );
}
