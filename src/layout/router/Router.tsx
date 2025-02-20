import React, { Fragment } from 'react'

import Banner from '@/components/ui/banner/Banner'
import Discount from '@/components/ui/discount/Discount'
import Category from '@/components/ui/category/Category'

export default function Router() {
    return (
        <Fragment>
            <Banner />
            <Discount />
            <Category />
        </Fragment>
    )
}
