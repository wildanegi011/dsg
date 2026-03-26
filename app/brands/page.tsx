"use client"

import { useBrands } from "@/hooks/use-brands"
import { BrandTable } from "@/components/brands/brand-table"
import { BrandDialog } from "@/components/brands/brand-dialog"
import { Landmark, Loader2 } from "lucide-react"

export default function BrandsPage() {
  const { brandsQuery } = useBrands()

  if (brandsQuery.isLoading) {
    return (
      <div className="flex h-[450px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
      </div>
    )
  }

  const brands = brandsQuery.data || []

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3 animate-in slide-in-from-left duration-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm border border-primary/20">
              <Landmark className="h-6 w-6" />
            </div>
            Brands
          </h2>
          <p className="text-muted-foreground mt-1 animate-in slide-in-from-left duration-500">
            Manage your product brands.
          </p>
        </div>
        <div className="flex items-center space-x-2 animate-in slide-in-from-right duration-500">
          <BrandDialog />
        </div>
      </div>
      <div className="animate-in fade-in zoom-in-95 duration-500 delay-200">
        <BrandTable brands={brands} />
      </div>
    </div>
  )
}

