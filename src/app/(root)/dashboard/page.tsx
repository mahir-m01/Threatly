import React from 'react'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/better-auth/auth'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
    const authInstance = await auth();
    const session = await authInstance.api.getSession({
        headers: await headers()
    });

    // If no session, redirect to sign-in
    if (!session || !session.user) {
        redirect('/sign-in');
    }

    // Format date on server to prevent hydration mismatch
    const formattedDate = new Date(session.user.createdAt).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Pass user data with formatted date to client component
    return <DashboardClient
        user={{
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            createdAt: formattedDate
        }}
    />;
}

