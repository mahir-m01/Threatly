"use client"

import * as React from "react"
import axios from "axios"
import { toast } from "sonner"
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconExternalLink,
  IconTrash,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { StatusIndicator } from "@/components/ui/status-indicator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Scan {
  id: string
  type: string
  projectId: string
  projectName: string
  projectStatus?: "active" | "inactive"
  score: number | null
  grade: string
  scannedAt: string
  detailsUrl: string | null
}

interface Project {
  id: string
  name: string
}

export function DataTable({ data }: { data: any }) {
  const [scans, setScans] = React.useState<Scan[]>([])
  const [projects, setProjects] = React.useState<Project[]>([])
  const [loading, setLoading] = React.useState(true)
  
  // Filters
  const [selectedProject, setSelectedProject] = React.useState<string>("all")
  const [scanType, setScanType] = React.useState<string>("all")
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [debouncedSearch, setDebouncedSearch] = React.useState<string>("")
  
  // Pagination
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [total, setTotal] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(10)
  
  // Delete confirmation dialog
  const [deleteConfirm, setDeleteConfirm] = React.useState<{
    scanId: string
    scanType: string
  } | null>(null)

  // Fetch projects
  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
        const response = await axios.get(`${apiUrl}/api/projects`, {
          withCredentials: true,
        })
        if (response.data.success) {
          setProjects(response.data.data)
        }
      } catch (error) {
        console.error("Failed to load projects:", error)
      }
    }
    fetchProjects()
  }, [])

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setPage(1) // Reset to first page on search
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch scans
  React.useEffect(() => {
    const fetchScans = async () => {
      setLoading(true)
      try {
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
        
        const params = new URLSearchParams({
          page: page.toString(),
          limit: pageSize.toString(),
          scanType,
        })
        
        if (selectedProject !== "all") {
          params.append("projectId", selectedProject)
        }
        
        if (debouncedSearch) {
          params.append("search", debouncedSearch)
        }

        const response = await axios.get(
          `${apiUrl}/api/projects/scans?${params.toString()}`,
          { withCredentials: true }
        )

        if (response.data.success) {
          setScans(response.data.data)
          setTotalPages(response.data.pagination.totalPages)
          setTotal(response.data.pagination.total)
        }
      } catch (error: any) {
        console.error("Failed to load scans:", error)
        toast.error("Failed to load scan history")
      } finally {
        setLoading(false)
      }
    }

    fetchScans()
  }, [page, pageSize, selectedProject, scanType, debouncedSearch])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleDeleteScan = async (scanId: string, scanType: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
      const response = await axios.delete(
        `${apiUrl}/api/projects/scans`,
        {
          data: { scanId, scanType: scanType === "HTTP Observatory" ? "http" : "ssl" },
          withCredentials: true,
        }
      )

      if (response.data.success) {
        setScans((prevScans) => prevScans.filter((s) => s.id !== scanId))
        toast.success("Scan deleted successfully")
      }
    } catch (error: any) {
      console.error("Failed to delete scan:", error)
      toast.error("Failed to delete scan")
    } finally {
      setDeleteConfirm(null)
    }
  }

  const getGradeColor = (grade: string) => {
    const g = grade?.toUpperCase() || ""
    if (g === "A+" || g === "A") return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    if (g === "B") return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    if (g === "C") return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    if (g === "D") return "bg-orange-500/20 text-orange-400 border-orange-500/30"
    if (g === "F") return "bg-red-500/20 text-red-400 border-red-500/30"
    return "bg-muted text-muted-foreground border-border"
  }

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <h2 className="text-lg font-semibold">Scan History</h2>
          <Input
            placeholder="Search project names..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-[180px]" size="sm">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={scanType} onValueChange={setScanType}>
            <SelectTrigger className="w-[140px]" size="sm">
              <SelectValue placeholder="All Scans" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scans</SelectItem>
              <SelectItem value="http">HTTP Only</SelectItem>
              <SelectItem value="ssl">SSL Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Score / Grade</TableHead>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : scans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No scans found
                </TableCell>
              </TableRow>
            ) : (
              scans.map((scan) => (
                <TableRow key={scan.id}>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(scan.scannedAt)}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {scan.projectName}
                      {scan.projectStatus && <StatusIndicator status={scan.projectStatus} />}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {scan.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {scan.score !== null ? (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{scan.score}</span>
                        <Badge variant="outline" className={`${getGradeColor(scan.grade)} text-xs`}>
                          {scan.grade}
                        </Badge>
                      </div>
                    ) : (
                      <Badge variant="outline" className={`${getGradeColor(scan.grade)} text-xs`}>
                        {scan.grade}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {scan.detailsUrl && (
                      <a
                        href={scan.detailsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80"
                      >
                        <IconExternalLink className="size-4" />
                      </a>
                    )}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => setDeleteConfirm({ scanId: scan.id, scanType: scan.type })}
                      className="text-destructive hover:text-destructive/80 transition"
                      title="Delete scan"
                    >
                      <IconTrash className="size-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          Showing {scans.length > 0 ? ((page - 1) * pageSize) + 1 : 0} to {Math.min(page * pageSize, total)} of {total} scans
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                setPageSize(Number(value))
                setPage(1)
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={(e) => {
                e.preventDefault()
                setPage(1)
              }}
              disabled={page === 1}
            >
              <IconChevronsLeft />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="size-8"
              size="icon"
              onClick={(e) => {
                e.preventDefault()
                setPage(p => Math.max(1, p - 1))
              }}
              disabled={page === 1}
            >
              <IconChevronLeft />
            </Button>
            
            <div className="text-sm font-medium">
              Page {page} of {totalPages}
            </div>
            
            <Button
              type="button"
              variant="outline"
              className="size-8"
              size="icon"
              onClick={(e) => {
                e.preventDefault()
                setPage(p => Math.min(totalPages, p + 1))
              }}
              disabled={page === totalPages}
            >
              <IconChevronRight />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={(e) => {
                e.preventDefault()
                setPage(totalPages)
              }}
              disabled={page === totalPages}
            >
              <IconChevronsRight />
            </Button>
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteConfirm !== null} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete scan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this scan? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirm) {
                  handleDeleteScan(deleteConfirm.scanId, deleteConfirm.scanType)
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}