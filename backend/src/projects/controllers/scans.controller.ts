import { Request, Response } from "express"
import { getAllScans } from "../services/scans.service.js"
import prisma from "../../lib/prisma.js"

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string
  }
}

export const getScans = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" })
    }

    // Parse query parameters
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const projectId = req.query.projectId as string | undefined
    const scanType = (req.query.scanType as "http" | "ssl" | "all") || "all"
    const searchQuery = req.query.search as string | undefined
    const startDate = req.query.startDate
      ? new Date(req.query.startDate as string)
      : undefined
    const endDate = req.query.endDate
      ? new Date(req.query.endDate as string)
      : undefined

    const result = await getAllScans(
      userId,
      { projectId, scanType, startDate, endDate, searchQuery },
      { page, limit }
    )

    return res.status(200).json({
      success: true,
      data: result.scans,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    })
  } catch (error: any) {
    console.error("Error fetching scans:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const deleteScan = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId
    const { scanId, scanType } = req.body

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" })
    }

    if (!scanId || !scanType || !["http", "ssl"].includes(scanType)) {
      return res.status(400).json({
        success: false,
        message: "scanId and scanType (http/ssl) are required",
      })
    }

    // Verify user owns the project that contains this scan
    let scan
    if (scanType === "http") {
      scan = await prisma.httpObservatoryScan.findUnique({
        where: { id: scanId },
        include: { project: { select: { userId: true } } },
      })
    } else {
      scan = await prisma.sSLLabsScan.findUnique({
        where: { id: scanId },
        include: { project: { select: { userId: true } } },
      })
    }

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: "Scan not found",
      })
    }

    if (scan.project.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      })
    }

    // Delete the scan
    if (scanType === "http") {
      await prisma.httpObservatoryScan.delete({
        where: { id: scanId },
      })
    } else {
      await prisma.sSLLabsScan.delete({
        where: { id: scanId },
      })
    }

    return res.status(200).json({
      success: true,
      message: "Scan deleted successfully",
    })
  } catch (error: any) {
    console.error("Error deleting scan:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

