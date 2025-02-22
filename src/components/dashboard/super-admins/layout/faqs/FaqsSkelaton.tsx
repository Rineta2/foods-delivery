import React from 'react'

export default function FaqsSkelaton() {
    return (
        <section className='min-h-full py-0 px-0 sm:py-4 sm:px-4'>
            {/* Header Section Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-10 w-full md:w-40 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>

            {/* FAQ Cards Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="bg-white rounded-lg border border-gray-200 p-5">
                        {/* Card Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                            <div className="flex gap-2">
                                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>

                        {/* Card Content */}
                        <div className="space-y-3">
                            <div className="border-t pt-3">
                                <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
                                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mt-2"></div>
                            </div>
                            <div className="flex justify-center mt-4">
                                <div className="h-6 w-32 bg-gray-200 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}