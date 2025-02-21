import React from 'react'

import { Metadata } from 'next'

import HomeContent from "@/components/dashboard/super-admins/layout/home/HomeContent"

export const metadata: Metadata = {
    title: "Food Delivery | Banner",
    description: "Banner Page of Food Delivery",
}

export default function HomePage() {
    return (
        <HomeContent />
    )
}
