'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-5" 
         style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="bg-white rounded-3xl p-12 max-w-2xl w-full shadow-2xl text-center">
        <div 
          className="text-9xl font-bold text-purple-600 mb-5 transition-opacity duration-500"
          style={{ 
            textShadow: '3px 3px 0px rgba(102, 126, 234, 0.2)',
            opacity: mounted ? 1 : 0 
          }}
        >
          404
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Oops! Page Not Found
        </h1>
        
        <p className="text-lg text-gray-600 mb-10 leading-relaxed">
          The page you're looking for might have been moved or no longer exists. 
          We've recently updated our website structure!
        </p>
        
        <div className="bg-gray-50 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Looking for something specific?
          </h2>
          
          <div className="flex flex-col gap-3">
            <Link 
              href="/futon-sets" 
              className="bg-white border-2 border-purple-600 text-purple-600 py-4 px-6 rounded-xl font-semibold text-base hover:bg-purple-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              🛏️ Browse Futon Sets (Frames)
            </Link>
            
            <Link 
              href="/mattresses" 
              className="bg-white border-2 border-purple-600 text-purple-600 py-4 px-6 rounded-xl font-semibold text-base hover:bg-purple-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              🛋️ Shop Futon Mattresses
            </Link>
            
            <Link 
              href="/contact" 
              className="bg-white border-2 border-purple-600 text-purple-600 py-4 px-6 rounded-xl font-semibold text-base hover:bg-purple-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              🏪 Contact Us
            </Link>
            
            <Link 
              href="/about-us" 
              className="bg-white border-2 border-purple-600 text-purple-600 py-4 px-6 rounded-xl font-semibold text-base hover:bg-purple-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              ℹ️ About Us
            </Link>
          </div>
        </div>
        
        <Link 
          href="/" 
          className="inline-block bg-purple-600 text-white py-5 px-10 rounded-xl font-semibold text-lg hover:bg-purple-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}