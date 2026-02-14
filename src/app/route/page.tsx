"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LocationInput from "@/components/LocationInput";
import ThemeCard from "@/components/ThemeCard";
import Button from "@/components/Button";
import { themeOptions } from "@/lib/mockData";

export default function RoutePage() {
    const router = useRouter();
    const [startPoint, setStartPoint] = useState("");
    const [endPoint, setEndPoint] = useState("");
    const [selectedThemes, setSelectedThemes] = useState<string[]>([]);

    const handleThemeSelect = (id: string) => {
        setSelectedThemes((prev) =>
            prev.includes(id)
                ? prev.filter((t) => t !== id)
                : [...prev, id]
        );
    };

    const isFormValid = startPoint.trim() && endPoint.trim();

    const handleDiscover = () => {
        if (isFormValid) {

            router.push(
                `/route/results?start=${encodeURIComponent(startPoint)}&end=${encodeURIComponent(endPoint)}&themes=${selectedThemes.join(",")}`
            );
        }
    };

    return (
        <div className="pt-24 md:pt-28 pb-20 min-h-screen bg-gradient-to-b from-[var(--color-offwhite)] to-[var(--color-stone)]/30">
            <div className="container">
                <div className="max-w-2xl mx-auto text-center mb-12">
                    <h1 className="font-[var(--font-heading)] text-3xl md:text-4xl font-medium text-[var(--color-charcoal)] mb-4">
                        Plan your journey
                    </h1>
                    <p className="text-[var(--color-muted)] text-lg">
                        Tell us where you want to go, and we&apos;ll craft a meaningful route for you.
                    </p>
                </div>

                {/* Start Point */}
                <div className="bg-white rounded-[var(--radius-xl)] p-6 md:p-8 shadow-sm border border-[var(--color-sand)]/50 mb-8">
                    <h2 className="font-[var(--font-heading)] text-xl font-medium text-[var(--color-charcoal)] mb-6">
                        Where would you like to explore?
                    </h2>

                    <div className="space-y-6">
                        <div className="space-y-6">
                            <LocationInput
                                label="Starting Point"
                                icon="start"
                                placeholder="e.g., Jama Masjid, Old Delhi"
                                value={startPoint}
                                onChange={(e) => setStartPoint(e.target.value)}
                            />


                            <div className="flex items-center justify-center py-2">
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-0.5 h-4 bg-[var(--color-sand)]" />
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
                                    <div className="w-0.5 h-4 bg-[var(--color-sand)]" />
                                </div>
                            </div>


                            <LocationInput
                                label="Destination"
                                icon="end"
                                placeholder="e.g., Red Fort"
                                value={endPoint}
                                onChange={(e) => setEndPoint(e.target.value)}
                            />
                        </div>
                    </div>


                    <div className="bg-white rounded-[var(--radius-xl)] p-6 md:p-8 shadow-sm border border-[var(--color-sand)]/50 mb-8">
                        <h2 className="font-[var(--font-heading)] text-xl font-medium text-[var(--color-charcoal)] mb-2">
                            What interests you?
                        </h2>
                        <p className="text-sm text-[var(--color-muted)] mb-6">
                            Select one or more themes to personalize your route
                        </p>

                        <div className="grid md:grid-cols-3 gap-4">
                            {themeOptions.map((theme) => (
                                <ThemeCard
                                    key={theme.id}
                                    {...theme}
                                    selected={selectedThemes.includes(theme.id)}
                                    onSelect={handleThemeSelect}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <Button
                            size="lg"
                            onClick={handleDiscover}
                            disabled={!isFormValid}
                            fullWidth
                            className="md:w-auto md:min-w-[200px]"
                        >
                            Discover Route
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
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </Button>
                    </div>


                    {!isFormValid && (
                        <p className="text-center text-sm text-[var(--color-light-muted)] mt-4">
                            Enter both starting point and destination to continue
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
