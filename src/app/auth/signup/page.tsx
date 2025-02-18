import { Metadata } from 'next'

import React from 'react'

import SignUpContent from "@/components/auth/signup/SignUpContent"

export const metadata: Metadata = {
    title: 'Signup | Food Delivery',
    description: 'Signup to your account',
}

export default function Signup() {
    return (
        <SignUpContent />
    )
}
