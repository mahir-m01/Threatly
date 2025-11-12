"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import axios from 'axios'
import { FC } from 'react'

interface UserData {
    id: string
    email: string
    name: string
}

const DashboardPage: FC = () => {
    const router = useRouter()
    const [user, setUser] = useState<UserData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token')
                
                if (!token) {
                    toast.error('No token found. Please login again.')
                    router.push('/sign-in')
                    return
                }
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'
                const response = await axios.get(`${backendUrl}/api/auth/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
                
                const data = response.data
                
                if (data.success) {
                    setUser(data.data)
                } else {
                    toast.error('Failed to load user profile')
                    router.push('/sign-in')
                }
            } catch (error: any) {
                console.error('Error fetching profile:', error)
                toast.error('Failed to load user profile')
                router.push('/sign-in')
            } finally {
                setLoading(false)
            }
        }

        fetchUserProfile()
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem('token')
        toast.success('Logged out successfully')
        router.push('/sign-in')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[linear-gradient(to_bottom,#000,#0D2042_34%,#2167A1_65%,#6ea3DB_82%)] flex items-center justify-center">
                <div className="text-white text-lg">Loading...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[linear-gradient(to_bottom,#000,#0D2042_34%,#2167A1_65%,#6ea3DB_82%)]">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
 
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-white">Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="px-6 py-2.5 bg-red-600/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-600/30 transition-all text-sm font-medium"
                    >
                        Logout
                    </button>
                </div>

    
                <div className="bg-black/40 backdrop-blur-sm border border-[#82BFFF]/30 rounded-xl p-6 shadow-2xl mb-4">
                    <p className="text-[#82BFFF] text-sm font-medium mb-2">User ID</p>
                    <p className="text-white text-lg font-mono">{user?.id}</p>
                </div>

                <div className="bg-black/40 backdrop-blur-sm border border-[#82BFFF]/30 rounded-xl p-6 shadow-2xl">
                    <p className="text-[#82BFFF] text-sm font-medium mb-2">Email</p>
                    <p className="text-white text-lg">{user?.email}</p>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage
