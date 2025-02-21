import React from 'react'

export default function PatnerSkelaton() {
    return (
        <section className='min-h-full py-0 px-0 sm:py-4 sm:px-4'>
            <div className="container">
                {/* Header Section with modern styling skeleton */}
                <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
                    <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                        <div className="space-y-4">
                            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
                                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                        <div className="h-12 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                </div>

                {/* Modern Grid Layout Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl shadow-sm border border-gray-100"
                        >
                            {/* Image skeleton */}
                            <div className="relative h-48 bg-gray-200 animate-pulse"></div>

                            {/* Content skeleton */}
                            <div className="p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
                                    <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}