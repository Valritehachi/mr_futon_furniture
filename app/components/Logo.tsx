"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

const Logo = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      const { data } = supabase().storage
        .from('images') // bucket name
        .getPublicUrl('logo_image.png'); // file name
      setLogoUrl(data.publicUrl);
    };
    fetchLogo();
  }, []);

  if (!logoUrl) return <div>Loading...</div>;

  return (
    <div className="flex justify-start py-4 ml-25">
      <Image 
        src={logoUrl} 
        alt="Logo" 
        width={250} 
        height={80} 
        priority 
      />
    </div>
  );
};

export default Logo;
