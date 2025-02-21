import React from 'react'

import Image from 'next/image'

import appStoreBadge from '@/assets/app/button/app.png'

import googlePlayBadge from '@/assets/app/button/play.png'

import people from '@/assets/app/people.png'

import Link from 'next/link'

export default function OrderingApps() {

    return (
        <section className='min-h-full px-4 lg:px-6 mt-10 sm:mt-20 overflow-hidden'>
            <div className="container">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-16 bg-[#ededed] rounded-lg">
                    <div className="flex-1 order-2 md:order-1">
                        <Image
                            src={people}
                            alt="People using ordering app"
                            className="w-full h-auto rounded-lg"
                            priority
                        />
                    </div>

                    <div className="flex-1 space-y-6 order-1 md:order-2 py-4 md:py-0">
                        <div className="space-y-4">
                            <h2 className="text-4xl lg:text-5xl leading-tight font-extrabold text-gray-900 tracking-tight">
                                Order<span className="text-orange-500 animate-pulse">.</span>ing is more
                            </h2>

                            <div className="bg-gray-900 text-white rounded-full inline-block px-8 py-3">
                                <h3 className="text-xl lg:text-2xl font-semibold">
                                    <span className="text-orange-400 bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">Personalised</span> & Instant
                                </h3>
                            </div>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Download the Order.uk app for faster ordering
                            </p>
                            <div className="flex gap-6 pt-4">
                                <Link href="#" className="transform hover:scale-105 transition-transform duration-300">
                                    <Image
                                        src={appStoreBadge}
                                        alt="Download on App Store"
                                        height={56}
                                        className="h-14 w-auto"
                                    />
                                </Link>
                                <Link href="#" className="transform hover:scale-105 transition-transform duration-300">
                                    <Image
                                        src={googlePlayBadge}
                                        alt="Get it on Google Play"
                                        height={56}
                                        className="h-14 w-auto"
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
