"use client"

import React, { useEffect, useState } from 'react'

import Image from 'next/image'

import { fetchPartners } from '@/components/ui/partner/lib/partnerService'

import { PartnerType } from '@/components/ui/partner/lib/interface'

import PartnerSkelaton from '@/components/ui/partner/PartnerSkelaton'

import Link from 'next/link'

export default function Partner() {
    const [partners, setPartners] = useState<PartnerType[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPartners().then(setPartners)
        setLoading(false)
    }, [])

    if (loading) return <PartnerSkelaton />

    return (
        <section className='min-h-full px-4 lg:px-6 mt-10'>
            <div className="container">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {
                        partners.map((item, index) => {
                            return (
                                <div key={index} className='w-full h-full relative'>
                                    <div className="w-full h-[300px] xl:h-[400px] relative">
                                        <Image src={item.imageUrl} alt={item.title} fill className='object-cover w-full h-full' />
                                    </div>

                                    <div className="absolute top-0 left-4 sm:left-10 flex items-start justify-start py-2 sm:py-3 px-4 sm:px-6 bg-background rounded-b-lg">
                                        <h3 className='text-title text-base sm:text-lg font-bold'>{item.description}</h3>
                                    </div>

                                    <div className="absolute bottom-0 left-0 w-full flex flex-col items-start justify-start py-6 sm:py-8 md:py-11 px-6 sm:px-8 md:px-12">
                                        <h3 className='text-primary text-base sm:text-lg font-bold mb-2'>{item.text}</h3>

                                        <h1 className='text-background text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6' style={{ textTransform: 'capitalize' }}>{item.title}</h1>

                                        <Link href={`${item.link}/${item.category}`} className='text-background border border-transparent hover:bg-secondary hover:border-secondary transition-all duration-300 w-[160px] sm:w-[200px] text-base sm:text-lg font-bold btn bg-primary rounded-full'>{item.buttonText}</Link>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    )
}
