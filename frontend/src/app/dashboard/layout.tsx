"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import axios from "axios"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SiteHeader } from "@/components/dashboard/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

interface UserData {
  id: string
  email: string
  name: string
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

        console.log('Fetching user profile from:', `${apiUrl}/api/auth/profile`)
        
        const response = await axios.get(`${apiUrl}/api/auth/profile`, {
          withCredentials: true, 
          headers: {
            "Content-Type": "application/json",
          },
        })

        console.log('Profile response:', response.data)

        if (response.data.success) {
          setUser(response.data.data)
        } else {
          console.error('Profile fetch failed:', response.data)
          toast.error("Failed to load user profile")
          router.push("/sign-in")
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error)
        console.error("Error response:", error.response?.data)
        const errorMessage = error.response?.data?.message || error.message || "Session expired. Please sign in again."
        toast.error(errorMessage)
        router.push("/sign-in")
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(to_bottom,#000,#0D2042_34%,#2167A1_65%,#6ea3DB_82%)] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={user} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
