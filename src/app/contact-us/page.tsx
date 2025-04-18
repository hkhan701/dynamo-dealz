import Header from "@/components/header"

export default async function ContactUs() {

  return (
    <div className="min-h-screen">
      <Header />

      {/* COMING SOON */}
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold text-gray-800">Contact Us</h1>
        <p className="mt-4 text-lg text-gray-600">This page is coming soon!</p>
      </div>
    </div>
  );
}