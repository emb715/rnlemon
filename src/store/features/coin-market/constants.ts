const TEST_API_KEY = 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c'
const API_KEY = process.env.API_KEY ?? TEST_API_KEY

const URL_TEST = 'https://sandbox-api.coinmarketcap.com'
const API_URL = process.env.API_URL ?? URL_TEST

function getHostData() {
  const isTest = API_KEY === TEST_API_KEY
  if (isTest) {
    console.warn('API IN TEST MODE. Define API_KEY and API_URL in .env file')
  }

  return {
    key: API_KEY,
    url: isTest ? URL_TEST : API_URL
  }
}
export const HOST = getHostData()
