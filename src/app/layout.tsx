import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Institution Hub — All-in-One Institution Management Platform',
  description:
    'Comprehensive institution management and tracking platform for schools, colleges, coaching centres, and universities. Centralize attendance, timetable, examinations, assignments, and Razorpay fee collections.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
