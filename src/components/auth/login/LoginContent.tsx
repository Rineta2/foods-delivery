'use client'

import React from 'react'

import Image from 'next/image'

import loginImg from "@/assets/auth/login.png"

import googleIcon from "@/assets/auth/google.png"

import { useRouter } from 'next/navigation'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { loginSchema, type LoginInput } from '@/components/auth/login/auth'

import { useAuth } from '@/layout/router/context/AuthContext'

export default function LoginContent() {
    const router = useRouter()
    const { login, loginWithGoogle } = useAuth()
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema)
    })

    const onSubmit = async (data: LoginInput) => {
        try {
            await login(data.email, data.password)
        } catch (error) {
            console.error('Login error:', error)
        }
    }

    const handleRegister = () => {
        router.push('/auth/signup')
    }

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle()
        } catch (error) {
            console.error('Google login error:', error)
        }
    }

    return (
        <section className='flex items-center justify-center min-h-screen p-4'>
            <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-20">
                {/* Left side - Login Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 lg:p-8 rounded-lg shadow-sm w-full max-w-xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <h2 className='text-xl sm:text-2xl font-bold text-orange-600'>Food Delivery</h2>
                        <span className='text-gray-500'>Welcome Back!</span>
                    </div>

                    <div className="mt-8">
                        <h1 className='text-3xl font-bold'>Log in</h1>
                        <p className='text-gray-500 mt-2'>Welcome back! please enter your details.</p>
                    </div>

                    <div className="space-y-4 sm:space-y-6 mt-6 sm:mt-8">
                        <div>
                            <label className="input input-bordered flex items-center gap-2 touch-none">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    className="h-4 w-4 opacity-70">
                                    <path
                                        d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                                    <path
                                        d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                                </svg>
                                <input
                                    type="email"
                                    className="grow text-base"
                                    placeholder="Enter your email"
                                    {...register('email')}
                                    style={{ fontSize: '16px' }}
                                />
                            </label>
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="input input-bordered flex items-center gap-2 touch-none">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    className="h-4 w-4 opacity-70">
                                    <path
                                        fillRule="evenodd"
                                        d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                        clipRule="evenodd" />
                                </svg>
                                <input
                                    type="password"
                                    className="grow text-base"
                                    placeholder="••••••••"
                                    {...register('password')}
                                    style={{ fontSize: '16px' }}
                                />
                            </label>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                                <span className="ml-2 text-sm text-gray-600">Remember 14 days</span>
                            </label>
                            <a href="#" className="text-sm text-orange-600 hover:text-orange-500">Forgot Password?</a>
                        </div>

                        <button
                            disabled={isSubmitting}
                            className="w-full bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700 transition-colors disabled:bg-orange-400"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center gap-2">
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Signing in...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full border border-gray-200 text-gray-700 py-3 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Image src={googleIcon} alt="Google" className="w-4 h-4" />
                            Sign in with Google
                        </button>
                    </div>

                    <div className="text-center mt-6 text-sm text-gray-500">
                        Email: support@restrofoodle.com
                    </div>
                </form>

                {/* Right side - Image */}
                <div className="relative overflow-hidden rounded-lg hidden lg:block">
                    <div className="absolute inset-0 bg-black/40 z-10 flex flex-col items-center justify-center text-white p-8">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Don&apos;t Have an Account?</h2>
                        <p className="mb-6 text-center">Let&apos;s get you started</p>
                        <button
                            onClick={handleRegister}
                            className="bg-orange-600 px-6 py-3 rounded-md hover:bg-orange-700 transition-colors"
                        >
                            Register Now
                        </button>
                    </div>
                    <Image
                        src={loginImg}
                        alt="Food Background"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Mobile Register Button */}
                <div className="lg:hidden text-center">
                    <p className="mb-4 text-gray-600">Don&apos;t have an account?</p>
                    <button
                        onClick={handleRegister}
                        className="bg-orange-600 px-6 py-3 rounded-md hover:bg-orange-700 transition-colors text-white"
                    >
                        Register Now
                    </button>
                </div>
            </div>
        </section>
    )
}
