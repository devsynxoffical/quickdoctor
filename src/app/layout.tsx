import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import MaintenanceGate from "@/components/MaintenanceGate";
import AnnouncementBar from "@/components/AnnouncementBar";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "QuickDoctor | 24/7 Digital Healthcare & Prescriptions",
  description:
    "Ireland's leading telemedicine platform. Consult with certified GPs, receive digital prescriptions and sick certificates instantly from home.",
  applicationName: "QuickDoctor",
  metadataBase: new URL("https://quickdoctor.ie"),
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "QuickDoctor | 24/7 Digital Healthcare",
    description: "Irish-registered online GP consultations, prescriptions, and medical certificates.",
    url: "https://quickdoctor.ie",
    siteName: "QuickDoctor",
    images: [{ url: "/logo.png", width: 2000, height: 2000, alt: "QuickDoctor" }],
    locale: "en_IE",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "QuickDoctor",
    description: "Irish-registered online GP consultations, prescriptions, and medical certificates.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="font-jakarta min-h-full flex flex-col bg-white text-slate-900">
        <AnnouncementBar />
        <MaintenanceGate>{children}</MaintenanceGate>
      </body>
    </html>
  );
}
