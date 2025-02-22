import React from 'react'

export default function CategoryProductSkelaton() {
    return (
        <section className='min-h-full py-0 px-0 sm:py-4 sm:px-4'>
            {/* Header Section Skeleton */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <div className="flex gap-4 flex-col">
                    <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-48 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-12 w-56 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>

            {/* Grid View Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100">
                        {/* Image skeleton */}
                        <div className="relative h-48 bg-gray-200 animate-pulse"></div>

                        {/* Content skeleton */}
                        <div className="p-4">
                            <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-1"></div>
                            <div className="flex justify-between items-center mb-4">
                                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <div className="h-9 w-9 bg-gray-200 rounded-full animate-pulse"></div>
                                <div className="h-9 w-9 bg-gray-200 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}