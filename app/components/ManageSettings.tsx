import { supabase } from "@/utils/supabaseClient";

interface ManageSettingsProps {
  email: string;
  setEmail: (email: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  hours: string[];
  setHours: (hours: string[]) => void;
  promoTitle: string;
  setPromoTitle: (value: string) => void;
  promoSubtitle: string;
  setPromoSubtitle: (value: string) => void;
  promoMessage: string;
  setPromoMessage: (value: string) => void;
  promoOffer: string;
  setPromoOffer: (value: string) => void;
}

export default function ManageSettings({
  email,
  setEmail,
  phone,
  setPhone,
  hours,
  setHours,
  promoTitle,
  setPromoTitle,
  promoSubtitle,
  setPromoSubtitle,
  promoMessage,
  setPromoMessage,
  promoOffer,
  setPromoOffer,
}: ManageSettingsProps) {
  
  const saveSettings = async () => {
    const { error } = await supabase()
      .from("settings")
      .update({
        store_email: email,
        store_phone: phone,
        working_hours: hours,
        updated_at: new Date(),
      })
      .eq("id", 1);

    if (error) {
      alert("Error saving settings");
    } else {
      alert("Settings updated successfully!");
    }

    console.log("⬅️ Raw response:", { error });
  };

  const savePromoText = async () => {
    const { error } = await supabase()
      .from("settings")
      .update({
        promo_title: promoTitle,
        promo_subtitle: promoSubtitle,
        promo_message: promoMessage,
        promo_offer: promoOffer,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    if (error) {
      console.error("Error saving promotional text:", error);
      alert(`Error saving promotional text: ${error.message}`);
    } else {
      alert("Promotional text updated successfully!");
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
    <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">⚙️ Store Settings</h2>
        <p className="text-gray-600">Update your store contact information</p>
      </div>

      <div>
        <label className="block font-semibold text-gray-700 mb-2">
          📧 Email Address
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="example@email.com"
        />
      </div>

      <div>
        <label className="block font-semibold text-gray-700 mb-2">
          📞 Phone Number
        </label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="+1 (555) 000-0000"
        />
      </div>

      <div>
        <label className="block font-semibold text-gray-700 mb-2">
          🕐 Working Hours (Up to 4 entries)
        </label>
        <p className="text-sm text-gray-500 mb-3">
          Add your store&apos;s operating hours. You can add multiple lines for different days.
        </p>

        {hours.map((h, i) => (
          <div key={i} className="flex gap-2 mb-3">
            <input
              value={h}
              onChange={(e) => {
                const newHours = [...hours];
                newHours[i] = e.target.value;
                setHours(newHours);
              }}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Example: Mon–Fri: 9am–6pm"
            />
            {hours.length > 1 && (
              <button
                onClick={() => {
                  const newHours = hours.filter((_, index) => index !== i);
                  setHours(newHours);
                }}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-semibold"
              >
                🗑️
              </button>
            )}
          </div>
        ))}

        {hours.length < 4 && (
          <button
            onClick={() => setHours([...hours, ""])}
            className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-semibold text-sm"
          >
            + Add another line
          </button>
        )}
      </div>

      <div className="pt-4 border-t">
        <button
          onClick={saveSettings}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg"
        >
          💾 Save Settings
        </button>
      </div>
    </div>
    <div className="bg-white rounded-xl shadow-lg p-8 space-y-5">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">📝 Black Box Promo Text</h2>
        <p className="text-gray-600">Edit the wording shown in the dark promo box and add optional text below it. Styling stays the same.</p>
      </div>

      <div>
        <label className="block font-semibold text-gray-700 mb-2">Promo heading</label>
        <input value={promoTitle} onChange={(e) => setPromoTitle(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>
      <div>
        <label className="block font-semibold text-gray-700 mb-2">Promo subheading</label>
        <input value={promoSubtitle} onChange={(e) => setPromoSubtitle(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>
      <div>
        <label className="block font-semibold text-gray-700 mb-2">Main promo message</label>
        <textarea value={promoMessage} onChange={(e) => setPromoMessage(e.target.value)} rows={3} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>
      <div>
        <label className="block font-semibold text-gray-700 mb-2">Additional promo text (optional)</label>
        <textarea value={promoOffer} onChange={(e) => setPromoOffer(e.target.value)} rows={2} placeholder="Leave blank to hide additional promo text" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>
      <div className="pt-4 border-t">
        <button onClick={savePromoText} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg">
          💾 Save Promo Text
        </button>
      </div>
    </div>
    </div>
  );
}