import React from 'react'

import CategoryContent from '@/components/dashboard/super-admins/layout/category/CategoryContent'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Food Delivery | Category',
    description: 'Category page for Food Delivery',
}

export default function CategoryPage() {
    return (
        <CategoryContent />
    )
}
