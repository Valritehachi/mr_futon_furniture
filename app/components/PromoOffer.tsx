"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";

export default function PromoOffer({
  className = "font-bold justify-start text-lg ml-[60px]",
}: {
  className?: string;
}) {
  const [offer, setOffer] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffer = async () => {
      const { data, error } = await supabase()
        .from("settings")
        .select("promo_offer")
        .eq("id", 1)
        .single();

      if (error) {
        console.error("Failed to fetch promotional offer:", error);
        setOffer("");
        return;
      }

      setOffer(data?.promo_offer || "");
    };

    fetchOffer();
  }, []);

  if (offer === null || !offer.trim()) return null;

  return <div className={className}>{offer}</div>;
}
