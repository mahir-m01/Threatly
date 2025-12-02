"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { toast } from "sonner"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function ProjectDetailPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    link: "",
    description: "",
  })

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
        
        const response = await axios.get(`${apiUrl}/api/projects/${projectId}`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (response.data.success) {
          const project = response.data.data
          setFormData({
            name: project.name,
            link: project.link,
            description: project.description,
          })
        } else {
          toast.error("Failed to load project")
          router.push("/dashboard/projects")
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to load project")
        router.push("/dashboard/projects")
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId, router])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
      
      const response = await axios.put(`${apiUrl}/api/projects/${projectId}`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.data.success) {
        toast.success("Project updated successfully")
        router.push("/dashboard/projects")
      } else {
        toast.error(response.data.message || "Failed to update project")
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update project")
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
      
      const response = await axios.delete(`${apiUrl}/api/projects/${projectId}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.data.success) {
        toast.success("Project deleted successfully")
        router.push("/dashboard/projects")
      } else {
        toast.error(response.data.message || "Failed to delete project")
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete project")
    } finally {
      setDeleting(false)
    }
  }

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
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Edit Project</CardTitle>
            <CardDescription>Update your project details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-4">
              <Field>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter project name"
                  required
                />
              </Field>

              <Field>
                <Label htmlFor="link">Website Link</Label>
                <Input
                  id="link"
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://example.com"
                  required
                />
              </Field>

              <Field>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter project description"
                  required
                />
              </Field>

              <div className="flex gap-4">
                <Button type="submit" disabled={updating}>
                  {updating ? "Updating..." : "Update Project"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/projects")}
                >
                  Cancel
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      disabled={deleting}
                      className="ml-auto"
                    >
                      {deleting ? "Deleting..." : "Delete Project"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Project</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this project? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
