import { Flows } from "@/components/flows";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flows - React Next.js example",
  description:
    "Flows lets you build any onboarding you want. Guide users, increase feature adoption, and improve revenue.",
  openGraph: {
    type: "website",
    title: "Flows - React Next.js example",
    description:
      "Flows lets you build any onboarding you want. Guide users, increase feature adoption, and improve revenue.",
    images: "/og.png",
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flows - React Next.js example",
    description:
      "Flows lets you build any onboarding you want. Guide users, increase feature adoption, and improve revenue.",
    images: "/og.png",
    creator: "@flows_sh",
  },
  keywords: ["flows", "onboarding", "product adoption", "user onboarding", "user adoption"],
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
