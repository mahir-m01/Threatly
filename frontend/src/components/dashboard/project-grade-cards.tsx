"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "sonner"
import { IconArrowRight } from "@tabler/icons-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusIndicator } from "@/components/ui/status-indicator"

interface Project {
  id: string
  name: string
  link: string
  status: "active" | "inactive"
  httpGrade?: string
  sslGrade?: string
}

function getGradeColor(grade: string): string {
  const g = grade.toUpperCase()
  if (g === 'A+' || g === 'A') return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
  if (g === 'B') return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  if (g === 'C') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  if (g === 'D') return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
  if (g === 'F') return 'bg-red-500/20 text-red-400 border-red-500/30'
  return 'bg-muted text-muted-foreground border-border'
}

function GradeBadge({ grade, label }: { grade?: string; label: string }) {
  if (!grade) {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <Badge variant="outline" className="bg-muted/50">
          --
        </Badge>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      <Badge variant="outline" className={`${getGradeColor(grade)} font-bold text-base px-3 py-1`}>
        {grade}
      </Badge>
    </div>
  )
}

export function ProjectGradeCards() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjectsWithGrades = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
        
        const response = await axios.get(`${apiUrl}/api/projects`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (response.data.success) {
          const projectsData = response.data.data.slice(0, 5) // limits to 5 projects
          
          const projectsWithGrades = await Promise.all(
            projectsData.map(async (project: any) => {
              try {
          
                const httpResponse = await axios.get(
                  `${apiUrl}/api/projects/${project.id}/analyze/mozilla/latest`,
                  { withCredentials: true }
                ).catch(() => ({ data: { success: false } }))
   
                const sslResponse = await axios.get(
                  `${apiUrl}/api/projects/${project.id}/analyze/ssl/latest`,
                  { withCredentials: true }
                ).catch(() => ({ data: { success: false } }))

                return {
                  ...project,
                  httpGrade: httpResponse.data?.data?.grade,
                  sslGrade: sslResponse.data?.data?.grade,
                }
              } catch (error) {
                console.error('Error fetching grades for project:', project.id, error)
                return project
              }
            })
          )

          setProjects(projectsWithGrades)
        }
      } catch (error: any) {
        toast.error("Failed to load projects")
      } finally {
        setLoading(false)
      }
    }

    fetchProjectsWithGrades()
  }, [])

  if (loading) {
    return (
      <div className="px-4 lg:px-6">
        <div className="flex items-center gap-4 overflow-x-auto pb-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="min-w-[280px] animate-pulse">
              <CardHeader className="pb-4">
                <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="pt-4 border-t">
                <div className="flex justify-around gap-4">
                  <div className="h-16 bg-muted rounded w-20"></div>
                  <div className="h-16 bg-muted rounded w-20"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="px-4 lg:px-6">
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">No projects yet</p>
              <Button onClick={() => router.push("/dashboard/quick-create")}>
                Create Your First Project
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="px-4 lg:px-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Your Projects</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard/scans")}
          className="gap-1"
        >
          View Detailed Scans
          <IconArrowRight className="size-4" />
        </Button>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="min-w-[280px] flex-shrink-0 snap-start cursor-pointer hover:border-primary/50 transition-all duration-200 hover:shadow-lg @container/card"
            onClick={() => router.push(`/dashboard/scans?project=${project.id}`)}
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-base truncate flex items-center gap-2">
                {project.name}
                <StatusIndicator status={project.status} />
              </CardTitle>
              <CardDescription className="text-xs truncate">
                {project.link}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 border-t border-border/50">
              <div className="flex justify-around gap-4">
                <GradeBadge grade={project.httpGrade} label="HTTP" />
                <GradeBadge grade={project.sslGrade} label="SSL" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
