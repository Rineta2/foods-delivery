import React from 'react'

import { Metadata } from 'next'

import BannerContent from "@/components/dashboard/super-admins/layout/banner/BannerContent"

export const metadata: Metadata = {
    title: "Food Delivery | Banner",
    description: "Banner Page of Food Delivery",
}

export default function BannerPage() {
    return (
        <BannerContent />
    )
}
