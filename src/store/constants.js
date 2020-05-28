// export const URL = 'https://d6ad503b.ngrok.io/';
export const URL = 'https://api.flopay.io/';
export const PRODUCTION_URL = 'https://api.flopay.io/'
export const GET_BASE_URI = process.env.NODE_ENV === 'development' ? URL : PRODUCTION_URL
export const CTRL_KEY = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
