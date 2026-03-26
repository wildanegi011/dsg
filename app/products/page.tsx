import { db } from "@/lib/db"
import { products, productBrands, productTypes } from "@/lib/db/schema"
import { desc, asc } from "drizzle-orm"
import { ProductTable } from "@/components/products/product-table"
import { ProductDialog } from "@/components/products/product-dialog"
import { Package } from "lucide-react"

export default async function ProductsPage() {
  // Fetch data directly in the server component for maximum stability
  console.log("DEBUG: Initializing database fetch in ProductsPage...");
  
  const [safeProducts, safeBrands, safeTypes] = await Promise.all([
    db.query.products.findMany({
      with: {
        brand: true,
        type: true,
      },
      orderBy: [desc(products.createdAt)],
    }).catch((err) => {
      console.error("DEBUG: Failed to fetch products:", err);
      return [];
    }),
    db.select().from(productBrands).orderBy(asc(productBrands.name)).catch((err) => {
      console.error("DEBUG: Failed to fetch brands:", err);
      return [];
    }),
    db.select().from(productTypes).orderBy(asc(productTypes.name)).catch((err) => {
      console.error("DEBUG: Failed to fetch types:", err);
      return [];
    }),
  ])


  console.log(`DEBUG: Fetch complete. Products: ${safeProducts.length}, Brands: ${safeBrands.length}, Types: ${safeTypes.length}`);






  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {safeBrands.length === 0 && (
        <div className="p-4 border border-yellow-200 bg-yellow-50 text-yellow-800 rounded-lg text-sm italic">
          Warning: No brands found in database. Please add them in the Brands page.
        </div>
      )}

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
