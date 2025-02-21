"use client"

import React, { useEffect, useState } from 'react'

import CategorySkelaton from '@/components/ui/category/CategorySkelaton'

import { CategoryProduct } from '@/components/ui/category/lib/interface'

import { fetchCategoryProducts } from '@/components/ui/category/lib/categoryService'

import Image from 'next/image'

export default function Category() {
    const [categoryProducts, setCategoryProducts] = useState<CategoryProduct[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadCategoryProducts = async () => {
            const unsubscribe = await fetchCategoryProducts((products) => {
                setCategoryProducts(products)
                setLoading(false)
            })

            return () => unsubscribe()
        }

        loadCategoryProducts()
    }, [])

    if (loading) return <CategorySkelaton />

    return (
        <section className='min-h-full px-4 lg:px-6 mt-10'>
            <div className="container">
                <div className="flex flex-col sm:flex-row sm:justify-between justify-start items-start sm:items-center gap-4">
                    <h2 className='text-xl md:text-2xl lg:text-3xl font-extrabold flex items-center gap-2 flex-wrap'>
                        Order.uk Popular Categories 🤩
                    </h2>
                </div>

                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4 mt-6 md:mt-10'>
                    {categoryProducts.map((categoryProduct) => (
                        <div
                            className="relative rounded-lg w-full overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            key={categoryProduct.id}
                        >
                            <div className='w-full aspect-[3/3] relative'>
                                <Image
                                    src={categoryProduct.imageUrl}
                                    alt={categoryProduct.title}
                                    fill
                                    className='object-cover'
                                />
                            </div>

                            <div className='w-full bg-[#f5f5f5] p-3 md:p-4'>
                                <h3 className='text-title text-base font-bold line-clamp-2'>{categoryProduct.title}</h3>
                                <span className='text-primary text-sm'>21 Restaurants</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
