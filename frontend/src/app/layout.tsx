import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Medical Assistant - Professional Triage",
  description:
    "Advanced AI-powered medical triage, lab test interpretation, and telemedicine consultations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-slate-50 flex flex-col`}
      >
        <header className="bg-white border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-semibold text-xl">
              <span className="bg-primary/10 p-1.5 rounded-lg flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-activity"
                >
                  <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
                </svg>
              </span>
              AI Doctor
            </div>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
              <a href="/" className="hover:text-primary transition-colors">
                Home
              </a>
              <a
                href="/consultation"
                className="hover:text-primary transition-colors"
              >
                AI Consultation
              </a>
              <a href="/labs" className="hover:text-primary transition-colors">
                Lab Results
              </a>
              <a
                href="/doctors"
                className="hover:text-primary transition-colors"
              >
                Find a Doctor
              </a>
            </nav>
            <div className="flex gap-4">
              <button className="text-sm font-medium text-slate-600 hover:text-primary">
                Log in
              </button>
              <button className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                Book Consultation
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-white border-t py-12">
          <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
            <p className="mb-2">
              © 2026 AI Doctor Platform. All rights reserved.
            </p>
            <p>
              <strong className="text-slate-700">Medical Disclaimer:</strong>{" "}
              This AI acts as a triage assistant and does not replace a licensed
              medical professional. In case of a medical emergency, please call
              your local emergency services immediately.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
