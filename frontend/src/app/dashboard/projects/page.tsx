"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import axios from "axios"
import { IconExternalLink } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusIndicator } from "@/components/ui/status-indicator"

interface Project {
  id: string
  name: string
  link: string
  description: string
  status: "active" | "inactive"
  createdAt: string
}

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
        
        const response = await axios.get(`${apiUrl}/api/projects`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (response.data.success) {
          setProjects(response.data.data)
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
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <div className="text-foreground">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Projects</h1>
            <p className="text-muted-foreground">Manage your projects</p>
          </div>
          <Button onClick={() => router.push("/dashboard/quick-create")}>
            Create Project
          </Button>
        </div>

        {projects.length === 0 ? (
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
        ) : (
          <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
            {projects.map((project) => (
              <Card 
                key={project.id}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => router.push(`/dashboard/projects/${project.id}`)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {project.name}
                    <StatusIndicator status={project.status} />
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {project.link}
                      <IconExternalLink className="size-4" />
                    </a>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-muted-foreground">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
