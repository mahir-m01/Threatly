import prisma from "../lib/prisma.js"
import axios from "axios"

interface ObservatoryResponse {
  grade?: string
  score?: number
  tests_passed?: number
  tests_failed?: number
  scanned_at?: string
  details_url?: string
  error?: string
  message?: string
}

const MAX_RETRIES = 5
const BASE_RETRY_DELAY = 1000 // ms
const TIMEOUT = 45000 // ms

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function scanWithRetry(hostname: string, attempt: number = 1): Promise<ObservatoryResponse> {
  try {
    const url = `https://observatory-api.mdn.mozilla.net/api/v2/scan?host=${encodeURIComponent(hostname)}`
    
    console.log(`[Observatory] Attempting scan for ${hostname} (attempt ${attempt}/${MAX_RETRIES})`)
    
    const response = await axios.post(url, null, {
      timeout: TIMEOUT,
      headers: {
        'User-Agent': 'Threatly Security Scanner',
        'Accept': 'application/json'
      },
      validateStatus: (status) => status < 600 // Don't throw on any status < 600
    })
    
    console.log(`[Observatory] Response status: ${response.status}`)
    
    // If we got a server error status, retry
    if (response.status >= 500) {
      throw new Error(`Server returned ${response.status}`)
    }
    
    return response.data as ObservatoryResponse
  } catch (err: any) {
    const status = err.response?.status
    const isRetryable = status >= 500 || err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT' || err.message?.includes('Server returned')
    
    if (isRetryable && attempt < MAX_RETRIES) {
      // Exponential backoff: 1s, 2s, 4s, 8s, 16s
      const retryDelay = BASE_RETRY_DELAY * Math.pow(2, attempt - 1)
      console.log(`[Observatory] Error (attempt ${attempt}/${MAX_RETRIES}): ${err.message}. Retrying in ${retryDelay}ms...`)
      await delay(retryDelay)
      return scanWithRetry(hostname, attempt + 1)
    }
    
    console.error(`[Observatory] Failed after ${attempt} attempts:`, err.message)
    throw err
  }
}

export async function scanHttpObservatory(hostname: string) {
  try {
    const data = await scanWithRetry(hostname)

    if (data.error) {
      throw new Error(data.message || data.error)
    }

    return {
      grade: data.grade || 'F',
      score: typeof data.score === 'number' ? data.score : 0,
      testsPassed: data.tests_passed ?? 0,
      testsFailed: data.tests_failed ?? 0,
      detailsUrl: data.details_url || null,
      scannedAt: data.scanned_at ? new Date(data.scanned_at) : new Date(),
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || err.message || 'HTTP Observatory request failed'
    console.error(`HTTP Observatory scan failed for ${hostname}:`, errorMessage)
    throw new Error(errorMessage)
  }
}

export async function storeHttpObservatoryScan(projectId: string, scan: {
  grade: string
  score: number
  testsPassed: number
  testsFailed: number
  detailsUrl: string | null
  scannedAt: Date
}) {
  return await prisma.httpObservatoryScan.create({
    data: {
      projectId,
      grade: scan.grade,
      score: scan.score,
      testsPassed: scan.testsPassed,
      testsFailed: scan.testsFailed,
      detailsUrl: scan.detailsUrl,
      scannedAt: scan.scannedAt,
    },
  })
}

export async function getLatestHttpScan(projectId: string) {
  return await prisma.httpObservatoryScan.findFirst({
    where: { projectId },
    orderBy: { scannedAt: 'desc' },
  })
}
