import './globals.css';
import Navbar from '@/components/ui/Navbar';
import ActiveVisitBanner from '@/components/visits/ActiveVisitBanner';
import ToastViewport from '@/components/ui/ToastViewport';

export const metadata = {
  title: 'WanderPath',
  description: 'WanderPath frontend',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-black text-sm">
        <Navbar />
        <ActiveVisitBanner />
        <main className="max-w-6xl mx-auto p-4">{children}</main>
        <ToastViewport />
      </body>
    </html>
  );
}
