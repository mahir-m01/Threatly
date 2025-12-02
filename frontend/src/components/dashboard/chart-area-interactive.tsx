"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import axios from "axios"
import { toast } from "sonner"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { StatusIndicator } from "@/components/ui/status-indicator"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

interface Project {
  id: string
  name: string
  status: "active" | "inactive"
}

interface ChartDataPoint {
  date: string
  httpScore: number | null
  sslScore: number | null
}

const chartConfig = {
  httpScore: {
    label: "HTTP Observatory",
    color: "var(--chart-1)",
  },
  sslScore: {
    label: "SSL Labs",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("30d")
  const [projects, setProjects] = React.useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = React.useState<string>("")
  const [chartData, setChartData] = React.useState<ChartDataPoint[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  // Fetch projects
  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
        const response = await axios.get(`${apiUrl}/api/projects`, {
          withCredentials: true,
        })

        if (response.data.success && response.data.data.length > 0) {
          setProjects(response.data.data)
          setSelectedProjectId(response.data.data[0].id)
        }
      } catch (error: any) {
        toast.error("Failed to load projects")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Fetch analytics data when project or time range changes
  React.useEffect(() => {
    const fetchAnalytics = async () => {
      if (!selectedProjectId) {
        setChartData([])
        return
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
        const days = timeRange === "90d" ? 90 : timeRange === "30d" ? 30 : 7
        
        const response = await axios.get(
          `${apiUrl}/api/projects/${selectedProjectId}/analytics?days=${days}`,
          { withCredentials: true }
        )

        if (response.data.success) {
          setChartData(response.data.data)
        }
      } catch (error: any) {
        console.error("Failed to load analytics:", error)
      }
    }

    fetchAnalytics()
  }, [selectedProjectId, timeRange])

  const selectedProject = projects.find(p => p.id === selectedProjectId)

  if (loading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Analytics Over Time</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="h-[250px] w-full animate-pulse bg-muted rounded-lg"></div>
        </CardContent>
      </Card>
    )
  }

  if (projects.length === 0) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Analytics Over Time</CardTitle>
          <CardDescription>No projects available</CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="h-[250px] w-full flex items-center justify-center text-muted-foreground">
            Create a project and run scans to see analytics
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle>Analytics Over Time</CardTitle>
            <CardDescription>
              <span className="hidden @[540px]/card:block">
                Security scores for {selectedProject?.name || "your project"}
              </span>
              <span className="@[540px]/card:hidden">Security scores</span>
            </CardDescription>
          </div>
          <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
            <SelectTrigger className="w-[180px]" size="sm">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {chartData.length === 0 ? (
          <div className="h-[250px] w-full flex items-center justify-center text-muted-foreground">
            No scan data available. Run scans to see analytics.
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillHttp" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-httpScore)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-httpScore)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillSsl" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-sslScore)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-sslScore)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }}
                    indicator="line"
                  />
                }
              />
              <Area
                dataKey="httpScore"
                type="natural"
                fill="url(#fillHttp)"
                stroke="var(--color-httpScore)"
                strokeWidth={2}
              />
              <Area
                dataKey="sslScore"
                type="natural"
                fill="url(#fillSsl)"
                stroke="var(--color-sslScore)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
