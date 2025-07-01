export default async function Home() {

  return (
    <div className="min-h-screen">
      {/* Coming soon */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Coming Soon: US Deals</h1>
        <p className="text-gray-700 mb-6">
          We&apos;re working hard to bring you the best deals in the US. Stay tuned!
        </p>
        <p className="text-gray-500">
          In the meantime, check out our <a href="/ca" className="text-blue-600 hover:underline">Canadian deals</a> for great offers.
        </p>
      </div>
    </div>
  );
}