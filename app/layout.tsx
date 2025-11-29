import React, { ReactNode } from 'react';
import Navbar from './components/Navbar';

// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mr Futon Furniture',
  description: 'High Quality Futon Sofa Sleepers. All Futons And Frames Are Made In The USA.Our Prices Are Less Than Amazon, Wayfair Or Any Online Futon Store In The Usa.',
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

