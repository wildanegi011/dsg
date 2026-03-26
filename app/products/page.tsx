import { db } from "@/lib/db"
import { products, productBrands, productTypes } from "@/lib/db/schema"
import { desc, asc } from "drizzle-orm"
import { ProductTable } from "@/components/products/product-table"
import { ProductDialog } from "@/components/products/product-dialog"
import { Package } from "lucide-react"

export default async function ProductsPage() {
  // Fetch data directly in the server component for maximum stability
  const [safeProducts, safeBrands, safeTypes] = await Promise.all([
    db.query.products.findMany({
      with: {
        brand: true,
        type: true,
      },
      orderBy: [desc(products.createdAt)],
    }).catch(() => []),
    db.query.productBrands.findMany({
      orderBy: [asc(productBrands.name)],
    }).catch(() => []),
    db.query.productTypes.findMany({
      orderBy: [asc(productTypes.name)],
    }).catch(() => []),
  ])




  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3 animate-in slide-in-from-left duration-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm border border-primary/20">
              <Package className="h-6 w-6" />
            </div>
            Product Inventory
          </h2>
          <p className="text-muted-foreground mt-1 animate-in slide-in-from-left duration-500">
            Manage your product catalog, monitor stock levels, and update pricing.
          </p>
        </div>
        <div className="flex items-center space-x-2 animate-in slide-in-from-right duration-500">
          <ProductDialog brands={safeBrands} productTypes={safeTypes} />
        </div>
      </div>
      <div className="animate-in fade-in zoom-in-95 duration-500 delay-200">
        <ProductTable 
          products={safeProducts} 
          brands={safeBrands} 
          productTypes={safeTypes} 
        />
      </div>
    </div>
  )
}
