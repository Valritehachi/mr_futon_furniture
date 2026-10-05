"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";


export default function SidebarPromo(){

  const [phone, setPhone] = useState<string | null>(null);
  const [hours, setHours] = useState<string[]>([]);
  const [promoTitle, setPromoTitle] = useState("High Quality Futon Sofa Sleepers");
  const [promoSubtitle, setPromoSubtitle] = useState("All Futons and Frames are Made in the USA");
  const [promoMessage, setPromoMessage] = useState("Our prices are less than Amazon, Wayfair or any online futon store in the USA. Same item. Better Quality.");
  
    useEffect(() => {
      const fetchSettings = async () => {
        const { data, error } = await supabase()
          .from("settings")
          .select("store_phone, working_hours, promo_title, promo_subtitle, promo_message")
          .eq("id", 1)
          .single();
  
        if (error) {
          console.error("Failed to fetch settings:", error);
        } else if (data) {
          setPhone(data.store_phone);
          setPromoTitle(data.promo_title || "High Quality Futon Sofa Sleepers");
          setPromoSubtitle(data.promo_subtitle || "All Futons and Frames are Made in the USA");
          setPromoMessage(data.promo_message || "Our prices are less than Amazon, Wayfair or any online futon store in the USA. Same item. Better Quality.");
          let hoursArray: string[] = [];
          try {
            hoursArray = JSON.parse(data.working_hours);
          } catch {
            // if parsing fails, just put it as single string
            hoursArray = [data.working_hours];
          }
  
          setHours(hoursArray);
        }
      };
  
      fetchSettings();
    }, []);
  
  return (
    <aside className="border rounded-lg p-6 bg-neutral-900 border-yellow-400 text-center max-w-[500px] mx-auto">
      <h3 className="text-lg text-white font-semibold mb-2">{promoTitle}</h3>
      <p className="text-sm text-white mb-3">{promoSubtitle}</p>
      <hr className="border-yellow-400 my-3" />
      <p className="font-semibold text-white">{promoMessage}</p>
      <hr className="border-yellow-400 my-3" />
      <div className="mt-6 text-white text-sm">
        {hours.map((hour, index) => (
          <p key={index}>{hour}</p>
    ))}
        <p> <span className="font-bold">Call: {phone}</span></p>
      </div>
    </aside>
  );
}
