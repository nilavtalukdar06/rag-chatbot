import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { ReactQueryProvider } from "@/components/query-client";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "RAG Chatbot",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        options: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
      }}
    >
      <ReactQueryProvider>
        <html lang="en" className={cn("font-sans", geist.variable)}>
          <body>
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster />
          </body>
        </html>
      </ReactQueryProvider>
    </ClerkProvider>
  );
}
