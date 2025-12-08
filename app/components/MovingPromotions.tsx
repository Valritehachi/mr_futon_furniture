// 'use client';

// import { useEffect, useState } from 'react';
// import { supabase } from '@/utils/supabaseClient';

// interface Promotion {
//   id: number;
//   title: string;
//   special_price?: string;
//   start_date: string;
//   end_date: string;
//   priority: number;
// }

// export default function MovingPromotions() {
//   const [promoTexts, setPromoTexts] = useState<string[]>([]);

//   useEffect(() => {
//     const fetchPromotions = async () => {
//       const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

//       const { data, error } = await supabase
//         .from('promotions')
//         .select('*')
//         .lte('start_date', today)
//         .gte('end_date', today)
//         .order('priority', { ascending: false });

//       if (error) {
//         console.error('Error fetching promotions:', error);
//         return;
//       }

//       const texts = (data || []).map(
//         (p) => (p.special_price ? `${p.title} - ${p.special_price}` : p.title)
//       );

//       setPromoTexts(texts);
//     };

//     fetchPromotions();
//   }, []);

//   if (promoTexts.length === 0) return null;

//   return (
//     <div className="w-full overflow-hidden bg-blue-600 text-white py-2 relative">
//       <div className="inline-block whitespace-nowrap animate-marquee">
//         {promoTexts.join('   •   ')}
//       </div>
//       <style jsx>{`
//         .animate-marquee {
//           display: inline-block;
//           padding-left: 100%;
//           animation: marquee 15s linear infinite;
//         }
//         @keyframes marquee {
//           0%   { transform: translateX(0); }
//           100% { transform: translateX(-100%); }
//         }
//       `}</style>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

interface Promotion {
  id: number;
  title: string;
  special_price?: string;
  start_date: string;
  end_date: string;
  priority: number;
}

export default function MovingPromotions() {
  const [promoTexts, setPromoTexts] = useState<string[]>([]);

  useEffect(() => {
    const fetchPromotions = async () => {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      const { data, error } = await supabase()
        .from('promotions')
        .select('*')
        .lte('start_date', today)
        .gte('end_date', today)
        .order('priority', { ascending: false });

      if (error) {
        console.error('Error fetching promotions:', error);
        return;
      }
      const texts = (data || []).map(
        (p: any) => (p.special_price ? `${p.title} - ${p.special_price}` : p.title)
      );
      // const texts = (data || []).map(
      //   (p) => (p.special_price ? `${p.title} - ${p.special_price}` : p.title)
      // );

      setPromoTexts(texts);
    };

    fetchPromotions();
  }, []);

  if (promoTexts.length === 0) return null;

  return (
    <div className="w-full overflow-hidden relative py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
      
      {/* Sparkle decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="sparkle sparkle-1"></div>
        <div className="sparkle sparkle-2"></div>
        <div className="sparkle sparkle-3"></div>
        <div className="sparkle sparkle-4"></div>
      </div>

      {/* Main scrolling content */}
      <div className="relative flex items-center">
        <div className="inline-flex whitespace-nowrap animate-marquee items-center" style={{ paddingLeft: '100%' }}>
          {promoTexts.map((text, idx) => (
            <span key={idx} className="inline-flex items-center mx-8">
              <span className="inline-block w-2 h-2 bg-yellow-300 rounded-full mr-3 animate-pulse"></span>
              <span className="text-white font-bold text-lg tracking-wide drop-shadow-lg">
                {text}
              </span>
              <span className="inline-block w-2 h-2 bg-yellow-300 rounded-full ml-3 animate-pulse"></span>
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {promoTexts.map((text, idx) => (
            <span key={`dup-${idx}`} className="inline-flex items-center mx-8">
              <span className="inline-block w-2 h-2 bg-yellow-300 rounded-full mr-3 animate-pulse"></span>
              <span className="text-white font-bold text-lg tracking-wide drop-shadow-lg">
                {text}
              </span>
              <span className="inline-block w-2 h-2 bg-yellow-300 rounded-full ml-3 animate-pulse"></span>
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }

        /* Sparkle effect */
        .sparkle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          opacity: 0;
          animation: sparkle-animation 2s ease-in-out infinite;
        }

        .sparkle-1 {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .sparkle-2 {
          top: 60%;
          left: 30%;
          animation-delay: 0.5s;
        }

        .sparkle-3 {
          top: 40%;
          left: 70%;
          animation-delay: 1s;
        }

        .sparkle-4 {
          top: 70%;
          left: 90%;
          animation-delay: 1.5s;
        }

        @keyframes sparkle-animation {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Pause animation on hover */
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
