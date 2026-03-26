"use client"

import * as React from "react"
import { useProducts } from "@/hooks/use-products"
import { useBrands } from "@/hooks/use-brands"
import { useTypes } from "@/hooks/use-types"
import { ProductTable } from "@/components/products/product-table"
import { ProductDialog } from "@/components/products/product-dialog"
import { Package, Loader2, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ProductsPage() {
  const { productsQuery } = useProducts()
  const { brandsQuery } = useBrands()
  const { typesQuery } = useTypes()

  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedBrandId, setSelectedBrandId] = React.useState<string>("all")

  const isLoading = productsQuery.isLoading || brandsQuery.isLoading || typesQuery.isLoading

  if (isLoading) {
    return (
      <div className="flex h-[450px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
      </div>
    )
  }

  const safeProducts = productsQuery.data || []
  const safeBrands = brandsQuery.data || []
  const safeTypes = typesQuery.data || []

  const filteredProducts = safeProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesBrand = selectedBrandId === "all" || product.brandId?.toString() === selectedBrandId
    return matchesSearch && matchesBrand
  })

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
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

      <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in duration-700">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search products by name..."
            className="pl-10 h-10 bg-card border-muted-foreground/20 focus-visible:ring-primary shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 h-10 rounded-md bg-muted/50 border border-transparent text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Filter:</span>
          </div>
          <Select value={selectedBrandId} onValueChange={setSelectedBrandId}>
            <SelectTrigger className="w-[180px] h-10 bg-card border-muted-foreground/20 shadow-sm">
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {safeBrands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id.toString()}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="animate-in fade-in zoom-in-95 duration-500 delay-200">
        <ProductTable 
          products={filteredProducts} 
          brands={safeBrands} 
          productTypes={safeTypes} 
        />
      </div>
    </div>
  )
}


