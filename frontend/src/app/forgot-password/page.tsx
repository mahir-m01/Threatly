'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import axios from 'axios'
import { FC } from 'react'

interface ForgotPasswordFormData {
  email: string
}

const ForgotPasswordPage: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ForgotPasswordFormData>({
    mode: 'onBlur'
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'
      const response = await axios.post(`${backendUrl}/api/auth/forgot-password`, {
        email: data.email
      })

      if (response.data.success) {
        toast.success('Password reset link sent to your email!')
        reset()
      } else {
        toast.error(response.data.message || 'Failed to send reset link')
      }
    } catch (error: any) {
      console.error('Forgot password error:', error)

      const errorMessage =
        error.response?.data?.message || 'Failed to send reset link. Please try again.'
      toast.error(errorMessage)
    }
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-2xl">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">
          Reset Password
        </h1>
        <p className="text-white/70 text-xs">
          Enter your email to receive a password reset link
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white text-black py-2.5 px-4 rounded-lg font-medium text-sm hover:bg-white/90 transition-all mt-5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div className="mt-5 text-center">
        <p className="text-white/70 text-xs">
          Remember your password?{' '}
          <Link
            href="/sign-in"
            className="text-white font-medium hover:text-[#6ea3DB] transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>

      <div className="mt-4 text-center">
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
    </div>
  )
}

export default ForgotPasswordPage
