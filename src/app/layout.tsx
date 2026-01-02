import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "@/components/ui/Toast";
import AuthProvider from "@/components/auth/AuthProvider";
import { I18nProvider } from "@/lib/i18n";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#5D866C",
};

export const metadata: Metadata = {
  title: "Chat Together",
  description: "A modern, secure chat application",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CT",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <I18nProvider>
          <AuthProvider>
            {children}
            <ToastContainer />
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
