"use client"

import React, { useEffect, useState } from 'react'

import DiscountSkelaton from '@/components/ui/discount/DiscountSkelaton'

import { Discount as DiscountType } from '@/components/ui/discount/lib/interface'

import { fetchDiscounts } from '@/components/ui/discount/lib/discountService'

import Image from 'next/image'

export default function Discount() {
    const [discounts, setDiscounts] = useState<DiscountType[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [filteredDiscounts, setFilteredDiscounts] = useState<DiscountType[]>([])

    useEffect(() => {
        const loadDiscounts = async () => {
            const data = await fetchDiscounts()
            setDiscounts(data)
            setFilteredDiscounts(data)
            setLoading(false)
        }

        loadDiscounts()
    }, [])

    useEffect(() => {
        if (selectedCategory === 'all') {
            setFilteredDiscounts(discounts)
        } else {
            const filtered = discounts.filter(
                (discount) => discount.category === selectedCategory
            )
            setFilteredDiscounts(filtered)
        }
    }, [selectedCategory, discounts])

    // Get unique categories
    const uniqueCategories = ['all', ...new Set(discounts.map(discount => discount.category))]

    if (loading) return <DiscountSkelaton />

    return (
        <section className='min-h-full px-4 lg:px-6'>
            <div className="container">
                <div className="flex flex-col sm:flex-row sm:justify-between justify-start items-start sm:items-center gap-6">
                    <h2 className='text-2xl sm:text-3xl font-extrabold flex gap-2 sm:flex-row flex-wrap'>
                        Up to -40% 🎊 Order.uk exclusive deals
                    </h2>

                    <div className="flex items-center gap-4 overflow-x-auto sm:overflow-x-visible pb-2">
                        {uniqueCategories.map((category) => (
                            <button
                                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all
                                    ${selectedCategory === category
                                        ? 'bg-orange-500 text-white'
                                        : 'border border-gray-300 hover:border-orange-500'
                                    }`}
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className='flex sm:grid sm:grid-cols-3 gap-2 mt-10 xl:mt-16 overflow-x-auto pb-6 snap-x snap-mandatory'>
                    {filteredDiscounts.map((discount) => (
                        <div
                            className="category__filter__item relative rounded-lg overflow-hidden flex-shrink-0 sm:w-full w-[280px] snap-start"
                            key={discount.id}
                        >
                            <div className='w-full h-[200px] sm:h-[250px] relative'>
                                <Image
                                    src={discount.imageUrl}
                                    alt={discount.title}
                                    width={500}
                                    height={500}
                                    className='object-cover w-full h-full'
                                />
                            </div>

                            <div className='absolute bottom-0 left-0 w-full h-full flex items-end justify-start px-4 py-6'>
                                <h3 className='text-white text-lg font-bold'>{discount.title}</h3>
                            </div>

                            <div className='absolute top-0 left-0 m-3'>
                                <div className='flex items-center gap-2 bg-[#03081f] px-3 py-1 rounded-lg'>
                                    <span className='text-white text-sm font-bold'>-{discount.discountAmount}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
