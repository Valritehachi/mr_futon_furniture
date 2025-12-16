import Link from "next/link";

export default function SofaFooter() {
  return (
    <footer className="w-full bg-gradient-to-b from-gray-100 to-gray-200 border-t mt-24">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* NAV LINKS */}
        <nav className="flex justify-center items-center gap-6 text-sm font-medium text-gray-800">
          <Link href="/space-savers" className="hover:text-blue-600 transition">
            Home
          </Link>

          <span className="text-gray-400">|</span>

          <Link href="/about-us" className="hover:text-blue-600 transition">
            About
          </Link>

          <span className="text-gray-400">|</span>

          <Link href="/blog" className="hover:text-blue-600 transition">
            Blog
          </Link>

          <span className="text-gray-400">|</span>

          <Link href="/contact-us" className="hover:text-blue-600 transition">
            Contact Us
          </Link>
        </nav>
      </div>
    </footer>
  );
}
