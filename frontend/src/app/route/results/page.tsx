"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import StopCard from "@/components/StopCard";
import { sampleRoute } from "@/lib/mockData";

/**
 * Route Results Content Component
 * Separated for Suspense boundary
 */
function RouteResultsContent() {
    const searchParams = useSearchParams();
    const startPoint = searchParams.get("start") || sampleRoute.startPoint;
    const endPoint = searchParams.get("end") || sampleRoute.endPoint;

    return (
        <div className="pt-24 md:pt-28 pb-20 min-h-screen">
            <div className="container">
                {/* Back Link */}
                <Link
                    href="/route"
                    className="inline-flex items-center gap-2 text-[var(--color-muted)] hover:text-[var(--color-charcoal)] transition-colors mb-8"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                    <span className="text-sm font-medium">Back to route selection</span>
                </Link>

                {/* Desktop: 3-col grid with sidebar; Mobile: single column, metadata first */}
                <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Route Summary */}
                        <div className="bg-white rounded-[var(--radius-xl)] p-6 md:p-8 shadow-sm border border-[var(--color-sand)]/50 mb-8">
                            {/* Desktop: horizontal start→end; Mobile: vertical stacked */}
                            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-4 mb-6">
                                {/* Start Point */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[var(--color-stone)] flex items-center justify-center flex-shrink-0">
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="var(--color-forest)"
                                            strokeWidth="2"
                                        >
                                            <circle cx="12" cy="12" r="3" />
                                            <circle cx="12" cy="12" r="10" strokeDasharray="4 4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-[var(--color-light-muted)] uppercase tracking-wide">From</p>
                                        <p className="font-medium text-[var(--color-charcoal)]">{startPoint}</p>
                                    </div>
                                </div>

                                {/* Connector: vertical on mobile, horizontal on desktop */}
                                <div className="hidden md:flex flex-1 items-center justify-center">
                                    <div className="h-0.5 flex-1 bg-[var(--color-sand)]" />
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="text-[var(--color-muted)] mx-2"
                                    >
                                        <polyline
                                            points="9 18 15 12 9 6"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <div className="h-0.5 flex-1 bg-[var(--color-sand)]" />
                                </div>
                                {/* Mobile vertical connector */}
                                <div className="flex md:hidden justify-center py-1">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-0.5 h-3 bg-[var(--color-sand)]" />
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            className="text-[var(--color-muted)]"
                                        >
                                            <path
                                                d="M12 5v14M5 12l7 7 7-7"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <div className="w-0.5 h-3 bg-[var(--color-sand)]" />
                                    </div>
                                </div>

                                {/* End Point */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[var(--color-forest)] flex items-center justify-center flex-shrink-0">
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="2"
                                        >
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                            <circle cx="12" cy="9" r="2.5" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-[var(--color-light-muted)] uppercase tracking-wide">To</p>
                                        <p className="font-medium text-[var(--color-charcoal)]">{endPoint}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Route Description */}
                            <p className="text-[var(--color-muted)] leading-relaxed italic font-[var(--font-heading)]">
                                &ldquo;{sampleRoute.description}&rdquo;
                            </p>
                        </div>

                        {/* Stops List */}
                        <div>
                            <h2 className="font-[var(--font-heading)] text-2xl font-medium text-[var(--color-charcoal)] mb-6">
                                Stops on this route
                            </h2>

                            <div className="relative">
                                {sampleRoute.stops.map((stop, index) => (
                                    <StopCard
                                        key={stop.number}
                                        {...stop}
                                    />
                                ))}

                                {/* Final marker */}
                                <div className="flex items-center gap-4 md:gap-6">
                                    <div className="w-10 h-10 rounded-full bg-[var(--color-forest)] flex items-center justify-center">
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="2"
                                        >
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                            <polyline points="22 4 12 14.01 9 11.01" />
                                        </svg>
                                    </div>
                                    <p className="font-[var(--font-heading)] text-lg text-[var(--color-charcoal)]">
                                        Journey complete
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar — Mobile: appears first via order; Desktop: stays right */}
                    <div className="lg:col-span-1 order-first lg:order-none">
                        {/* Desktop: sticky sidebar; Mobile: normal flow */}
                        <div className="lg:sticky lg:top-28">
                            {/* Route Metadata */}
                            <div className="bg-white rounded-[var(--radius-xl)] p-6 shadow-sm border border-[var(--color-sand)]/50 mb-6">
                                <h3 className="font-[var(--font-heading)] text-lg font-medium text-[var(--color-charcoal)] mb-4">
                                    Route Overview
                                </h3>

                                <div className="space-y-4">
                                    {/* Stops */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-stone)] flex items-center justify-center">
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="var(--color-forest)"
                                                strokeWidth="2"
                                            >
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                                <circle cx="12" cy="9" r="2.5" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-[var(--color-light-muted)]">Stops</p>
                                            <p className="font-medium text-[var(--color-charcoal)]">{sampleRoute.totalStops} stops</p>
                                        </div>
                                    </div>

                                    {/* Duration */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-stone)] flex items-center justify-center">
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="var(--color-forest)"
                                                strokeWidth="2"
                                            >
                                                <circle cx="12" cy="12" r="10" />
                                                <polyline points="12 6 12 12 16 14" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-[var(--color-light-muted)]">Duration</p>
                                            <p className="font-medium text-[var(--color-charcoal)]">{sampleRoute.duration}</p>
                                        </div>
                                    </div>

                                    {/* Difficulty */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-stone)] flex items-center justify-center">
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="var(--color-forest)"
                                                strokeWidth="2"
                                            >
                                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-[var(--color-light-muted)]">Difficulty</p>
                                            <p className="font-medium text-[var(--color-charcoal)]">{sampleRoute.difficulty}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-[var(--color-sand)] my-6" />

                                {/* Theme */}
                                <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                                    <span className="px-3 py-1 bg-[var(--color-stone)] rounded-full">
                                        {sampleRoute.theme}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                <Button fullWidth>
                                    Save this route
                                </Button>
                                <Button variant="secondary" fullWidth href="/route">
                                    Plan another route
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Route Results Page
 * Displays the complete route with stops, metadata, and summary
 */
export default function RouteResultsPage() {
    return (
        <Suspense fallback={
            <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
                <div className="text-[var(--color-muted)]">Loading route...</div>
            </div>
        }>
            <RouteResultsContent />
        </Suspense>
    );
}
