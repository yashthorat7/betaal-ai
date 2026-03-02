import './globals.css';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

export const metadata = {
  title: 'BETAAL AI — Digital Rehabilitation',
  description:
    'AI-powered digital rehabilitation ecosystem combats addiction through adaptive alerts.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground flex min-h-screen flex-col scroll-smooth">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
