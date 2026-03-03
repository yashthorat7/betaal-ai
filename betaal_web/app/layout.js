import { Mulish } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Providers from '@/components/common/Providers';

const mulish = Mulish({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mulish',
});

export const metadata = {
  title: 'BETAAL.AI',
  description:
    'AI-powered digital rehabilitation ecosystem combats addiction through adaptive alerts.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={mulish.variable}>
      <body className="bg-background text-foreground flex min-h-screen flex-col scroll-smooth font-sans">
        <Providers>
          <Navbar />
          <main className="flex-grow pt-20">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
