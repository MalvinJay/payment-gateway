export const CTRL_KEY = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
export const STAGING_URL = 'https://7d8d9765.ngrok.io/'
// export const STAGING_URL = 'https://api.flopay.io/'
export const PRODUCTION_URL = 'https://api.flopay.io/'
export const GET_BASE_URI = process.env.NODE_ENV === 'development' ? STAGING_URL : PRODUCTION_URL
