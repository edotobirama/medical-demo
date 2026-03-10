import type { Metadata } from "next";
import { Inter, Playfair_Display, Lato, Space_Grotesk, Quicksand } from "next/font/google"; // Import theme fonts
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import Providers from "@/components/Providers";
import ThemeWrapper from "@/components/ThemeWrapper";
import MessageNotifier from "@/components/MessageNotifier";
import VideoCallNotifier from "@/components/VideoCallNotifier";
import "./globals.css";

// Define fonts
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const lato = Lato({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-lato" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const quicksand = Quicksand({ subsets: ["latin"], variable: "--font-quicksand" });

export const metadata: Metadata = {
  title: "MediCare Plus | Advanced Medical Care",
  description: "Premium healthcare services including digital consultations and verified specialists.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${lato.variable} ${spaceGrotesk.variable} ${quicksand.variable} font-sans`}>
        <ThemeWrapper>
          <Providers>
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow">
                {children}
              </main>
              {/* ChatWidget is now inside Providers/ThemeWrapper if it needs theme access, 
                  but strictly sticking to previous structure + wrapper */}
              <ChatWidget />
              <MessageNotifier />
              <VideoCallNotifier />
              <Footer />
            </div>
          </Providers>
        </ThemeWrapper>
      </body>
    </html>
  );
}
