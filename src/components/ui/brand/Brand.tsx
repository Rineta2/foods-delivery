"use client"

import React, { useEffect, useState } from 'react'

import CategorySkelaton from '@/components/ui/category/CategorySkelaton'

import Image from 'next/image'

import { FetchBrands } from '@/components/ui/brand/lib/brand'

import { Brand as BrandType } from '@/components/ui/brand/lib/interface'

import Link from 'next/link'

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

                <div className='flex sm:grid sm:grid-cols-3 xl:grid-cols-6 gap-2 mt-10 xl:mt-16 overflow-x-auto pb-6 snap-x snap-mandatory'>
                    {brands.map((brand) => (
                        <Link
                            href={`/brand/${brand.id}`}
                            className="category__filter__item relative rounded-lg overflow-hidden flex-shrink-0 sm:w-full w-[180px] snap-start"
                            key={brand.id}
                        >
                            <div className='w-full h-[150px] sm:h-[200px] relative'>
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
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
