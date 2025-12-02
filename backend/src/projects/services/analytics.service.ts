import prisma from "../../lib/prisma.js"

export async function getProjectAnalytics(projectId: string, days: number = 30) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const [httpScans, sslScans] = await Promise.all([
    prisma.httpObservatoryScan.findMany({
      where: {
        projectId,
        scannedAt: {
          gte: startDate,
        },
      },
      orderBy: {
        scannedAt: 'asc',
      },
      select: {
        score: true,
        grade: true,
        scannedAt: true,
      },
    }),
    prisma.sSLLabsScan.findMany({
      where: {
        projectId,
        scannedAt: {
          gte: startDate,
        },
      },
      orderBy: {
        scannedAt: 'asc',
      },
      select: {
        grade: true,
        scannedAt: true,
      },
    }),
  ])

  return {
    httpScans,
    sslScans,
  }
}

// convert SSL Labs grade to number for charting
export function gradeToScore(grade: string): number {
  const g = grade.toUpperCase()
  if (g === 'A+') return 100
  if (g === 'A') return 90
  if (g === 'A-') return 85
  if (g === 'B') return 80
  if (g === 'C') return 70
  if (g === 'D') return 60
  if (g === 'F') return 40
  if (g === 'T') return 0 // Trust issues lol
  return 0
}
