// import React, { ReactNode } from 'react';
// import Navbar from './components/Navbar';

// // app/layout.tsx
// import type { Metadata } from 'next';
// import './globals.css';

// export const metadata: Metadata = {
//   title: 'Mr Futon Furniture',
//   description: 'High Quality Futon Sofa Sleepers. All Futons And Frames Are Made In The USA.Our Prices Are Less Than Amazon, Wayfair Or Any Online Futon Store In The Usa.',
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>{children}</body>
//     </html>
//   );
// }


import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mr Futon Furniture',
  description:
    'High Quality Futon Sofa Sleepers. All Futons And Frames Are Made In The USA. Our Prices Are Less Than Amazon, Wayfair Or Any Online Futon Store In The USA.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-4219NFBDH8"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4219NFBDH8');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
