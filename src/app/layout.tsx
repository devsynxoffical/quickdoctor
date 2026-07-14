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
  description: "Ireland's leading telemedicine platform. Consult with certified GPs, receive digital prescriptions and sick certificates instantly from home.",
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
