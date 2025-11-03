import React from 'react'
import Link from 'next/link'
import Logo from '@/assets/images/logo.svg'
import { Toaster } from '@/components/ui/sonner'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-screen flex flex-col bg-[linear-gradient(to_bottom,#000,#0D2042_34%,#2167A1_65%,#6ea3DB_82%)]">

            <div className="sticky top-0 z-10">
                <div className="px-4 py-4 flex justify-center">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Logo className="h-12 w-12 relative" />
                        <h1 className="text-white text-2xl font-medium">Threatly</h1>
                    </Link>
                </div>
            </div>


            <div className="flex overflow-y-auto flex-1 items-center justify-center p-4">
                <div className="w-full max-w-md py-4">
                    {children}
                </div>
            </div>
            <Toaster />
        </div>
    )
}
