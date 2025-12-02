"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import axios from "axios"
import { toast } from "sonner"
import HttpObservatoryCard from "@/components/dashboard/http-observatory-card"
import SSLLabsCard from "@/components/dashboard/ssl-labs-card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Project {
  id: string
  name: string
  link: string
  description: string
  createdAt: string
  updatedAt: string
}

export default function AnalyticsPage() {
  const searchParams = useSearchParams()
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
        const response = await axios.get(`${apiUrl}/api/projects`, {
          withCredentials: true,
        })

        if (response.data.success) {
          setProjects(response.data.data)
          
          // Check if there's a project query parameter
          const projectId = searchParams.get('project')
          if (projectId) {
            const project = response.data.data.find((p: Project) => p.id === projectId)
            if (project) {
              setSelectedProject(project)
            }
          }
        } else {
          toast.error("Failed to load projects")
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to load projects")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [searchParams])

  const handleProjectChange = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    setSelectedProject(project || null)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Run scans and view analytics for your projects
          </p>
        </div>
      </div>

      <div className="max-w-md">
        <label htmlFor="project-select" className="block text-sm font-medium mb-2">
          Select Project
        </label>
        {loading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select onValueChange={handleProjectChange} value={selectedProject?.id}>
            <SelectTrigger id="project-select">
              <SelectValue placeholder="Choose a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.length === 0 ? (
                <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                  No projects found
                </div>
              ) : (
                projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        )}
      </div>

      {selectedProject && (
        <>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{selectedProject.name}</CardTitle>
              <CardDescription>Project Details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Link</h3>
                <a
                  href={selectedProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {selectedProject.link}
                </a>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="text-sm">{selectedProject.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                  <p className="text-sm">
                    {new Date(selectedProject.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                  <p className="text-sm">
                    {new Date(selectedProject.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <HttpObservatoryCard projectId={selectedProject.id} />
          </div>

          <div className="mt-6">
            <SSLLabsCard projectId={selectedProject.id} />
          </div>
        </>
      )}

      {!selectedProject && !loading && projects.length > 0 && (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <p>Select a project to view analytics</p>
        </div>
      )}

      {!loading && projects.length === 0 && (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <p>No projects available. Create a project to get started.</p>
        </div>
      )}
    </div>
  )
}
