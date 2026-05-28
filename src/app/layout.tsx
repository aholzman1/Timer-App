import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Workout Timer",
  description: "Create and manage custom circuit workout timers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
