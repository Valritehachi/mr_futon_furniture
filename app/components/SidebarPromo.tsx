"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";


export default function SidebarPromo(){

  const [phone, setPhone] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [hours, setHours] = useState<string[]>([]);
  
    useEffect(() => {
      const fetchSettings = async () => {
        const { data, error } = await supabase()
          .from("settings")
          .select("store_phone, store_email, working_hours")
          .eq("id", 1)
          .single();
  
        if (error) {
          console.error("Failed to fetch settings:", error);
        } else if (data) {
          setPhone(data.store_phone);
          setEmail(data.store_email);
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
    <aside className="border rounded-lg p-6 bg-yellow-100 border-yellow-400 text-center max-w-[500px] mx-auto">
      <h3 className="text-lg font-semibold mb-2">High Quality Futon Sofa Sleepers</h3>
      <p className="text-sm mb-3">All Futons and Frames are Made in the USA</p>
      <hr className="border-yellow-400 my-3" />
      <p className="font-semibold">Our prices are less than Amazon, Wayfair or any online futon store in the USA. Same item. Better Quality.</p>
      <hr className="border-yellow-400 my-3" />
      <div className="mt-6 text-sm">
        {hours.map((hour, index) => (
          <p key={index}>{hour}</p>
    ))}
        <p> <span className="font-bold">Call: {phone}</span></p>
      </div>
    </aside>
  );
}
