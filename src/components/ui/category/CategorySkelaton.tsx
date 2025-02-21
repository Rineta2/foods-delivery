import React from 'react'

export default function CategorySkelaton() {
    return (
        <section className='min-h-full px-4 lg:px-6'>
            <div className="container">
                {/* Header skeleton */}
                <div className="flex flex-col sm:flex-row sm:justify-between justify-start items-start sm:items-center gap-4">
                    <div className='h-8 w-72 bg-gray-200 rounded-lg animate-pulse' />
                </div>

                {/* Category cards skeleton */}
                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4 mt-6 md:mt-10'>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            className="relative rounded-lg w-full overflow-hidden shadow-sm"
                            key={i}
                        >
                            <div className='w-full aspect-[3/3] bg-gray-200 animate-pulse relative'>
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            </div>

                            <div className='w-full bg-[#f5f5f5] p-3 md:p-4'>
                                <div className='h-5 w-3/4 bg-gray-200 rounded animate-pulse mb-2' />
                                <div className='h-4 w-1/3 bg-gray-200 rounded animate-pulse' />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}