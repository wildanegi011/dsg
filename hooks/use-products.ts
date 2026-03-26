import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export type Product = {
  id: number
  name: string
  description?: string
  price: number
  stock: number
  brandId: number
  typeId: number
  brand?: { id: number; name: string }
  type?: { id: number; name: string }
}

export function useProducts() {
  const queryClient = useQueryClient()

  const productsQuery = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('/api/products')
      if (!res.ok) throw new Error('Failed to fetch products')
      return res.json()
    },
  })

  const createProduct = useMutation({
    mutationFn: async (newProduct: Omit<Product, 'id' | 'brand' | 'type'>) => {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create product')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product created successfully')
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const updateProduct = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Product> & { id: number }) => {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to update product')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const deleteProduct = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to delete product')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  return {
    productsQuery,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}
