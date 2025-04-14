import Image from "next/image"

export default function Footer() {
  return (
    <footer className="w-full border-t mt-12 px-4 py-6 text-sm text-gray-500 bg-white dark:bg-gray-900 dark:text-gray-400">
      <div className="max-w-screen-xl mx-auto flex flex-col items-center text-center space-y-4">

        <Image src="/logo-png.png" alt="OhCanadaDeals Logo" width={60} height={20} className="rounded-2xl"/>

        <p className="max-w-3xl text-xs leading-relaxed">
          <strong>Disclaimer:</strong><br />
          Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates.<br /><br />
          Product prices shown are accurate as of the date/time indicated and are subject to change. Any price and availability information displayed on Amazon at the time of purchase will apply to the purchase of this product.<br /><br />
          This site contains affiliate links for which we may be compensated.
        </p>

        <p className="text-xs">&copy; {new Date().getFullYear()} OhCanadaDeals. All rights reserved.</p>
      </div>
    </footer>
  )
}
