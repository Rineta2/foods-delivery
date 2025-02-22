import React, { useState } from 'react'

import { toast } from 'react-hot-toast'

import { FaFacebookF, FaInstagram, FaTiktok, FaSnapchat } from 'react-icons/fa'

import Image from 'next/image'

import Link from 'next/link'

import appStore from '@/assets/app/button/app.png'

import playStore from '@/assets/app/button/play.png'

import logo from '@/assets/logo/logo.png'

import { db } from '@/utils/firebase'

import { collection, addDoc } from 'firebase/firestore'

export default function Footer() {
    const [email, setEmail] = useState('')

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email) {
            toast.error('Please enter your email')
            return
        }

        try {
            await addDoc(collection(db, 'subscribers'), {
                email,
                subscribedAt: new Date(),
            })

            setEmail('')
            toast.success('Thank you for subscribing!')
        } catch {
            toast.error('Something went wrong. Please try again.')
        }
    }

    return (
        <footer className='bg-gradient-to-b from-gray-50 to-gray-100 mt-10 pt-16'>
            <div className='container mx-auto px-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12'>
                    {/* Logo and App Downloads Section */}
                    <div className='space-y-6'>
                        <Image src={logo} alt="Order.uk" width={120} height={120} className='mb-4' />
                        <div className='flex flex-col sm:flex-row gap-4'>
                            <Link href="#" className='transition-transform hover:scale-105'>
                                <Image src={appStore} alt="Download on App Store" width={135} height={40} className='object-contain' />
                            </Link>
                            <Link href="#" className='transition-transform hover:scale-105'>
                                <Image src={playStore} alt="Get it on Google Play" width={135} height={40} className='object-contain' />
                            </Link>
                        </div>
                        <p className='text-sm text-gray-600'>Company # 456039-445. Registered with House of companies</p>
                    </div>

                    {/* Newsletter Section */}
                    <div className='space-y-6'>
                        <h3 className='text-lg font-bold mb-4'>Get Exclusive Deals</h3>
                        <form onSubmit={handleSubscribe} className='flex flex-col sm:flex-row gap-3'>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='px-4 py-3 border border-gray-200 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                            />
                            <button
                                type="submit"
                                className='bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors duration-200'
                            >
                                Subscribe
                            </button>
                        </form>
                        <p className='text-sm text-gray-500'>We respect your privacy. Unsubscribe at any time.</p>

                        {/* Social Media Icons */}
                        <div className='flex gap-6 mt-6'>
                            <Link href="#" className='text-gray-600 hover:text-orange-500 transition-colors text-xl'><FaFacebookF /></Link>
                            <Link href="#" className='text-gray-600 hover:text-orange-500 transition-colors text-xl'><FaInstagram /></Link>
                            <Link href="#" className='text-gray-600 hover:text-orange-500 transition-colors text-xl'><FaTiktok /></Link>
                            <Link href="#" className='text-gray-600 hover:text-orange-500 transition-colors text-xl'><FaSnapchat /></Link>
                        </div>
                    </div>

                    {/* Legal Pages */}
                    <div className='space-y-4'>
                        <h3 className='text-lg font-bold mb-4'>Legal Pages</h3>
                        <ul className='space-y-3'>
                            <li><a href="#" className='text-gray-600 hover:text-orange-500 transition-colors'>Terms and conditions</a></li>
                            <li><a href="#" className='text-gray-600 hover:text-orange-500 transition-colors'>Privacy</a></li>
                            <li><a href="#" className='text-gray-600 hover:text-orange-500 transition-colors'>Cookies</a></li>
                            <li><a href="#" className='text-gray-600 hover:text-orange-500 transition-colors'>Modern Slavery Statement</a></li>
                        </ul>
                    </div>

                    {/* Important Links */}
                    <div className='space-y-4'>
                        <h3 className='text-lg font-bold mb-4'>Important Links</h3>
                        <ul className='space-y-3'>
                            <li><a href="#" className='text-gray-600 hover:text-orange-500 transition-colors'>Get Help</a></li>
                            <li><a href="#" className='text-gray-600 hover:text-orange-500 transition-colors'>Add your restaurant</a></li>
                            <li><a href="#" className='text-gray-600 hover:text-orange-500 transition-colors'>Sign up to deliver</a></li>
                            <li><a href="#" className='text-gray-600 hover:text-orange-500 transition-colors'>Create a business account</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className='border-t border-gray-200 py-8 mt-8'>
                    <div className='flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600'>
                        <p>© {new Date().getFullYear()} Space Digitalia. All Rights Reserved.</p>
                        <div className='flex flex-wrap justify-center gap-6'>
                            <Link href="#" className='hover:text-orange-500 transition-colors'>Privacy Policy</Link>
                            <Link href="#" className='hover:text-orange-500 transition-colors'>Terms</Link>
                            <Link href="#" className='hover:text-orange-500 transition-colors'>Pricing</Link>
                            <Link href="#" className='hover:text-orange-500 transition-colors'>Do not sell my info</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
