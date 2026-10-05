"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";

const DEFAULT_OFFER = "$99 PREMIUM 8 MATTRESS WITH FRAME PURCHASE.";

export default function PromoOffer({
  className = "font-bold justify-start text-lg ml-[60px]",
}: {
  className?: string;
}) {
  const [offer, setOffer] = useState(DEFAULT_OFFER);

  useEffect(() => {
    const fetchOffer = async () => {
      const { data, error } = await supabase()
        .from("settings")
        .select("promo_offer")
        .eq("id", 1)
        .single();

      if (error) {
        console.error("Failed to fetch promotional offer:", error);
        return;
      }

      setOffer(data?.promo_offer || "");
    };

    fetchOffer();
  }, []);

  if (!offer.trim()) return null;

  return <div className={className}>{offer}</div>;
}
