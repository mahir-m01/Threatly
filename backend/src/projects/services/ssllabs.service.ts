import prisma from "../../lib/prisma.js"
import axios from "axios"

const MAX_RETRIES = 5
const BASE_RETRY_DELAY = 1000 // ms
const TIMEOUT = 60000 // ms - SSL Labs can be slow

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

interface SSLLabsEndpoint {
  grade?: string
  hasWarnings?: boolean
  details?: {
    protocols?: Array<{ name: string; version: string }>
    heartbleed?: boolean
    poodle?: boolean
    freak?: boolean
    logjam?: boolean
    vulnBeast?: boolean
    hstsPolicy?: { status: string }
  }
}

interface SSLLabsResponse {
  status?: string
  endpoints?: SSLLabsEndpoint[]
  certs?: Array<{
    notAfter?: number
    issuerSubject?: string
  }>
  host?: string
}

// SSL Labs API Service
// 
// Fetches SSL/TLS security analysis from Qualys SSL Labs API.
// Uses cached results to avoid rate limits and long wait times.
// 
// API Response Structure:
// {
//   status: "READY" | "ERROR" | "DNS" | "IN_PROGRESS",
//   host: "example.com",
//   endpoints: [{
//     grade: "A+" | "A" | "B" | "C" | "D" | "E" | "F" | "T",
//     hasWarnings: boolean,
//     details: {
//       protocols: [{ name: "TLS", version: "1.3" }, ...],
//       heartbleed: boolean,
//       poodle: boolean,
//       freak: boolean,
//       logjam: boolean,
//       vulnBeast: boolean,
//       hstsPolicy: { status: "present" | "absent" }
//     }
//   }],
//   certs: [{
//     issuerSubject: "CN=..., O=Let's Encrypt, ...",
//     notAfter: 1768811630000  // Unix timestamp in ms
//   }]
// }

export async function scanSSLLabs(hostname: string) {
  return scanWithRetry(hostname)
}

async function scanWithRetry(hostname: string, attempt: number = 1): Promise<any> {
  try {
    console.log(`[SSL Labs] Attempting scan for ${hostname} (attempt ${attempt}/${MAX_RETRIES})`)
    
    // First try from cache (maxAge 24 hours)
    let url = `https://api.ssllabs.com/api/v3/analyze?host=${encodeURIComponent(hostname)}&fromCache=on&maxAge=24&all=done`
    
    let response = await axios.get<SSLLabsResponse>(url, { timeout: TIMEOUT })
    let data = response.data

    // If no cache or old cache, start new scan
    if (!data.status || data.status === 'DNS' || data.status === 'IN_PROGRESS') {
      // Only start a new scan if there's no existing scan in progress
      if (data.status !== 'IN_PROGRESS') {
        url = `https://api.ssllabs.com/api/v3/analyze?host=${encodeURIComponent(hostname)}&startNew=on&all=done`
        response = await axios.get<SSLLabsResponse>(url, { timeout: TIMEOUT })
        data = response.data
      }

      // Poll until ready 
      const maxAttempts = 30 // 30 * 10s = 5 minutes
      let attempts = 0
      
      while (data.status !== 'READY' && data.status !== 'ERROR' && attempts < maxAttempts) {
        await delay(10000) // Wait 10 seconds
        
        url = `https://api.ssllabs.com/api/v3/analyze?host=${encodeURIComponent(hostname)}&all=done`
        response = await axios.get<SSLLabsResponse>(url, { timeout: TIMEOUT })
        data = response.data
        attempts++
      }
    }

    if (data.status === 'ERROR') {
      throw new Error('SSL Labs scan failed')
    }

    if (data.status !== 'READY') {
      throw new Error('Scan is still in progress. This usually takes 2-5 minutes for new scans. Please try again in a few minutes.')
    }

    const endpoint = data.endpoints?.[0]
    const details = endpoint?.details
    const cert = data.certs?.[0]

    const protocols = details?.protocols || []

    return {
      grade: endpoint?.grade || 'N/A',
      hasWarnings: endpoint?.hasWarnings ?? false,
      supportsTLS13: protocols.some(p => p.name === 'TLS' && p.version === '1.3'),
      supportsTLS12: protocols.some(p => p.name === 'TLS' && p.version === '1.2'),
      supportsTLS11: protocols.some(p => p.name === 'TLS' && p.version === '1.1'),
      supportsTLS10: protocols.some(p => p.name === 'TLS' && p.version === '1.0'),
      certIssuer: cert?.issuerSubject?.match(/O=([^,]+)/)?.[1] || null,
      certExpires: cert?.notAfter ? new Date(cert.notAfter) : null,
      vulnHeartbleed: details?.heartbleed ?? false,
      vulnPoodle: details?.poodle ?? false,
      vulnFreak: details?.freak ?? false,
      vulnLogjam: details?.logjam ?? false,
      vulnBeast: details?.vulnBeast ?? false,
      hstsEnabled: details?.hstsPolicy?.status === 'present',
      detailsUrl: `https://www.ssllabs.com/ssltest/analyze.html?d=${encodeURIComponent(hostname)}`,
    }
  } catch (err: any) {
    const isRetryable = err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT' || err.response?.status >= 500
    
    if (isRetryable && attempt < MAX_RETRIES) {
      // Exponential backoff
      const retryDelay = BASE_RETRY_DELAY * Math.pow(2, attempt - 1)
      console.log(`[SSL Labs] Error (attempt ${attempt}/${MAX_RETRIES}): ${err.message}. Retrying in ${retryDelay}ms...`)
      await delay(retryDelay)
      return scanWithRetry(hostname, attempt + 1)
    }
    
    console.error(`[SSL Labs] Failed after ${attempt} attempts:`, err.message)
    throw err
  }
}

export async function storeSSLLabsScan(projectId: string, scan: {
  grade: string
  hasWarnings: boolean
  supportsTLS13: boolean
  supportsTLS12: boolean
  supportsTLS11: boolean
  supportsTLS10: boolean
  certIssuer: string | null
  certExpires: Date | null
  vulnHeartbleed: boolean
  vulnPoodle: boolean
  vulnFreak: boolean
  vulnLogjam: boolean
  vulnBeast: boolean
  hstsEnabled: boolean
  detailsUrl: string
}) {
  return await prisma.sSLLabsScan.create({
    data: {
      projectId,
      ...scan,
    },
  })
}

export async function getLatestSSLScan(projectId: string) {
  return await prisma.sSLLabsScan.findFirst({
    where: { projectId },
    orderBy: { scannedAt: 'desc' },
  })
}
