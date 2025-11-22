import Layout from './layout';
import HeroSlider from '@/app/components/HeroSlider';
import SidebarPromo from '@/app/components/SidebarPromo';
import Footer from '@/app/components/Footer';
import Navbar from './components/Navbar';
import Logo from './components/Logo';
import Link from 'next/link';


export default function Home() {
  return (
    <Layout>
      {/* TOP LEFT: Logo and Navbar */}
      <div className="flex flex-col gap-2">
        <Logo />
        <Navbar />
      </div>

      {/* MAIN CONTENT: Hero + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        <div className="lg:col-span-8">
          <HeroSlider />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-4">
          <SidebarPromo />
          <div className="font-bold text-lg ml-[60px]">
            $99 PREMIUM 8 MATTRESS WITH FRAME PURCHASE.
          </div>
        </div>
      </div>

      {/* WELCOME SECTION */}
      <section className="text-center mt-12">
        <h1 className="text-3xl text-gray-600 font-bold">
          Welcome to Mr. Futon Furniture Store
        </h1>
        <p className="mt-2 text-gray-500 text-2xl">
          3300 South Congress Ave, Boynton Beach, FL 33426
        </p>
        <div className="mt-3 text-2xl text-gray-500 font-extrabold">
          (561) 572-3267
        </div>
        <h1 className="text-4xl text-gray-600 font-bold">
          All Sofa Sleepers and Futon Mattresses are Made in the USA
        </h1>
         <p className="mt-2 text-gray-500 text-2xl">
          Visit our local showroom in Boynton Beach, Florida
        </p>


        {/* CATEGORY LINKS GRID */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* Sofa Sleepers */}
          
          <li>
            <a
                    href="https://smallsofasleepers.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline hover:decoration-[#93C5FD] hover:decoration-2 hover:underline-offset-12"
                  >
                    Space Savers
                  </a>
            
              <div className="aspect-[4/3] relative">
                <img 
                  src="/images/sofa-sleepers-category.jpg" 
                  alt="Sofa Sleepers"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Shop our Sofa Sleepers</h3>
                  <p className="text-sm">We have high quality sofa sleepers in a wide assortment of styles.</p>
                </div>
              </div>
          </li>

          {/* Futon Mattresses */}
          <Link href="/mattresses" className="group relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all">
            <div className="aspect-[4/3] relative">
              <img 
                src="/images/mattresses-category.jpg" 
                alt="Futon Mattresses"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Shop our Futon Mattresses</h3>
                <p className="text-sm">Our comfortable futon mattresses are available in a number of thickness and support options.</p>
              </div>
            </div>
          </Link>

          {/* Futon Covers */}
          <Link href="/covers" className="group relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all">
            <div className="aspect-[4/3] relative">
              <img 
                src="/images/covers-category.jpg" 
                alt="Futon Covers"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Shop our Futon Covers</h3>
                <p className="text-sm">We have a variety of futon covers in many colors and styles.</p>
              </div>
            </div>
          </Link>

          {/* Space Savers */}
          <Link href="/space-savers" className="group relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all">
            <div className="aspect-[4/3] relative">
              <img 
                src="/images/space-savers-category.jpg" 
                alt="Space Savers"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Shop our Space Savers</h3>
                <p className="text-sm">A Space Saver is our own custom futon design that fits into small areas.</p>
              </div>
            </div>
          </Link>

          {/* Visit Showroom */}
          <Link href="/contact" className="group relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all">
            <div className="aspect-[4/3] relative">
              <img 
                src="/images/showroom-photo.jpg" 
                alt="Visit our Showroom"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Visit our Showroom</h3>
                <p className="text-sm">3300 S. Congress Ave, Boynton Beach FL 33426</p>
              </div>
            </div>
          </Link>

          {/* Accessories */}
          <Link href="/accessories" className="group relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all">
            <div className="aspect-[4/3] relative">
              <img 
                src="/images/accessories-category.jpg" 
                alt="Accessories"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Shop our Accessories</h3>
                <p className="text-sm">Get our matching end tables, coffee tables or drawer systems to complete your room.</p>
              </div>
            </div>
          </Link>
        </div>

        {/* CUSTOMER REVIEW */}
        <div className="max-w-4xl mx-auto bg-gray-50 rounded-lg p-8 mb-16">
          <p className="text-lg text-gray-700 italic mb-4">
            "Thank you! Thank you! Thank you! I am so happy with the beautiful and very comfortable futon Mr. Futon built for my home!{" "}
            <span className="font-bold">Excellent</span> experience from the very start, to now the delivery and set up of this awesome piece of furniture! 
            I didn't think such craftsmanship, pride and service existed any more, but it does with Mark, Mr. Futon!"
          </p>
          <p className="text-gray-600 font-semibold">— Irena, Google Revi</p>
        </div>

        {/* ANSWERS TO COMMON QUESTIONS */}
        <div className="max-w-7xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Answers to Common Futon Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Article 1 */}
            <Link href="/blog/advantages-sofa-sleeper" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all">
                <div className="aspect-video bg-gradient-to-br from-purple-400 via-pink-400 to-red-400"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    Advantages Of The Sofa Sleeper Over The Normal Sofa
                  </h3>
                </div>
              </div>
            </Link>

            {/* Article 2 */}
            <Link href="/blog/futons-worth-money" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all">
                <div className="aspect-video bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    Are Futons Worth The Money?
                  </h3>
                </div>
              </div>
            </Link>

            {/* Article 3 */}
            <Link href="/blog/futon-vs-sleeper-sofa" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all">
                <div className="aspect-video bg-gradient-to-br from-green-400 via-lime-400 to-yellow-400"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    Futon vs Sleeper Sofa: Which One is Better?
                  </h3>
                </div>
              </div>
            </Link>
          </div>
        </div>







      </section>

      

      <Footer />
    </Layout>
  );
}