import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './components/Providers';
import AuthProvider from './providers/AuthProvider';

export const metadata: Metadata = {
  title: 'Homeo MVP – Repertorization Engine',
  description: 'Classical homeopathic repertorization tool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider><Providers>{children}</Providers></AuthProvider>
        
      </body>
    </html>
  );
}