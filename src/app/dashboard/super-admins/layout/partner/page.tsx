import React from 'react'

import { Metadata } from 'next'

import PartnerContent from "@/components/dashboard/super-admins/layout/patner/PartnerContent"

export const metadata: Metadata = {
    title: "Food Delivery | Partner",
    description: "Food Delivery | Partner",
}

export default function Partner() {
    return (
        <PartnerContent />
    )
}
