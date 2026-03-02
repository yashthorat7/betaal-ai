import './globals.css';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Providers from '@/components/common/Providers';

export const metadata = {
  title: 'BETAAL AI — Digital Rehabilitation',
  description:
    'AI-powered digital rehabilitation ecosystem combats addiction through adaptive alerts.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground flex min-h-screen flex-col scroll-smooth">
        <Providers>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
