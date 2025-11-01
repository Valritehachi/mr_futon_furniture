"use client";

import { useRouter } from "next/navigation";

export default function ReadMoreButton({ id }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/newsletter/${id}`);
  };

  return (
    <button
      onClick={handleClick}
      className="block mx-auto mt-4  hover:text-blue-400 text-blue px-6 py-2 rounded-full text-lg shadow-md transition-all duration-200"
    >
      Read More
    </button>
  );
}