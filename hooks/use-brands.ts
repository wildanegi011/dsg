import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export type Brand = {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

export function useBrands() {
  const queryClient = useQueryClient()

  const brandsQuery = useQuery<Brand[]>({
    queryKey: ['brands'],
    queryFn: async () => {
      const res = await fetch('/api/brands')
      if (!res.ok) throw new Error('Failed to fetch brands')
      return res.json()
    },
  })

  const createBrand = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create brand')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] })
      toast.success('Brand created successfully')
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const deleteBrand = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/brands/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to delete brand')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] })
      toast.success('Brand deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  return {
    brandsQuery,
    createBrand,
    deleteBrand,
  }
}
