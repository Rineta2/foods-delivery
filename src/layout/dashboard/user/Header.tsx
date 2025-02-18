import React from 'react';
import { useAuth } from '@/layout/router/context/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FiLogOut } from 'react-icons/fi';
import Image from 'next/image';
import { menuItems } from './data/Header';

interface HeaderProps {
    onSidebarToggle: (isOpen: boolean) => void;
}

export default function SuperAdminHeader({ onSidebarToggle }: HeaderProps) {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [activeDropdown, setActiveDropdown] = React.useState<number | null>(null);

    const handleLinkClick = () => {
        // Close sidebar on mobile when link is clicked
        onSidebarToggle(false);
        // Also close any open dropdowns
        setActiveDropdown(null);
    };

    const isLinkActive = (href: string) => {
        // Remove trailing slashes for comparison
        const normalizedPathname = pathname?.replace(/\/$/, '') ?? '';
        const normalizedHref = href.replace(/\/$/, '');

        // For home page
        if (href === '/') {
            return pathname === href;
        }

        // For dashboard page
        if (normalizedHref === '/user/dashboard') {
            return normalizedPathname === normalizedHref;
        }

        // For menu items with subItems, only highlight parent if exact match
        const menuItem = menuItems.find(item => item.href === href);
        if (menuItem?.subItems) {
            return normalizedPathname === normalizedHref;
        }

        // For submenu items or regular menu items without subItems
        return normalizedPathname.startsWith(normalizedHref);
    };

    const toggleDropdown = (index: number) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    return (
        <header className="h-full flex flex-col">
            {/* Close Button - Mobile Only */}
            <div className="absolute top-0 right-0 flex justify-end p-4 lg:hidden">
                <button
                    onClick={() => onSidebarToggle(false)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg"
                >
                    <svg
                        className="w-6 h-6 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            {/* Profile Section */}
            <div className="p-4 mt-2 mb-2 border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <Image
                        src={user?.photoURL || '/images/default-profile.png'}
                        alt="Profile"
                        width={48}
                        height={48}
                        className="rounded-xl object-cover w-12 h-12"
                    />
                    <div>
                        <p className="text-[15px] font-semibold text-slate-900">
                            {user?.displayName}
                        </p>
                        <p className="text-[12px] text-slate-500">Super Admin</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-2 overflow-y-auto">
                <ul className="space-y-1.5">
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            {!item.subItems ? (
                                <Link
                                    href={item.href}
                                    onClick={handleLinkClick}
                                    className={`flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${isLinkActive(item.href)
                                        ? 'bg-primary text-white shadow-sm shadow-primary/25'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </Link>
                            ) : (
                                <>
                                    <button
                                        onClick={() => toggleDropdown(index)}
                                        className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-all duration-200 ${item.subItems?.some(subItem => isLinkActive(subItem.href))
                                            ? 'bg-primary text-white shadow-sm shadow-primary/25'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className="w-5 h-5" />
                                            <span className="text-sm font-medium">{item.label}</span>
                                        </div>
                                        <svg
                                            className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === index ? 'rotate-180' : ''
                                                }`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    <div className={`overflow-hidden transition-all duration-200 ${activeDropdown === index ? 'max-h-48' : 'max-h-0'
                                        }`}>
                                        <ul className="mt-1 space-y-1 px-3.5">
                                            {item.subItems.map((subItem, subIndex) => (
                                                <li key={subIndex}>
                                                    <Link
                                                        href={subItem.href}
                                                        onClick={handleLinkClick}
                                                        className={`block py-2 px-4 text-sm rounded-md transition-all duration-200 ${isLinkActive(subItem.href)
                                                            ? 'text-primary font-medium bg-primary/10'
                                                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                                            }`}
                                                    >
                                                        {subItem.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Logout Button */}
            <div className="p-3 border-t border-slate-200">
                <button
                    onClick={() => {
                        logout();
                        handleLinkClick();
                    }}
                    className="flex items-center justify-center gap-2 w-full p-2.5 rounded-lg text-red-600 hover:bg-red-50 active:bg-red-100 transition-all duration-200"
                >
                    <FiLogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </header>
    );
}
