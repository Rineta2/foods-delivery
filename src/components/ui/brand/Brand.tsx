"use client"

import React, { useEffect, useState } from 'react'

import CategorySkelaton from '@/components/ui/category/CategorySkelaton'

import Image from 'next/image'

import { FetchBrands } from '@/components/ui/brand/lib/brand'

import { Brand as BrandType } from '@/components/ui/brand/lib/interface'

export default function Brand() {
    const [brands, setBrands] = useState<BrandType[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadBrands = async () => {
            const unsubscribe = await FetchBrands((brands) => {
                const sortedBrands = [...brands].sort((a, b) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                })
                setBrands(sortedBrands)
                setLoading(false)
            })

            return () => unsubscribe()
        }

        loadBrands()
    }, [])

    if (loading) return <CategorySkelaton />

    return (
        <section className='min-h-full px-4 lg:px-6 mt-10'>
            <div className="container">
                <div className="flex flex-col sm:flex-row sm:justify-between justify-start items-start sm:items-center gap-4">
                    <h2 className='text-xl md:text-2xl lg:text-3xl font-extrabold flex items-center gap-2 flex-wrap'>
                        Popular Restaurants
                    </h2>
                </div>

                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4 mt-6 md:mt-10'>
                    {brands.map((brand) => (
                        <div
                            className="relative rounded-lg w-full overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            key={brand.id}
                        >
                            <div className='w-full aspect-[4/3] relative'>
                                <Image
                                    src={brand.imageUrl}
                                    alt={brand.title}
                                    fill
                                    className='object-cover'
                                />
                            </div>

                            <div className='w-full bg-primary p-3 md:p-4'>
                                <h3 className='text-background text-base font-bold line-clamp-2'>{brand.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
