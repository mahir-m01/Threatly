"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import axios from "axios"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive"
import { DataTable } from "@/components/dashboard/data-table"
import { SectionCards } from "@/components/dashboard/section-cards"
import { SiteHeader } from "@/components/dashboard/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "./data.json"

interface UserData {
  id: string
  email: string
  name: string
}

export default function Page() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Old: Get token from localStorage (kept for reference)
        // const token = localStorage.getItem("token")
        // if (!token) {
        //   toast.error("No token found. Please sign in again.")
        //   router.push("/sign-in")
        //   return
        // }

        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

        const response = await axios.get(`${apiUrl}/api/auth/profile`, {
          withCredentials: true, 
          headers: {
            "Content-Type": "application/json",
          },
          // Old: Authorization header 
          // headers: {
          //   Authorization: `Bearer ${token}`,
          //   "Content-Type": "application/json",
          // },
        })

        if (response.data.success) {
          setUser(response.data.data)
        } else {
          toast.error("Failed to load user profile")
          // Old: localStorage.removeItem("token") 
          router.push("/sign-in")
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error)
        toast.error("Failed to load user profile")
        // Old: localStorage.removeItem("token")
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
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
