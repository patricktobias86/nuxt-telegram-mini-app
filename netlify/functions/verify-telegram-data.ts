import { Handler } from '@netlify/functions'
import { createHmac } from 'node:crypto'

interface TelegramInitData {
  query_id?: string
  user?: string
  auth_date: string
  hash: string
  [key: string]: string | undefined
}

const BOT_TOKEN = '8127680485:AAEYn53yj60WFWyojtEU8T6mX1Hxj_bHLBg'

function verifyTelegramWebAppData(telegramInitData: string): boolean {
  try {
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

export const handler: Handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  }

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { initData } = JSON.parse(event.body || '{}')

    if (!initData) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing initData parameter',
          valid: false 
        })
      }
    }

    // Verify the data authenticity
    const isValid = verifyTelegramWebAppData(initData)

    if (!isValid) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          valid: false,
          error: 'Invalid signature'
        })
      }
    }

    // Parse the init data to get user info and check freshness
    const urlParams = new URLSearchParams(initData)
    const authDate = urlParams.get('auth_date')
    
    if (!authDate) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          valid: false,
          error: 'Missing auth_date'
        })
      }
    }

    // Check if data is fresh (within 24 hours by default)
    const isFresh = isDataFresh(authDate, 86400)

    if (!isFresh) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          valid: false,
          error: 'Data is too old'
        })
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
      statusCode: 200,
      headers,
      body: JSON.stringify({
        valid: true,
        user,
        auth_date: parseInt(authDate, 10),
        query_id: urlParams.get('query_id'),
        start_param: urlParams.get('start_param')
      })
    }

  } catch (error) {
    console.error('Function error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        valid: false 
      })
    }
  }
}
