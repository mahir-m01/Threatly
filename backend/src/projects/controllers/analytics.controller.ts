import { Request, Response } from "express"
import { getProjectById } from "../services/service.js"
import { getProjectAnalytics, gradeToScore } from "../services/analytics.service.js"

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string
  }
}

export const getAnalytics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user?.userId
    const days = parseInt(req.query.days as string) || 30

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

    const analytics = await getProjectAnalytics(project.id, days)

    // Transform data for chart
    const dateMap = new Map()

    // Add HTTP scans
    analytics.httpScans.forEach(scan => {
      const dateKey = scan.scannedAt.toISOString().split('T')[0]
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, { date: dateKey, httpScore: null, sslScore: null })
      }
      dateMap.get(dateKey).httpScore = scan.score
    })

    // Add SSL scans
    analytics.sslScans.forEach(scan => {
      const dateKey = scan.scannedAt.toISOString().split('T')[0]
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, { date: dateKey, httpScore: null, sslScore: null })
      }
      dateMap.get(dateKey).sslScore = gradeToScore(scan.grade)
    })

    // Convert map to sorted array
    const sortedData = Array.from(dateMap.values()).sort((a, b) => 
      a.date.localeCompare(b.date)
    )

    return res.status(200).json({
      success: true,
      data: sortedData,
    })
  } catch (error: any) {
    console.error('Error in getAnalytics:', error)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}
