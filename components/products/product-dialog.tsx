"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field"
import { insertProductSchema } from "@/lib/db/validations"
import { createProduct, updateProduct } from "@/lib/db/actions"
import { toast } from "sonner"

interface ProductDialogProps {
  product?: any
  brands: any[]
  productTypes: any[]
  trigger?: React.ReactNode
}

export function ProductDialog({ product, brands, productTypes, trigger }: ProductDialogProps) {
  const [open, setOpen] = React.useState(false)
  const isEditing = !!product

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price ? parseFloat(product.price) : 0,
      stock: product?.stock || 0,
      brandId: product?.brandId || undefined,
      typeId: product?.typeId || undefined,
    },
  })

  async function onSubmit(values: any) {
    try {
      if (isEditing) {
        await updateProduct(product.id, values)
        toast.success("Product updated successfully")
      } else {
        await createProduct(values)
        toast.success("Product created successfully")
      }
      setOpen(false)
      reset()
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Product" : "Add Product"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of your product below."
              : "Fill in the details to add a new product."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4">
          <Field className="gap-1.5">
            <FieldLabel>Name</FieldLabel>
            <Input 
              placeholder="Product name" 
              {...register("name")} 
              aria-invalid={!!errors.name}
            />
            <FieldError errors={[errors.name]} />
          </Field>

          <FieldGroup className="grid grid-cols-2 gap-4">
             <Field className="gap-1.5">
              <FieldLabel>Brand</FieldLabel>
              <Controller
                control={control}
                name="brandId"
                render={({ field }) => (
                  <Select
                    onValueChange={(val) => field.onChange(parseInt(val))}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger aria-invalid={!!errors.brandId} className="w-full">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id.toString()}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.brandId]} />
            </Field>

            <Field className="gap-1.5">
              <FieldLabel>Type</FieldLabel>
              <Controller
                control={control}
                name="typeId"
                render={({ field }) => (
                  <Select
                    onValueChange={(val) => field.onChange(parseInt(val))}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger aria-invalid={!!errors.typeId} className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {productTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.typeId]} />
            </Field>
          </FieldGroup>

          <FieldGroup className="grid grid-cols-2 gap-4">
            <Field className="gap-1.5">
              <FieldLabel>Price (IDR)</FieldLabel>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("price", { valueAsNumber: true })}
                aria-invalid={!!errors.price}
              />
              <FieldError errors={[errors.price]} />
            </Field>

            <Field className="gap-1.5">
              <FieldLabel>Stock</FieldLabel>
              <Input
                type="number"
                placeholder="0"
                {...register("stock", { valueAsNumber: true })}
                aria-invalid={!!errors.stock}
              />
              <FieldError errors={[errors.stock]} />
            </Field>
          </FieldGroup>

          <Field className="gap-1.5">
            <FieldLabel>Description</FieldLabel>
            <Textarea
              placeholder="Product description..."
              className="resize-none min-h-[100px]"
              {...register("description")}
              aria-invalid={!!errors.description}
            />
            <FieldError errors={[errors.description]} />
          </Field>

          <DialogFooter className="pt-2">
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isEditing ? "Save Changes" : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
