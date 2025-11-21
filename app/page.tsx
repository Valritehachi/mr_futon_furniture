import Layout from './layout';
import HeroSlider from '@/app/components/HeroSlider';
import SidebarPromo from '@/app/components/SidebarPromo';
import Footer from '@/app/components/Footer';
import Navbar from './components/Navbar';
import Logo from './components/Logo';


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
      </section>

      

      <Footer />
    </Layout>
  );
}