import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VLearn AI Tutor",
  description: "Trợ lý học tập có kiểm định nguồn cho học viên VLearn.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
