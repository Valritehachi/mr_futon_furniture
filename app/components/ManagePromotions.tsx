'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";

interface Promotion {
  id: number;
  title: string;
  special_price?: string;
  start_date: string;
  end_date: string;
  priority: number;
}

export default function ManagePromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  const [title, setTitle] = useState("");
  const [specialPrice, setSpecialPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [priority, setPriority] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Fetch all promotions
  const fetchPromotions = async () => {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .order('priority', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setPromotions(data || []);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  // Save or update promotion
  const savePromotion = async () => {
    if (!title.trim() || !startDate || !endDate) return alert("Title, start & end date required");

    if (editingId) {
      // Update
      await supabase.from('promotions')
        .update({
          title,
          special_price: specialPrice,
          start_date: startDate,
          end_date: endDate,
          priority
        })
        .eq('id', editingId);
    } else {
      // Insert
      await supabase.from('promotions')
        .insert([{ title, special_price: specialPrice, start_date: startDate, end_date: endDate, priority }]);
    }

    resetForm();
    fetchPromotions();
  };

  const editPromotion = (promo: Promotion) => {
    setEditingId(promo.id);
    setTitle(promo.title);
    setSpecialPrice(promo.special_price || "");
    setStartDate(promo.start_date);
    setEndDate(promo.end_date);
    setPriority(promo.priority);
  };

  const deletePromotion = async (id: number) => {
    if (!confirm("Delete this promotion?")) return;
    await supabase.from('promotions').delete().eq('id', id);
    fetchPromotions();
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setSpecialPrice("");
    setStartDate("");
    setEndDate("");
    setPriority(1);
  };

  return (
    <div className="flex gap-8">
      {/* Form */}
      <div className="flex-1 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">{editingId ? "Edit Promotion" : "Add Promotion"}</h2>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block font-semibold mb-1">Title</label>
            <input
              className="w-full p-3 border rounded-lg"
              placeholder="Promotion title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          {/* Special Price */}
          <div>
            <label className="block font-semibold mb-1">Special Price</label>
            <input
              className="w-full p-3 border rounded-lg"
              placeholder="Optional price info"
              value={specialPrice}
              onChange={e => setSpecialPrice(e.target.value)}
            />
          </div>

          {/* Start & End Date */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold mb-1">Start Date</label>
              <input
                type="date"
                className="w-full p-3 border rounded-lg"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">End Date</label>
              <input
                type="date"
                className="w-full p-3 border rounded-lg"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block font-semibold mb-1">Priority</label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg"
              placeholder="Higher number = higher priority"
              value={priority}
              onChange={e => setPriority(Number(e.target.value))}
            />
          </div>

          {/* Save Button */}
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold"
            onClick={savePromotion}
          >
            {editingId ? "Update Promotion" : "Add Promotion"}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="w-80 bg-white p-5 rounded-xl shadow-lg overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">Promotions</h3>

        {promotions.map(promo => (
          <div key={promo.id} className="border p-3 rounded-lg mb-3">
            <h4 className="font-bold">{promo.title}</h4>
            {promo.special_price && <p className="text-sm text-gray-600">{promo.special_price}</p>}
            <div className="flex gap-2 mt-2">
              <button className="text-blue-600" onClick={() => editPromotion(promo)}>Edit</button>
              <button className="text-red-600" onClick={() => deletePromotion(promo.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
