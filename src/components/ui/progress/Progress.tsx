import React from 'react'

export default function Progress() {
    return (
        <section className='min-h-full px-4 lg:px-6 mt-10'>
            <div className='container bg-primary px-10 py-6 rounded-3xl'>
                <div className='flex flex-col md:flex-row justify-between items-center gap-10 md:gap-4'>
                    <div className='flex-1 flex flex-col items-center justify-center gap-4 sm:gap-2'>
                        <h1 className='text-background text-3xl md:text-4xl font-bold'>546+</h1>
                        <h2 className='text-background text-base sm:text-lg font-bold'>Registered Riders</h2>
                    </div>

                    <div className="hidden md:flex divider divider-horizontal divider-neutral before:bg-background after:bg-background h-20 opacity-50"></div>
                    <div className='flex-1 flex flex-col items-center justify-center gap-2'>
                        <h1 className='text-background text-2xl sm:text-3xl md:text-4xl font-bold'>789,900+</h1>
                        <h2 className='text-background text-base sm:text-lg font-bold'>Orders Delivered</h2>
                    </div>

                    <div className="hidden md:flex divider divider-horizontal divider-neutral before:bg-background after:bg-background h-20 opacity-50"></div>
                    <div className='flex-1 flex flex-col items-center justify-center gap-4 sm:gap-2'>
                        <h1 className='text-background text-3xl md:text-4xl font-bold'>690+</h1>
                        <h2 className='text-background text-base sm:text-lg font-bold'>Restaurants Partner</h2>
                    </div>

                    <div className="hidden md:flex divider divider-horizontal divider-neutral before:bg-background after:bg-background h-20 opacity-50"></div>
                    <div className='flex-1 flex flex-col items-center justify-center gap-4 sm:gap-2'>
                        <h1 className='text-background text-3xl md:text-4xl font-bold'>17,457+</h1>
                        <h2 className='text-background text-base sm:text-lg font-bold'>Food Items</h2>
                    </div>
                </div>
            </div>
        </section>
    )
}
