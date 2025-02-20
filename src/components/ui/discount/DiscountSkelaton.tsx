import React from 'react'

export default function DiscountSkelaton() {
    return (
        <section className='min-h-full px-4 lg:px-6'>
            <div className="container">
                {/* Header skeleton */}
                <div className="flex flex-col sm:flex-row sm:justify-between justify-start items-start sm:items-center gap-6">
                    <div className='h-8 w-72 bg-gray-200 rounded-lg animate-pulse' />

                    {/* Category buttons skeleton */}
                    <div className="flex items-center gap-4 overflow-x-auto sm:overflow-x-visible pb-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"
                            />
                        ))}
                    </div>
                </div>

                {/* Discount cards skeleton */}
                <div className='flex sm:grid sm:grid-cols-3 gap-2 mt-10 xl:mt-16 overflow-x-auto pb-6'>
                    {[1, 2, 3].map((i) => (
                        <div
                            className="relative rounded-lg overflow-hidden flex-shrink-0 sm:w-full w-[280px]"
                            key={i}
                        >
                            <div className='w-full h-[200px] sm:h-[250px] bg-gray-200 animate-pulse relative'>
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            </div>

                            {/* Title skeleton */}
                            <div className='absolute bottom-0 left-0 w-full px-4 py-6'>
                                <div className='h-6 w-40 bg-gray-300 rounded animate-pulse' />
                            </div>

                            {/* Discount badge skeleton */}
                            <div className='absolute top-0 left-0 m-3'>
                                <div className='h-6 w-16 bg-gray-300 rounded-lg animate-pulse' />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}