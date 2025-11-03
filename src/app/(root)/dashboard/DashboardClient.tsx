"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { signOut } from '@/lib/better-auth/client'

interface User {
    id: string;
    name: string;
    email: string;
    createdAt: string; // Pre-formatted date string from server
}

interface DashboardClientProps {
    user: User;
}

export default function DashboardClient({ user }: DashboardClientProps) {
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await signOut();
            toast.success('Logged out successfully');
            router.push('/sign-in');
        } catch (error) {
            toast.error('Failed to logout');
        }
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-2xl mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Welcome, {user.name}! 👋
                            </h1>
                            <p className="text-white/70 text-sm">
                                You&apos;re now logged into your dashboard
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 px-6 py-2.5 rounded-lg font-medium text-sm transition-all"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* User Info Card */}
                <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-2xl">
                    <h2 className="text-xl font-bold text-white mb-4">User Information</h2>
                    <div className="space-y-3">
                        <div>
                            <p className="text-white/50 text-xs mb-1">User ID</p>
                            <p className="text-white text-sm font-medium font-mono">{user.id}</p>
                        </div>
                        <div>
                            <p className="text-white/50 text-xs mb-1">Full Name</p>
                            <p className="text-white text-base font-medium">{user.name}</p>
                        </div>
                        <div>
                            <p className="text-white/50 text-xs mb-1">Email Address</p>
                            <p className="text-white text-base font-medium">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-white/50 text-xs mb-1">Account Created</p>
                            <p className="text-white text-base font-medium">
                                {user.createdAt}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

