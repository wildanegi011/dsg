import { db } from "@/lib/db"
import { productTypes } from "@/lib/db/schema"
import { asc } from "drizzle-orm"
import { TypeTable } from "@/components/types/type-table"
import { TypeDialog } from "@/components/types/type-dialog"
import { Tags } from "lucide-react"

export default async function TypesPage() {
  const types = await db.query.productTypes.findMany({
    orderBy: [asc(productTypes.name)],
  }).catch(() => [])

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3 animate-in slide-in-from-left duration-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm border border-primary/20">
              <Tags className="h-6 w-6" />
            </div>
            Product Types
          </h2>
          <p className="text-muted-foreground mt-1 animate-in slide-in-from-left duration-500">
            Manage your product types.
          </p>
        </div>
        <div className="flex items-center space-x-2 animate-in slide-in-from-right duration-500">
          <TypeDialog />
        </div>
      </div>
      <div className="animate-in fade-in zoom-in-95 duration-500 delay-200">
        <TypeTable types={types} />
      </div>
    </div>
  )
}
