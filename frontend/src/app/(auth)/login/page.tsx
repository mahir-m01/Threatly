"use client"

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import axios from 'axios'
import { FC } from 'react'

interface SignInFormData {
    email: string
    password: string
}

const SignInPage: FC = () => {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<SignInFormData>({
        mode: "onBlur"
    })

    const onSubmit = async (data: SignInFormData) => {
        try {
            console.log('🔵 Attempting login...');
            // In production (Vercel), use relative path. In dev, use localhost:4000
            const apiUrl = process.env.NODE_ENV === 'production' 
                ? '/api/auth/login' 
                : 'http://localhost:4000/api/auth/login';
            
            const response = await axios.post(apiUrl, {
                email: data.email,
                password: data.password
            })
            
            console.log('✅ Login response:', response.data);
            
            if (response.data.success) {

                localStorage.setItem('token', response.data.data.token)
                
                toast.success('Logged in successfully!')
                
                router.push('/dashboard')
            } else {

                toast.error(response.data.message || 'Failed to log in')
            }
        } catch (error: any) {
            console.error('❌ Login error:', error);
            console.error('❌ Error response:', error.response?.data);
    
            const errorMessage = error.response?.data?.message || 'Failed to log in. Please try again.'
            toast.error(errorMessage)
        }
    }

    return (
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-2xl">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-white tracking-tight mb-1">
                    Welcome Back
                </h1>
                <p className="text-white/70 text-xs">
                    Sign in to your account to continue
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-xs font-medium text-white/90 mb-1.5">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                            }
                        })}
                        className="w-full px-3 py-2 text-sm rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#2167A1] focus:border-transparent transition-all"
                        placeholder="you@example.com"
                    />
                    {errors.email && (
                        <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block text-xs font-medium text-white/90 mb-1.5">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        {...register('password', {
                            required: 'Password is required',
                            minLength: { value: 8, message: 'Password must be at least 8 characters' }
                        })}
                        className="w-full px-3 py-2 text-sm rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#2167A1] focus:border-transparent transition-all"
                        placeholder="••••••••"
                    />
                    {errors.password && (
                        <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-black py-2.5 px-4 rounded-lg font-medium text-sm hover:bg-white/90 transition-all mt-5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                </button>
            </form>

            <div className="mt-5 text-center">
                <p className="text-white/70 text-xs">
                    Don&apos;t have an account?{' '}
                    <Link
                        href="/sign-up"
                        className="text-white font-medium hover:text-[#6ea3DB] transition-colors"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>

            <div className="mt-4 flex items-center">
                <div className="flex-1 border-t border-white/20"></div>
                <span className="px-3 text-white/50 text-xs">OR</span>
                <div className="flex-1 border-t border-white/20"></div>
            </div>

            <div className="mt-4">
                <button
                    type="button"
                    className="w-full bg-white/10 border border-white/20 text-white py-2.5 px-4 rounded-lg font-medium text-sm hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                </button>
            </div>
        </div>
    )
}

export default SignInPage
