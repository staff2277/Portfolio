import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { TransitionLayout } from "@/components/TransitionLayout";
import Navbar from "@/components/Navbar";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "400", "600", "700"] });

export const metadata = {
  title: "Creative Portfolio",
  description: "A highly animated creative developer portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.className} bg-black text-white antialiased`}>
        <SmoothScroll>
          <Navbar />
          <TransitionLayout>
            {children}
          </TransitionLayout>
        </SmoothScroll>
      </body>
    </html>
  );
}
