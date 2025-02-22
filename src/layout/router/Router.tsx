import React from 'react'
import Banner from '@/components/ui/banner/Banner'
import Discount from '@/components/ui/discount/Discount'
import Category from '@/components/ui/category/Category'
import Brand from '@/components/ui/brand/Brand'
import OrderingApps from '@/components/ui/ordering-apps/Ordering-apps'
import Partner from '@/components/ui/partner/Partner'
import Faqs from '@/components/ui/faqs/Faqs'
import Progress from '@/components/ui/progress/Progress'

export default function Router() {
    return (
        <main className='overflow-hidden'>
            <Banner />
            <Discount />
            <Category />
            <Brand />
            <OrderingApps />
            <Partner />
            <Faqs />
            <Progress />
        </main>
    )
}
