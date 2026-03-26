import { db } from "@/lib/db"
import { productBrands } from "@/lib/db/schema"
import { asc } from "drizzle-orm"
import { BrandTable } from "@/components/brands/brand-table"
import { BrandDialog } from "@/components/brands/brand-dialog"
import { Landmark } from "lucide-react"

export default async function BrandsPage() {
  const brands = await db.query.productBrands.findMany({
    orderBy: [asc(productBrands.name)],
  }).catch((error) => {
    console.error("DEBUG: Failed to fetch brands:", error);
    return [];
  })


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
