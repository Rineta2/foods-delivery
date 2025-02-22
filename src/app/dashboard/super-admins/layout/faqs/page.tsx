import React from 'react'

import { Metadata } from 'next'

import FaqsContent from '@/components/dashboard/super-admins/layout/faqs/FaqsContent'

export const metadata: Metadata = {
    title: "Food Delivery | Faqs",
    description: "Food Delivery | Faqs",
}

export default function Faqs() {
    return (
        <FaqsContent />
    )
}
