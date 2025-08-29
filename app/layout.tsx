
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "../components/Toast";
import { ConfirmDialogProvider } from "../components/ConfirmDialog";
import { SessionExpiredListener } from "../components/SessionExpiredListener";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Management App",
  description: "A modern, full-stack task management application with authentication, project and task tracking, beautiful UI/UX, and robust features.",
  keywords: [
    "task management",
    "project management",
    "nextjs",
    "mongodb",
    "tailwindcss",
    "authentication",
    "crud",
    "productivity",
    "modern ui",
    "react"
  ],
  authors: [{ name: "Mani2453" }],
  creator: "Mani2453",
  openGraph: {
    title: "Task Management App",
    description: "A beautiful, secure, and modern app to manage your projects and tasks.",
    url: "https://your-deployment-url.com/",
    siteName: "Task Management App",
    images: [
      {
        url: "/vercel.svg",
        width: 1200,
        height: 630,
        alt: "Task Management App Logo"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConfirmDialogProvider>
          <ToastProvider>
            <SessionExpiredListener />
            {children}
          </ToastProvider>
        </ConfirmDialogProvider>
      </body>
    </html>
  );
}
