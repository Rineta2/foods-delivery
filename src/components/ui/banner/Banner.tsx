'use client'

import React, { useEffect, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';

import { Swiper as SwiperType } from 'swiper';

import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import { subscribeToBanners, Banner as BannerType } from './lib/banner';

import BannerSkelaton from './BannerSkelaton';

import Image from 'next/image';

export default function Banner() {
    const [banners, setBanners] = useState<BannerType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const swiperRef = React.useRef<SwiperType | undefined>(undefined);

    useEffect(() => {
        const unsubscribe = subscribeToBanners((newBanners) => {
            setBanners(newBanners);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <BannerSkelaton />;
    }

    return (
        <section className='min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] lg:min-h-screen flex items-center justify-center mt-20 sm:mt-10'>
            <div className="container mx-auto overflow-hidden relative ">
                <Swiper
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    autoplay={!isPaused ? {
                        delay: 5000,
                        disableOnInteraction: false,
                    } : false}
                    pagination={{
                        clickable: true,
                        renderBullet: function (index, className) {
                            return `<span class="${className} relative overflow-hidden rounded-sm">
                                <span class="absolute inset-0 bg-white/30"></span>
                                <span class="absolute inset-0 bg-white opacity-0 [.swiper-pagination-bullet-active_&]:opacity-100 [.swiper-pagination-bullet-active_&]:animate-[charging-bar_5s_linear]"></span>
                            </span>`;
                        },
                    }}
                    modules={[Autoplay, Pagination, EffectFade]}
                    className="relative overflow-hidden rounded-2xl [&_.swiper-pagination-bullet]:w-8 [&_.swiper-pagination-bullet]:h-1 [&_.swiper-pagination-bullet]:bg-transparent [&_.swiper-pagination-bullet-active]:bg-transparent [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet]:duration-300 [&_.swiper-pagination]:bottom-8 [&_.swiper-pagination-bullet]:mx-1"
                    loop={true}
                    speed={800}
                    slidesPerView={1}
                    effect="fade"
                    fadeEffect={{
                        crossFade: true
                    }}
                >
                    {banners.map((banner, index) => (
                        <SwiperSlide key={banner.imageUrl || index}>
                            <div
                                onClick={() => setIsPaused(!isPaused)}
                                style={{ cursor: 'pointer' }}
                                className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh]"
                            >
                                <Image
                                    src={banner.imageUrl}
                                    alt={"banner"}
                                    quality={100}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
