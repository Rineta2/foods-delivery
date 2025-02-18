import { Metadata } from 'next'

import React from 'react'

import LoginContent from "@/components/auth/login/LoginContent"

export const metadata: Metadata = {
    title: 'Login | Food Delivery',
    description: 'Login to your account',
}

export default function Login() {
    return (
        <LoginContent />
    )
}
