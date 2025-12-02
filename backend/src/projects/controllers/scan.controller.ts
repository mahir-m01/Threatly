import { Request, Response } from "express"
import { getProjectById } from "../services/service.js"
import { scanHttpObservatory, storeHttpObservatoryScan, getLatestHttpScan } from "../services/observatory.service.js"
import { scanSSLLabs, storeSSLLabsScan, getLatestSSLScan } from "../services/ssllabs.service.js"

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string
  }
}

export const analyzeMozilla = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const project = await getProjectById(id)

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    if (project.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }

    // extract hostname from project.link
    let hostname: string
    try {
      const url = new URL(project.link)
      hostname = url.hostname
    } catch (err) {
      // fallback: if link is already a hostname
      hostname = project.link
    }

    try {
      const scan = await scanHttpObservatory(hostname)
      const saved = await storeHttpObservatoryScan(project.id, scan)

      return res.status(200).json({
        http: {
          success: true,
          data: {
            grade: saved.grade,
            score: saved.score,
            testsPassed: saved.testsPassed,
            testsFailed: saved.testsFailed,
            detailsUrl: saved.detailsUrl,
            scannedAt: saved.scannedAt,
          },
        },
      })
    } catch (err: any) {
      console.error('Mozilla scan error:', err)
      return res.status(200).json({
        http: {
          success: false,
          error: err.message || 'Mozilla scan failed',
        },
      })
    }
  } catch (error: any) {
    console.error('Error in analyzeMozilla:', error)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

export const getLatestMozilla = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const project = await getProjectById(id)

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    if (project.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }

    const latest = await getLatestHttpScan(project.id)

    if (!latest) {
      return res.status(200).json({ success: true, data: null })
    }

    return res.status(200).json({
      success: true,
      data: {
        grade: latest.grade,
        score: latest.score,
        testsPassed: latest.testsPassed,
        testsFailed: latest.testsFailed,
        detailsUrl: latest.detailsUrl,
        scannedAt: latest.scannedAt,
      },
    })
  } catch (error: any) {
    console.error('Error in getLatestMozilla:', error)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

export const analyzeSSL = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const project = await getProjectById(id)

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    if (project.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }

    let hostname: string
    try {
      const url = new URL(project.link)
      hostname = url.hostname
    } catch {
      hostname = project.link
    }

    try {
      const scan = await scanSSLLabs(hostname)
      const saved = await storeSSLLabsScan(project.id, scan)

      return res.status(200).json({
        success: true,
        data: saved,
      })
    } catch (err: any) {
      console.error('SSL Labs scan error:', err)
      return res.status(200).json({
        success: false,
        error: err.message || 'SSL Labs scan failed',
      })
    }
  } catch (error: any) {
    console.error('Error in analyzeSSL:', error)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

export const getLatestSSL = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const project = await getProjectById(id)

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    if (project.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }

    const latest = await getLatestSSLScan(project.id)

    if (!latest) {
      return res.status(200).json({ success: true, data: null })
    }

    return res.status(200).json({
      success: true,
      data: latest,
    })
  } catch (error: any) {
    console.error('Error in getLatestSSL:', error)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}
