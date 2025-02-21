"use client";

import React from "react";

import { usePathname } from "next/navigation";

import Header from "@/layout/header/Header";

import Footer from "@/layout/footer/Footer";

import { Toaster } from "react-hot-toast";

const Pathname = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    const isAdminRoute = pathname?.includes("/super-admins") ||
        pathname?.includes("/admins") ||
        pathname?.includes("/auth") ||
        pathname?.includes("/payment") ||
        pathname?.includes("/transaction/pending") ||
        pathname?.includes("/transaction/success") ||
        pathname?.includes("/dashboard") || false;

    return (
        <main>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#333',
                        color: '#fff',
                    },
                    success: {
                        style: {
                            background: '#22c55e',
                            color: '#fff',
                        },
                    },
                    error: {
                        style: {
                            background: '#ef4444',
                            color: '#fff',
                        },
                    },
                }}
            />
            {!isAdminRoute && <Header />}
            {children}
            {!isAdminRoute && <Footer />}
        </main>
    );
};

export default Pathname;