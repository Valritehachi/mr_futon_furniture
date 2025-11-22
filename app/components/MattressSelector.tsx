"use client";

import { useState } from "react";

interface MattressOption {
  size: string;
  price: string;
  image_url?: string;
}

interface MattressSelectorProps {
  options: MattressOption[];
  onImageChange?: (imageUrl: string) => void; // Callback to update main image
}

export default function MattressSelector({ options, onImageChange }: MattressSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState(1); // Default to 8 inch
  const selectedMattress = options[selectedIndex];

  const handleSelection = (index: number) => {
    setSelectedIndex(index);
    // Notify parent component about image change
    if (onImageChange && options[index].image_url) {
      onImageChange(options[index].image_url!);
    }
  };

  return (
    <div className="bg-yellow-100 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Mattress : {selectedMattress.size}
      </h3>

      <div className="space-y-3 mb-4">
        {options.map((option, index) => (
          <label
            key={index}
            className="flex items-center gap-3 cursor-pointer hover:bg-yellow-50 p-2 rounded transition"
          >
            <input
              type="radio"
              name="mattress"
              checked={selectedIndex === index}
              onChange={() => handleSelection(index)}
              className="w-5 h-5 text-blue-600"
            />
            <div className="flex items-center gap-2 flex-1">
              {/* Mattress Image Thumbnail */}
              {option.image_url ? (
                <img 
                  src={option.image_url} 
                  alt={option.size}
                  className="w-12 h-8 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-8 bg-blue-200 rounded flex items-center justify-center">
                  <div className="w-10 h-6 bg-blue-300 rounded-sm"></div>
                </div>
              )}
              <span className="text-gray-800 font-medium flex-1">
                - {option.size} -
              </span>
              <span className="text-cyan-500 font-bold text-lg">
                {option.price}
              </span>
            </div>
          </label>
        ))}
      </div>

      <button
        onClick={() => handleSelection(1)}
        className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
      >
        Clear
      </button>

      <div className="mt-6 pt-4 border-t border-yellow-200">
        <p className="text-2xl font-bold text-cyan-500">
          {selectedMattress.price}
        </p>
      </div>
    </div>
  );
}