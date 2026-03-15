import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Insight Generator',
  description: 'Paste text and get AI-generated summary, key insights, and a suggested title.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
