import React, { useState } from 'react'

import Link from 'next/link'

import Image from 'next/image'

import logo from '@/assets/logo/logo.png'

import { navLink } from '@/layout/header/data/data'

import { TiThMenu } from "react-icons/ti";

import { FaCartArrowDown, FaStar } from "react-icons/fa";

import { IoLocation, IoPersonCircleOutline } from "react-icons/io5";

import { IoMdArrowDropdown } from "react-icons/io";

import { useAuth } from '@/layout/router/context/AuthContext';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user, logout, getDashboardUrl } = useAuth();

    return (
        <header className='fixed top-0 left-0 right-0 z-50 bg-white shadow-sm'>
            <div className='container mx-auto px-4 lg:px-6'>
                {/* Top Bar */}
                <div className="flex items-center justify-between py-2.5 text-sm border-b bg-white border-gray-100">
                    <p className='flex items-center gap-2 text-gray-600 text-[11px] sm:text-xs md:text-sm'>
                        <FaStar className="text-yellow-500" />
                        Get 5% OFF your first order
                        <Link href="#" className='text-[#ff8a00] font-medium hover:underline transition-colors'>ORDER5</Link>
                    </p>

                    <div className="hidden md:flex items-center gap-4 lg:gap-10 text-gray-600">
                        <div className="flex items-center gap-2">
                            <IoLocation className="text-gray-400 flex-shrink-0" />
                            <p className="text-sm">Regent Street, A4, A4201, London <Link href="#" className="text-[#ff8a00] hover:underline transition-colors">Change Location</Link></p>
                        </div>

                        <div className="flex items-center gap-3 bg-[#00B14F] text-white px-4 py-2 rounded-lg hover:bg-[#00a047] transition-colors">
                            <FaCartArrowDown className="text-lg" />
                            <span className="hidden lg:inline">23 Items</span>
                            <span>GBP 78.89</span>
                        </div>
                    </div>

                    <div className="flex md:hidden items-center gap-2 bg-[#00B14F] text-white px-3 py-1.5 rounded-lg text-xs">
                        <FaCartArrowDown />
                        <span>GBP 78.89</span>
                    </div>
                </div>

                {/* Main Navigation */}
                <nav className='flex items-center justify-between'>
                    <Link href="/" className="w-20 sm:w-24">
                        <Image src={logo} alt="logo" className="w-full h-auto" priority />
                    </Link>

                    <ul className="hidden md:flex items-center gap-6 lg:gap-8">
                        {navLink.map((item, index) => (
                            <li key={index}>
                                <Link
                                    href={item.href}
                                    className="text-gray-700 hover:text-[#ff8a00] transition-colors font-medium"
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-center gap-4">
                        {!user ? (
                            <Link
                                href="/auth/login"
                                className="hidden md:block px-6 py-2.5 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors text-sm font-medium"
                            >
                                Login/Signup
                            </Link>
                        ) : (
                            <div className="relative hidden md:block">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 hover:bg-orange-50"
                                >
                                    {user.photoURL ? (
                                        <Image
                                            src={user.photoURL}
                                            alt="Profile"
                                            className="w-5 h-5 rounded-full object-cover"
                                            width={20}
                                            height={20}
                                        />
                                    ) : (
                                        <IoPersonCircleOutline className="w-5 h-5 text-orange-500" />
                                    )}
                                    <span className="text-sm font-medium max-w-[120px] truncate text-gray-700">
                                        {user.displayName}
                                    </span>
                                    <IoMdArrowDropdown className={`transition-transform duration-200 text-orange-500 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-gray-100 py-1">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{user.displayName}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>

                                        <Link
                                            href={getDashboardUrl(user.role)}
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-orange-100">🍽️</span>
                                            {user.role === 'super-admins' || user.role === 'seller' ? 'Dashboard' : 'My Orders'}
                                        </Link>

                                        <button
                                            onClick={async () => {
                                                await logout();
                                                setIsProfileOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                                        >
                                            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-orange-100">🚪</span>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            className="md:hidden text-2xl text-gray-700 hover:text-[#ff8a00] transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <TiThMenu />
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-t animate-fadeIn">
                        <ul className="flex flex-col space-y-3">
                            {navLink.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        href={item.href}
                                        className="block px-4 py-2.5 text-gray-700 hover:text-[#ff8a00] hover:bg-gray-50 transition-colors rounded-lg"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                            {user ? (
                                <>
                                    <li>
                                        <Link
                                            href={getDashboardUrl(user.role)}
                                            className="block px-4 py-2.5 text-gray-700 hover:text-[#ff8a00] hover:bg-gray-50 transition-colors rounded-lg"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={async () => {
                                                await logout();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-gray-700 hover:text-[#ff8a00] hover:bg-gray-50 transition-colors rounded-lg"
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <li>
                                    <Link
                                        href="/auth/login"
                                        className="block px-4 py-2.5 text-gray-700 hover:text-[#ff8a00] hover:bg-gray-50 transition-colors rounded-lg"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Login/Signup
                                    </Link>
                                </li>
                            )}
                            <li>
                                <div className="px-4 flex items-center gap-2 text-gray-600">
                                    <IoLocation className="text-gray-400 flex-shrink-0" />
                                    <p className="text-sm">Regent Street, A4, A4201, London <Link href="#" className="text-[#ff8a00] hover:underline transition-colors">Change Location</Link></p>
                                </div>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </header>
    )
}
