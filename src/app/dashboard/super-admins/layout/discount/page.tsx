import React from 'react'

import DiscountContent from '@/components/dashboard/super-admins/layout/discount/DiscountContent'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Food Delivery | Discount Management',
    description: 'Food Delivery | Discount Management',
}

export default function page() {
    return (
        <DiscountContent />
    )
}
