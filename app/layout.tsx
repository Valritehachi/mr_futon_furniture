import React, { ReactNode } from 'react';
import Navbar from './components/Navbar';

// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'My Futon Site',
  description: 'A beautiful furniture website built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

