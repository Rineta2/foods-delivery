import React from 'react'
import Banner from '@/components/ui/banner/Banner'
import Discount from '@/components/ui/discount/Discount'
import Category from '@/components/ui/category/Category'
import Brand from '@/components/ui/brand/Brand'
import OrderingApps from '@/components/ui/ordering-apps/Ordering-apps'

export default function Router() {
    return (
        <main className='overflow-hidden'>
            <Banner />
            <Discount />
            <Category />
            <Brand />
            <OrderingApps />
        </main>
    )
}
