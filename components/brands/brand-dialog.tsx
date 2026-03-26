"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
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
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import { insertProductBrandSchema } from "@/lib/db/validations"
import { toast } from "sonner"

interface BrandDialogProps {
  brand?: any
  trigger?: React.ReactNode
}

export function BrandDialog({ brand, trigger }: BrandDialogProps) {
  const [open, setOpen] = React.useState(false)
  const isEditing = !!brand

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(insertProductBrandSchema),
    defaultValues: {
      name: brand?.name || "",
    },
  })

  async function onSubmit(values: any) {
    try {
      const response = await fetch(isEditing ? `/api/brands/${brand.id}` : "/api/brands", {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save brand")
      }

      toast.success(isEditing ? "Brand updated successfully" : "Brand created successfully")
      setOpen(false)
      reset()
      window.location.reload()
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
            Add Brand
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Brand" : "Add Brand"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the name of the brand." : "Enter a name for the new brand."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <Field className="gap-1.5">
            <FieldLabel>Name</FieldLabel>
            <Input 
              placeholder="Brand name (e.g. Nike, Adidas)" 
              {...register("name")} 
              aria-invalid={!!errors.name}
            />
            <FieldError errors={[errors.name]} />
          </Field>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isEditing ? "Save Changes" : "Create Brand"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
