import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export type ProductType = {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

export function useTypes() {
  const queryClient = useQueryClient()

  const typesQuery = useQuery<ProductType[]>({
    queryKey: ['types'],
    queryFn: async () => {
      const res = await fetch('/api/types')
      if (!res.ok) throw new Error('Failed to fetch types')
      return res.json()
    },
  })

  const createType = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch('/api/types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create type')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['types'] })
      toast.success('Product type created successfully')
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const deleteType = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/types/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to delete type')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['types'] })
      toast.success('Product type deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  return {
    typesQuery,
    createType,
    deleteType,
  }
}
