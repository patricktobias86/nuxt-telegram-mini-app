import { createHmac } from 'node:crypto'
import { defineEventHandler, getMethod, readBody, setHeaders, createError } from 'h3'


interface TelegramInitData {
  query_id?: string
  user?: string
  auth_date: string
  hash: string
  [key: string]: string | undefined
}

const BOT_TOKEN = process.env.BOT_TOKEN

function verifyTelegramWebAppData(telegramInitData: string): boolean {
  try {
    if (!BOT_TOKEN) {
      console.error('BOT_TOKEN environment variable is not set')
      return false
    }

    const urlParams = new URLSearchParams(telegramInitData)
    const hash = urlParams.get('hash')
    
    if (!hash) {
      return false
    }

    urlParams.delete('hash')

    // Create data-check-string
    const dataCheckArr: string[] = []
    for (const [key, value] of Array.from(urlParams.entries()).sort()) {
      if (value) {
        dataCheckArr.push(`${key}=${value}`)
      }
    }
    const dataCheckString = dataCheckArr.join('\n')

    // Create secret key from bot token
    const secretKey = createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest()

    // Create hash of data-check-string using secret key
    const calculatedHash = createHmac('sha256', secretKey).update(dataCheckString).digest('hex')

    return calculatedHash === hash
  } catch (error) {
    console.error('Error verifying Telegram data:', error)
    return false
  }
}

function isDataFresh(authDate: string, maxAgeSeconds: number = 86400): boolean {
  const authTimestamp = parseInt(authDate, 10)
  const currentTimestamp = Math.floor(Date.now() / 1000)
  return (currentTimestamp - authTimestamp) <= maxAgeSeconds
}

export default defineEventHandler(async (event) => {
  // Set CORS headers
  setHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  })

  // Handle preflight requests
  if (getMethod(event) === 'OPTIONS') {
    return ''
  }

  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    const body = await readBody(event)
    const { initData } = body

    if (!initData) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing initData parameter',
        data: { valid: false }
      })
    }

    // Verify the data authenticity
    const isValid = verifyTelegramWebAppData(initData)

    if (!isValid) {
      return {
        valid: false,
        error: 'Invalid signature'
      }
    }

    // Parse the init data to get user info and check freshness
    const urlParams = new URLSearchParams(initData)
    const authDate = urlParams.get('auth_date')
    
    if (!authDate) {
      return {
        valid: false,
        error: 'Missing auth_date'
      }
    }

    // Check if data is fresh (within 24 hours by default)
    const isFresh = isDataFresh(authDate, 86400)

    if (!isFresh) {
      return {
        valid: false,
        error: 'Data is too old'
      }
    }

    // Parse user data if available
    let user = null
    const userParam = urlParams.get('user')
    if (userParam) {
      try {
        user = JSON.parse(decodeURIComponent(userParam))
      } catch (e) {
        console.warn('Failed to parse user data:', e)
      }
    }

    return {
      valid: true,
      user,
      auth_date: parseInt(authDate, 10),
      query_id: urlParams.get('query_id'),
      start_param: urlParams.get('start_param')
    }

  } catch (error) {
    console.error('API error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
      data: { valid: false }
    })
  }
})
