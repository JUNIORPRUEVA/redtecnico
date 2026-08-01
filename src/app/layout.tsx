import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { ServiceWorkerRegister } from "@/components/service-worker-register";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Red Técnico Fulltech",
  description:
    "Red privada de técnicos y ayudantes aliados de FULLTECH SRL. Oportunidades de trabajos eventuales de instalación, mantenimiento y soporte técnico.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Red Fulltech",
  },
};

export const viewport: Viewport = {
  themeColor: "#1d4ed8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
        <ServiceWorkerRegister />
      </body>

    </html>
  );
}
