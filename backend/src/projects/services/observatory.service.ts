import prisma from "../../lib/prisma.js"
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

export async function scanHttpObservatory(hostname: string) {
  const url = `https://observatory-api.mdn.mozilla.net/api/v2/scan?host=${encodeURIComponent(hostname)}`

  try {
    const response = await axios.post(url)
    const data = response.data as ObservatoryResponse

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
    throw new Error(err.response?.data?.message || err.message || 'HTTP Observatory request failed')
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
