"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { supabase } from "@/utils/supabaseClient";

export default function FutonSetsPage() {

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed header + navbar */}
      <Navbar />

      {/* Page content */}
      <section className="flex-grow p-8 bg-gray-50">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          futon sets
        </h1>
      </section>
    </div>
  );
}