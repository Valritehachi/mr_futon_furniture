import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex justify-center mt-6">
      <nav className="bg-gradient-to-r from-blue-10 to-blue-400 text-white shadow-lg rounded-3xl px-10 py-4 backdrop-blur-sm">
      
        <ul className="bg-blue-600 inline-flex rounded-2xl text-white font-medium space-x-8 py-4 px-6">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>

          <li>
            <Link href="/about_us" className="hover:underline">
              About Us
            </Link>
          </li>

          <li>
            <Link href="/achievers_trailblazers" className="hover:underline">
              Achievers & Trailblazers
            </Link>
          </li>

          <li>
            <Link href="/" className="hover:underline">
              BOSA Philanthropy
            </Link>
          </li>

          <li>
            <Link href="/newsletter" className="hover:underline">
              BOSA Newsletter
            </Link>
          </li>

          <li>
            <Link href="/" className="hover:underline">
              History
            </Link>
          </li>

          <li>
            <Link href="/contact_us" className="hover:underline">
              Contact Us
            </Link>
          </li>

        </ul>
      </nav>
    </div>
    
  );
}