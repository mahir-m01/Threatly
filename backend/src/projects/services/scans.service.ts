import prisma from "../../lib/prisma.js"

interface ScanFilters {
  projectId?: string
  scanType?: "http" | "ssl" | "all"
  startDate?: Date
  endDate?: Date
  searchQuery?: string
}

interface PaginationOptions {
  page: number
  limit: number
}

export async function getAllScans(
  userId: string,
  filters: ScanFilters,
  pagination: PaginationOptions
) {
  const { projectId, scanType = "all", startDate, endDate, searchQuery } = filters
  const { page, limit } = pagination
  const skip = (page - 1) * limit

  // Build where clause for project ownership
  const projectWhere = {
    project: {
      userId,
      ...(projectId && { id: projectId }),
      ...(searchQuery && {
        name: {
          contains: searchQuery,
          mode: "insensitive" as const,
        },
      }),
    },
  }

  // Date filter
  const dateFilter = {
    ...(startDate && { gte: startDate }),
    ...(endDate && { lte: endDate }),
  }

  const whereWithDate = {
    ...projectWhere,
    ...(startDate || endDate ? { scannedAt: dateFilter } : {}),
  }

  // Fetch scans based on type
  let httpScans: any[] = []
  let sslScans: any[] = []
  let totalCount = 0

  if (scanType === "all" || scanType === "http") {
    const [scans, count] = await Promise.all([
      prisma.httpObservatoryScan.findMany({
        where: whereWithDate,
        include: {
          project: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
        },
        orderBy: { scannedAt: "desc" },
        ...(scanType === "http" && { skip, take: limit }),
      }),
      prisma.httpObservatoryScan.count({ where: whereWithDate }),
    ])

    httpScans = scans.map((scan) => ({
      id: scan.id,
      type: "HTTP Observatory",
      projectId: scan.project.id,
      projectName: scan.project.name,
      projectStatus: scan.project.status,
      score: scan.score,
      grade: scan.grade,
      scannedAt: scan.scannedAt,
      detailsUrl: scan.detailsUrl,
    }))

    if (scanType === "http") totalCount = count
  }

  if (scanType === "all" || scanType === "ssl") {
    const [scans, count] = await Promise.all([
      prisma.sSLLabsScan.findMany({
        where: whereWithDate,
        include: {
          project: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
        },
        orderBy: { scannedAt: "desc" },
        ...(scanType === "ssl" && { skip, take: limit }),
      }),
      prisma.sSLLabsScan.count({ where: whereWithDate }),
    ])

    sslScans = scans.map((scan) => ({
      id: scan.id,
      type: "SSL Labs",
      projectId: scan.project.id,
      projectName: scan.project.name,
      projectStatus: scan.project.status,
      score: null,
      grade: scan.grade,
      scannedAt: scan.scannedAt,
      detailsUrl: scan.detailsUrl,
    }))

    if (scanType === "ssl") totalCount = count
  }

  // Combine and sort if fetching all
  let allScans = [...httpScans, ...sslScans]
  
  if (scanType === "all") {
    allScans.sort((a, b) => b.scannedAt.getTime() - a.scannedAt.getTime())
    totalCount = allScans.length
    allScans = allScans.slice(skip, skip + limit)
  }

  return {
    scans: allScans,
    total: totalCount,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
  }
}
