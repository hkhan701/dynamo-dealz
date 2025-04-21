'use client'

import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300 py-8 mt-12">
      <div className="container px-4 mx-auto md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="etna-text text-white font-semibold mb-4 flex items-center gap-2">
              <Image src="/ohcanadadealslogo.png" alt="OhCanadaDeals Logo" width={30} height={20} className="rounded-xl" />
              Oh Canada Deals
            </h3>
            <p className="text-sm">
              Your source for the best deals across Canada. We find the best discounts so you don&apos;t have to.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Newsletter</h3>
            <p className="text-sm mb-4">Subscribe to get notified about new deals and promotions.</p>
            <div className="flex gap-2">
              <Input
                placeholder="Coming soon..."
                className="bg-slate-700 border-slate-600 text-white"
                disabled
              />
              <Button
                className="bg-leaf-background hover:bg-leaf-background/80 text-white"
                disabled
              >
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-slate-400 mt-2">Newsletter feature is coming soon!</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 mt-8 pt-8 text-sm text-center space-y-6">
          <p>&copy; {new Date().getFullYear()} Oh Canada Deals. All rights reserved.</p>

          <div className="text-xs text-slate-400 leading-relaxed max-w-3xl mx-auto">
            <p>Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates.</p>
            <p className="mt-3">
              Product prices shown are accurate as of the date/time indicated and are subject to change. Any price and availability information
              displayed on Amazon at the time of purchase will apply to the purchase of this product.
            </p>
            <p className="mt-3">
              This site contains affiliate links for which we may be compensated.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
