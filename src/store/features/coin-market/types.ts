export type CryptoResponse<T> = {
  data: T
  status: {
    timestamp: string
    error_code: number
    error_message: any
    elapsed: number
    credit_count: number
    notice: any
  }
}

export type CoinData = {
  id: number
  name: string
  symbol: string
  slug: string
  cmc_rank: number
  num_market_pairs: number
  circulating_supply: number
  total_supply: number
  max_supply: number
  infinite_supply: any
  last_updated: string
  date_added: string
  tags: string[]
  platform: any
  self_reported_circulating_supply: any
  self_reported_market_cap: any
  quote: Quote
}

export type Quote = Record<string, Crypto>

export type Crypto = {
  price: number
  volume_24h: number
  volume_change_24h: number
  percent_change_1h: number
  percent_change_24h: number
  percent_change_7d: number
  percent_change_30d: number
  percent_change_60d: number
  percent_change_90d: number
  market_cap: number
  market_cap_dominance: number
  fully_diluted_market_cap: number
  last_updated: string
}

export type CoinMetadata = {
  id: number
  name: string
  symbol: string
  category: string
  description: string
  slug: string
  logo: string
  subreddit: string
  notice: string
  tags: string[]
  'tag-names': string[]
  'tag-groups': string[]
  urls: CoinMetadataUrls
  platform: any
  date_added: string
  twitter_username: string
  is_hidden: number
  date_launched: string
  contract_address: any[]
  self_reported_circulating_supply: any
  self_reported_tags: any
  self_reported_market_cap: any
  infinite_supply: boolean
}

export type CoinMetadataUrls = {
  website: string[]
  twitter: any[]
  message_board: string[]
  chat: any[]
  facebook: any[]
  explorer: string[]
  reddit: string[]
  technical_doc: string[]
  source_code: string[]
  announcement: any[]
}
