"use client"

import React, { useEffect, useState } from 'react'

import CategorySkelaton from '@/components/ui/category/CategorySkelaton'

import { CategoryProduct } from '@/components/ui/category/lib/interface'

import { fetchCategoryProducts } from '@/components/ui/category/lib/categoryService'

import Image from 'next/image'

import { RiDiscountPercentFill } from "react-icons/ri";

export default function Category() {
    const [categoryProducts, setCategoryProducts] = useState<CategoryProduct[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadCategoryProducts = async () => {
            const data = await fetchCategoryProducts()
            setCategoryProducts(data)
            setLoading(false)
        }

        loadCategoryProducts()
    }, [])

    if (loading) return <CategorySkelaton />

    return (
        <section className='min-h-full px-4 lg:px-6 mt-16'>
            <div className="container">
                <div className="flex flex-col sm:flex-row sm:justify-between justify-start items-start sm:items-center gap-6">
                    <h2 className='text-2xl sm:text-3xl font-extrabold flex gap-2 sm:flex-row flex-wrap'>
                        Up to -40% <RiDiscountPercentFill className='text-red-500 text-2xl' /> Food exclusive deals
                    </h2>
                </div>

                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-10'>
                    {categoryProducts.map((categoryProduct) => (
                        <div
                            className="relative rounded-lg overflow-hidden w-full"
                            key={categoryProduct.id}
                        >
                            <div className='w-full h-full relative z-[-1]'>
                                <Image
                                    src={categoryProduct.imageUrl}
                                    alt={categoryProduct.title}
                                    width={500}
                                    height={500}
                                    className='object-cover w-full h-[200px] sm:h-[250px]'
                                />
                            </div>

                            <div className='w-full h-[100px] bg-[#f5f5f5] flex items-end justify-start px-4 py-6'>
                                <h3 className='text-black text-lg font-bold'>{categoryProduct.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
