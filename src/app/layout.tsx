import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Firecracker Sentinel | Real-Time Explosion Risk Monitoring',
  description: 'Advanced sensor simulation, risk engine, and live monitoring dashboard for firecracker unit safety management.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-dark-400 text-white antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-[250px] min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
