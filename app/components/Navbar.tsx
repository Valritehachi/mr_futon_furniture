import Link from "next/link";

// export default function Navbar() {
//   return (
//     <div className="flex justify-center mt-6 px-4">
//     <nav className="bg-gradient-to-r from-blue-10 to-blue-400 text-white shadow-lg rounded-3xl px-4 lg:px-10 py-4 backdrop-blur-sm w-full max-w-6xl overflow-x-auto">
      
//       <ul className="bg-blue-600 overflow-x-auto px-2 inline-flex rounded-2xl text-white font-medium space-x-2 sm:space-x-4 lg:space-x-8 py-3 lg:py-4 px-3 lg:px-6 whitespace-nowrap">
//         <li>
//             <Link href="/" className="hover:underline">
//               Home
//             </Link>
//           </li>

//           <li>
//             <Link href="/about_us" className="hover:underline">
//               About Us
//             </Link>
//           </li>

//           <li>
//             <Link href="/achievers_trailblazers" className="hover:underline">
//               Achievers & Trailblazers
//             </Link>
//           </li>

//           <li>
//             <Link href="/" className="hover:underline">
//               BOSA Philanthropy
//             </Link>
//           </li>

//           <li>
//             <Link href="/newsletter" className="hover:underline">
//               BOSA Newsletter
//             </Link>
//           </li>

//           <li>
//             <Link href="/" className="hover:underline">
//               History
//             </Link>
//           </li>

//           <li>
//             <Link href="/contact_us" className="hover:underline">
//               Contact Us
//             </Link>
//           </li>

//         </ul>
//       </nav>
//     </div>
    
//   );
// }


export default function Navbar() {
  return (
    <div className="w-full px-2 sm:px-4 mt-6">
      <div className="max-w-6xl mx-auto">
        <nav className="bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-lg rounded-3xl py-3 sm:py-4">
          
          <div className="overflow-x-auto scrollbar-hide">
            <ul className="bg-blue-600 flex rounded-2xl text-white font-medium gap-2 sm:gap-4 lg:gap-8 py-2 sm:py-3 px-3 sm:px-4 lg:px-6 text-xs sm:text-sm lg:text-base mx-2 sm:mx-4 lg:mx-8">
              <li className="whitespace-nowrap">
                <a href="/">Home</a>
              </li>
              <li className="whitespace-nowrap">
                <a href="/about">About Us</a>
              </li>
              <li className="whitespace-nowrap">
                <a href="/achievers">Achievers & Trailblazers</a>
              </li>
              <li className="whitespace-nowrap">
                <a href="/philanthropy">BOSA Philanthropy</a>
              </li>
              <li className="whitespace-nowrap">
                <a href="/newsletter">BOSA Newsletter</a>
              </li>
              <li className="whitespace-nowrap">
                <a href="/history">History</a>
              </li>
              <li className="whitespace-nowrap">
                <a href="/contact">Contact Us</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}