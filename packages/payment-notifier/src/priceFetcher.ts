const CoinGecko = require('coingecko-api')

export const fetchAdaPrice = async (): Promise<string> => {
  const CoinGeckoClient = new CoinGecko()
  const cgCall = await CoinGeckoClient.simple.price({ ids: 'cardano', vs_currencies: 'usd', include_24hr_vol: false, include_last_updated_at: false })
  return `$${cgCall.data.cardano.usd} USD`
}
