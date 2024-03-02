import { Flows } from "@/components/flows";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flows - React Next.js example",
  description:
    "Flows lets you build any onboarding you want. Guide users, increase feature adoption, and improve revenue.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Flows />
      </body>
    </html>
  );
}
