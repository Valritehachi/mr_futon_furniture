import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Image from "next/image";
import Sidebar from "./components/sidebar";


export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <Navbar />
    
      {/* Hero image under the header */}
      {/* <div className="w-[90%] h-[500px] relative"> */}
      <div className="flex justify-center mt-6 h-[400px]">
        <Image
          src="/images/hero.jpg"
          alt="Hero"
          width={1000}
          height={400}
          
          className="rounded-2xl shadow-lg object-cover"
          priority
        />
      </div>

      {/* Main content + Sidebar */}
      <div className="w-full flex justify-center mt-8 px-4">
        <div className="flex w-full max-w-6xl gap-8">
          {/* Left main content */}
          <div className="flex-1 flex flex-col max-w-3xl">
            <h2 className="text-2xl font-semibold mb-4">Welcome to Our Newsletter</h2>
            <p className="text-gray-700 leading-relaxed">
              Newsletter Newsletter Newsletter Newsletter.
            </p>
          </div>

          {/* Right Sidebar */}
          <Sidebar />
        </div>
      </div>

    </main>
  );
}