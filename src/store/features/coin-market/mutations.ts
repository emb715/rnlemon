import {useMutation, useQueryClient} from '@tanstack/react-query'
import {storeActions} from '../../useAppStore'

function toggleFavorite(coinId: string): Promise<unknown> {
  return new Promise(async (resolve, reject) => {
    try {
      // Add to app store
      storeActions.toggleFavorite(coinId)
      resolve('success')
    } catch (error) {
      console.error('toggleFavorite', error)
      reject(error)
    }
  })
}

export const useFavoriteMutation = () => {
  const favQueryKey = ['fav']
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: toggleFavorite,
    onMutate: variable => {
      const prevData = queryClient.getQueryData(favQueryKey)
      // Add context for a possible rollback
      return {
        prevData,
        coinId: variable
      }
    },
    onError: (error, variable, context) => {
      // An error happened! Do the rollback
      queryClient.setQueryData(
        [...favQueryKey, context?.coinId],
        context?.prevData
      )
    },
    onSuccess: () => {
      // INFO: invalidate query keys for filtered coin list by favorite if any
      // Invalidate and refetch or set new data
      // queryClient.invalidateQueries({ queryKey: [...favQueryKey, variable] })
      // queryClient.setQueryData([...favQueryKey, variable], data)
    }
  })
  return mutation
}
