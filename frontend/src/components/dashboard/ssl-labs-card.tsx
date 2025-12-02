"use client"

import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardFooter, CardContent } from "@/components/ui/card"

type Props = {
  projectId: string
}

export default function SSLLabsCard({ projectId }: Props) {
  const [loading, setLoading] = useState(false)
  const [sslResult, setSslResult] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchLatest = useCallback(async () => {
    setError(null)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'
      const response = await axios.get(`${apiUrl}/api/projects/${projectId}/analyze/ssl/latest`, {
        withCredentials: true
      })
      if (response.data.success && response.data.data) {
        setSslResult(response.data.data)
      } else {
        setSslResult(null)
      }
    } catch {
      setError('Could not fetch latest scan')
    }
  }, [projectId])

  useEffect(() => {
    fetchLatest()
  }, [fetchLatest])

  const runScan = useCallback(async () => {
    setLoading(true)
    setError(null)
    setSslResult(null)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'
      const response = await axios.post(`${apiUrl}/api/projects/${projectId}/analyze/ssl`, {}, {
        withCredentials: true,
        timeout: 360000 // 6 minutes timeout
      })

      if (response.data.success) {
        setSslResult(response.data.data)
      } else {
        setError(response.data.error || 'Scan failed')
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Network error'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [projectId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>SSL/TLS Security</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <div className="text-red-600">{error}</div>}

        {loading && !sslResult && (
          <div className="text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              <span>Scanning... This typically takes 2-5 minutes for new scans</span>
            </div>
          </div>
        )}

        {!sslResult && !error && !loading && (
          <div className="text-muted-foreground">No scan available</div>
        )}

        {sslResult && (
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="font-medium">Grade:</div>
              <div className="text-lg font-semibold">{sslResult.grade}</div>
              {sslResult.hasWarnings && <span className="text-yellow-400 text-sm">(warnings)</span>}
            </div>

            <div>
              <div className="font-medium mb-1">Protocol Support:</div>
              <div className="grid grid-cols-2 gap-1 text-sm">
                <div className={sslResult.supportsTLS13 ? "text-green-400" : "text-red-400"}>
                  TLS 1.3: {sslResult.supportsTLS13 ? "Yes" : "No"}
                </div>
                <div className={sslResult.supportsTLS12 ? "text-green-400" : "text-red-400"}>
                  TLS 1.2: {sslResult.supportsTLS12 ? "Yes" : "No"}
                </div>
                <div className={sslResult.supportsTLS11 ? "text-yellow-400" : "text-green-400"}>
                  TLS 1.1: {sslResult.supportsTLS11 ? "Yes (deprecated)" : "No"}
                </div>
                <div className={sslResult.supportsTLS10 ? "text-yellow-400" : "text-green-400"}>
                  TLS 1.0: {sslResult.supportsTLS10 ? "Yes (deprecated)" : "No"}
                </div>
              </div>
            </div>

            <div>
              <div className="font-medium mb-1">Vulnerabilities:</div>
              <div className="grid grid-cols-2 gap-1 text-sm">
                <div className={sslResult.vulnHeartbleed ? "text-red-400" : "text-green-400"}>
                  Heartbleed: {sslResult.vulnHeartbleed ? "Vulnerable" : "Safe"}
                </div>
                <div className={sslResult.vulnPoodle ? "text-red-400" : "text-green-400"}>
                  POODLE: {sslResult.vulnPoodle ? "Vulnerable" : "Safe"}
                </div>
                <div className={sslResult.vulnFreak ? "text-red-400" : "text-green-400"}>
                  FREAK: {sslResult.vulnFreak ? "Vulnerable" : "Safe"}
                </div>
                <div className={sslResult.vulnLogjam ? "text-red-400" : "text-green-400"}>
                  Logjam: {sslResult.vulnLogjam ? "Vulnerable" : "Safe"}
                </div>
                <div className={sslResult.vulnBeast ? "text-yellow-400" : "text-green-400"}>
                  BEAST: {sslResult.vulnBeast ? "Vulnerable" : "Safe"}
                </div>
              </div>
            </div>

            <div>
              <div className="font-medium mb-1">Security Headers:</div>
              <div className={sslResult.hstsEnabled ? "text-green-400 text-sm" : "text-red-400 text-sm"}>
                HSTS: {sslResult.hstsEnabled ? "Enabled" : "Not enabled"}
              </div>
            </div>

            {sslResult.certIssuer && (
              <div className="text-sm">
                <span className="font-medium">Cert Issuer:</span> {sslResult.certIssuer}
              </div>
            )}

            {sslResult.certExpires && (
              <div className="text-sm">
                <span className="font-medium">Cert Expires:</span>{' '}
                {new Date(sslResult.certExpires).toLocaleDateString()}
              </div>
            )}

            <div className="text-sm text-muted-foreground">
              Scanned at: {new Date(sslResult.scannedAt).toLocaleString()}
            </div>

            {sslResult.detailsUrl && (
              <a
                href={sslResult.detailsUrl}
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
