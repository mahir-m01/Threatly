"use client"

import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardFooter, CardContent } from "@/components/ui/card"

type Props = {
  projectId: string
}

export default function HttpObservatoryCard({ projectId }: Props) {
  const [loading, setLoading] = useState(false)
  const [httpResult, setHttpResult] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchLatest = useCallback(async () => {
    setError(null)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'
      const response = await axios.get(`${apiUrl}/api/projects/${projectId}/analyze/mozilla/latest`, {
        withCredentials: true
      })
      if (response.data.success && response.data.data) {
        setHttpResult(response.data.data)
      } else {
        setHttpResult(null)
      }
    } catch (err: any) {
      setError('Could not fetch latest scan')
    }
  }, [projectId])

  useEffect(() => {
    fetchLatest()
  }, [fetchLatest])

  const runScan = useCallback(async () => {
    setLoading(true)
    setError(null)
    setHttpResult(null)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'
      const response = await axios.post(`${apiUrl}/api/projects/${projectId}/analyze/mozilla`, {}, {
        withCredentials: true
      })

      if (response.data.http?.success) {
        setHttpResult(response.data.http.data)
      } else {
        setError(response.data.http?.error || 'Scan failed')
      }
    } catch (err: any) {
      setError(err.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }, [projectId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>HTTP Observatory</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <div className="text-red-600">{error}</div>}

        {!httpResult && !error && (
          <div className="text-muted-foreground">No scan available</div>
        )}

        {httpResult && (
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="font-medium">Grade:</div>
              <div className="text-lg font-semibold">{httpResult.grade}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="font-medium">Score:</div>
              <div>{httpResult.score}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="font-medium">Tests:</div>
              <div>
                <span className="text-blue-300">{httpResult.testsPassed} passed</span>
                {" / "}
                <span className={httpResult.testsFailed > 0 ? "text-red-300 font-medium" : ""}>{httpResult.testsFailed} failed</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Scanned at: {new Date(httpResult.scannedAt).toLocaleString()}
            </div>
            {httpResult.detailsUrl && (
              <a
                href={httpResult.detailsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline inline-block mt-2"
              >
                View Full Report →
              </a>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={runScan} disabled={loading}>
          {loading ? 'Scanning...' : 'Run Scan'}
        </Button>
      </CardFooter>
    </Card>
  )
}
