import axios from 'axios'
import {
  QueryFunctionContext,
  useQuery,
  useQueryClient,
  UseQueryOptions
} from '@tanstack/react-query'
import {useIsAuth} from '../../useSessionStore'
import {HOST} from './constants'
import {CoinData, CoinMetadata, CryptoResponse} from './types'

const cryptoQueryKeys = {
  crypto: [{scope: 'crypto'}] as const,
  getLatest: () => [{...cryptoQueryKeys.crypto[0]}] as const,
  cryptoInfo: [{scope: 'crypto-info'}] as const,
  getInfo: (cryptoIds: string[]) =>
    [{...cryptoQueryKeys.cryptoInfo[0], cryptoIds}] as const
}

/**
 * Crypto Latest
 */
async function fetchLatestCrypto() {
  const response = await axios.get(
    `${HOST.url}/v1/cryptocurrency/listings/latest`,
    {
      headers: {
        'X-CMC_PRO_API_KEY': HOST.key
      }
    }
  )
  return response.data
}

type CryptoListResponse = CryptoResponse<CoinData[]>

type CryptoListOptions<T> = Omit<
  UseQueryOptions<
    CryptoListResponse,
    Error,
    T,
    ReturnType<typeof cryptoQueryKeys.getLatest>
  >,
  'queryKey' | 'queryFn'
>

export const useCryptoListQuery = <TData = CryptoListResponse>(
  options: CryptoListOptions<TData> = {}
) => {
  const isAuth = useIsAuth()
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: cryptoQueryKeys.getLatest(),
    queryFn: async () => {
      const response: CryptoListResponse = await fetchLatestCrypto()
      // Prefetch query data for crypto info metadata
      const coinsIds = response.data?.map(item => item.id.toString())
      prefetchInfoCrypto(coinsIds, {queryClient})

      return response
    },
    ...options,
    enabled: isAuth && options.enabled,
    staleTime: 30000,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  })
  return query
}

/**
 * Crypto Info
 */

async function fetchInfoCrypto(
  cryptoIds: string[]
): Promise<CryptoInfoResponse> {
  const idList = cryptoIds.join(',')
  const response = await axios.get(
    `${HOST.url}/v2/cryptocurrency/info?id=${idList}`,
    {
      headers: {
        'X-CMC_PRO_API_KEY': HOST.key
      }
    }
  )
  return response.data
}

async function getInfoCrypto({
  queryKey: [{cryptoIds}]
}: QueryFunctionContext<ReturnType<typeof cryptoQueryKeys.getInfo>>) {
  return await fetchInfoCrypto(cryptoIds)
}

function prefetchInfoCrypto(
  coinsIds: string[],
  {queryClient}: {queryClient: ReturnType<typeof useQueryClient>}
) {
  queryClient.prefetchQuery({
    queryKey: [...cryptoQueryKeys.cryptoInfo, coinsIds],
    queryFn: async () => {
      const response = await fetchInfoCrypto(coinsIds)
      if (response.data) {
        Object.entries(response.data).forEach(([key, value]) => {
          queryClient.setQueryData(
            cryptoQueryKeys.getInfo([key.toString()]),
            value
          )
        })
      }
      return response
    },
    staleTime: Infinity
  })
}

type CryptoInfoResponse = CryptoResponse<Record<string, CoinMetadata>>

export const useCryptoInfoQuery = <T = CoinMetadata>(id: string) => {
  const queryClient = useQueryClient()
  const queryData = queryClient.getQueryData(cryptoQueryKeys.getInfo([id])) as T
  const query = useQuery({
    queryKey: cryptoQueryKeys.getInfo([id]),
    queryFn: async context => {
      const response = await getInfoCrypto(context)
      if (id in response.data) {
        return response.data[id] as T
      }
      return undefined
    },
    initialData: () => {
      return (queryData as T) || ({} as T)
    },
    enabled: !queryData,
    staleTime: Infinity,
    gcTime: Infinity
  })
  return query
}
