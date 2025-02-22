"use client"

import React, { useEffect, useState } from 'react'

import Image from 'next/image'

import { Faq } from './lib/interface'

import { fetchFaqs } from './lib/faqsService'

import FaqsSkeleton from '@/components/ui/faqs/FaqsSkelaton'

export default function Faqs() {
    const [faqs, setFaqs] = useState<Faq[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [selectedType, setSelectedType] = useState<number>(0)
    const [filteredFaqs, setFilteredFaqs] = useState<Faq[]>([])

    useEffect(() => {
        const loadFaqs = async () => {
            const data = await fetchFaqs()
            setFaqs(data)
            const firstCategory = data[0]?.category || ''
            setSelectedCategory(firstCategory)
            setFilteredFaqs(data.filter(faq => faq.category === firstCategory))
            setLoading(false)
        }

        loadFaqs()
    }, [])

    useEffect(() => {
        const filtered = faqs.filter(
            (faq) => faq.category === selectedCategory
        )
        setFilteredFaqs(filtered)
        setSelectedType(0)
    }, [selectedCategory, faqs])

    const uniqueCategories = [...new Set(faqs.map(faq => faq.category))]

    if (loading) return <FaqsSkeleton />

    return (
        <section className='min-h-full px-4 lg:px-6 mt-10'>
            <div className="container bg-[#03081f] sm:bg-[#f5f5f5] px-4 sm:px-10 py-6 sm:py-10 rounded-3xl">
                <div className="flex flex-col gap-10">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
                        <h2 className='text-3xl md:text-4xl font-bold text-background sm:text-[#03081f]'>
                            Know more about us!
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {uniqueCategories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300
                                        ${selectedCategory === category
                                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                            : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-black border'
                                        }`}
                                >
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    {filteredFaqs.map((faq) => (
                        <div key={faq.id} className="bg-white rounded-2xl p-6 md:p-10 shadow-xl shadow-gray-100">
                            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10">
                                {/* Left side - Questions */}
                                <div className="flex flex-col gap-4 order-1 lg:order-none">
                                    {faq.types.map((type, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedType(index)}
                                            className={`text-left py-4 px-6 rounded-xl transition-all duration-300 text-base
                                                ${selectedType === index
                                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            {type.title}
                                        </button>
                                    ))}
                                </div>

                                {/* Steps Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 lg:mt-0 order-2 lg:order-none">
                                    {faq.types[selectedType].steps.map((step, index) => (
                                        <div key={index}
                                            className="flex flex-col items-center bg-gray-50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:transform hover:-translate-y-1 h-fit"
                                        >
                                            <div className="w-20 h-20 relative mb-4">
                                                <Image
                                                    src={step.image}
                                                    alt={step.title}
                                                    width={500}
                                                    height={500}
                                                    className="object-contain"
                                                />
                                            </div>
                                            <h3 className="font-semibold text-lg text-center mb-2">{step.title}</h3>
                                            <p className="text-sm text-gray-600 text-center leading-relaxed">{step.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
} 