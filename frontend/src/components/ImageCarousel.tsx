"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface CarouselImage {
    src: string;
    alt: string;
    caption?: string;
}

interface ImageCarouselProps {
    images: CarouselImage[];
    autoPlayInterval?: number;
}

export default function ImageCarousel({
    images,
    autoPlayInterval = 5000,
}: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);

    const goToSlide = useCallback((index: number) => {
        setCurrentIndex(index);
    }, []);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const goToPrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);


    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(goToNext, autoPlayInterval);
        return () => clearInterval(interval);
    }, [isPaused, autoPlayInterval, goToNext]);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current === null || touchEndX.current === null) return;
        const diff = touchStartX.current - touchEndX.current;
        const threshold = 50; // minimum swipe distance in px

        if (diff > threshold) {
            goToNext();
        } else if (diff < -threshold) {
            goToPrev();
        }

        touchStartX.current = null;
        touchEndX.current = null;
    };

    return (
        <div className="w-full md:container">
            <div
                className="relative w-full overflow-hidden bg-[var(--color-stone)] md:rounded-[var(--radius-xl)]"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    className="flex transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`
                            relative w-full flex-shrink-0
                            aspect-[4/3] md:aspect-[16/7]
                        `}
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                className="object-cover"
                                priority={index === 0}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                            {image.caption && (
                                <div className="absolute bottom-8 left-0 right-0 text-center px-4">
                                    <p className="text-white text-base md:text-lg font-[var(--font-heading)] tracking-wide">
                                        {image.caption}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    onClick={goToPrev}
                    className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full items-center justify-center text-[var(--color-charcoal)] hover:bg-white transition-all shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]"
                    aria-label="Previous slide"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>

                <button
                    onClick={goToNext}
                    className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full items-center justify-center text-[var(--color-charcoal)] hover:bg-white transition-all shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]"
                    aria-label="Next slide"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </button>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`
              w-2.5 h-2.5 md:w-2 md:h-2 rounded-full transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50
              ${index === currentIndex
                                    ? "w-8 bg-white"
                                    : "bg-white/50 hover:bg-white/75"
                                }
            `}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
