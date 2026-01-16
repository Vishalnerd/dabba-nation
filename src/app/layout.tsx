import { Fredoka } from "next/font/google";
import "./globals.css";

// Fredoka is a perfect, modern, and playful alternative to Comic Sans
const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-fredoka",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fredoka.variable}>
      <body className="font-playful">{children}</body>
    </html>
  );
}
