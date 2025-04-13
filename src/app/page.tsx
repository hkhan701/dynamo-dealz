import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-red-100">
      <div className="flex flex-col items-center max-w-md w-full text-center">
        <div className="mb-8">
          <Image
            src="/logo-png.png"
            alt="Canadian Deals Logo"
            width={150}
            height={150}
            priority
            className="rounded-lg shadow-md"
          />
        </div>

        <h1 className="text-4xl font-bold text-red-600 mb-4">Canadian Deals</h1>
        <p className="text-lg text-gray-700 mb-8">Discover the best deals across Canada</p>

        <Link
          href="/canada"
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors duration-300 shadow-lg hover:shadow-xl"
        >
          Browse Canadian Deals
        </Link>
      </div>
    </main>
  )
}
