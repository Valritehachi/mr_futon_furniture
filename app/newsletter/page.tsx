import Header from "@/app/components/Header";
import Navbar from "@/app/components/Navbar";
import newslettersData from "../../newsletters.json";
import ReadMoreButton from "@/app/components/ReadMoreButton";

export default function NewsletterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed header + navbar */}
      <Header />
      <Navbar />

      {/* Page content */}
      <section className="flex-grow p-8 bg-gray-50">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Newsletters
        </h1>

        <div className="space-y-6 max-w-3xl mx-auto">
          {newslettersData.map((n) => (
            <div key={n.id} className="border-b border-gray-200 py-4">
          <h2 className="text-xl font-semibold">{n.title}</h2>
          <p>{n.content.substring(0, 100)}...</p>
          <ReadMoreButton id={n.id} />
        </div>
          ))}
        </div>
      </section>
    </div>
  );
}