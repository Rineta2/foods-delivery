import React from 'react'

export default function BrandSkelaton() {
    return (
        <section className='min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] lg:min-h-screen flex items-center justify-center mt-20 sm:mt-10'>
            <div className="container mx-auto overflow-hidden relative px-0 sm:px-5">
                {/* Banner skeleton */}
                <div className="relative overflow-hidden rounded-2xl">
                    <div className="w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] bg-gray-200 animate-pulse relative overflow-hidden">
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </div>
                    {/* Gradient overlay skeleton */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                {/* Dots indicator skeleton */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="w-8 h-1 rounded-sm bg-gray-300 relative overflow-hidden"
                        >
                            {/* Shimmer effect for dots */}
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}