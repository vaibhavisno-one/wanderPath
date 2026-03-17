interface StopCardProps {
    number: number;
    name: string;
    description: string;
    timeNote?: string;
    interactionType?: "view-only" | "walk-by" | "explore" | "stop";
}

export default function StopCard({
    number,
    name,
    description,
    timeNote,
    interactionType = "explore",
}: StopCardProps) {
    const interactionLabels = {
        "view-only": "Walk by & view",
        "walk-by": "Brief stop",
        explore: "Explore",
        stop: "Recommended stop",
    };

    const interactionColors = {
        "view-only": "bg-[var(--color-stone)] text-[var(--color-muted)]",
        "walk-by": "bg-[var(--color-sand)] text-[var(--color-charcoal)]",
        explore: "bg-[var(--color-sage)] text-[var(--color-charcoal)]",
        stop: "bg-[var(--color-forest)] text-white",
    };

    return (
        <div className="relative flex gap-4 md:gap-6 group">
            <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[var(--color-forest)] text-white flex items-center justify-center font-[var(--font-heading)] font-semibold text-lg z-10 group-hover:scale-110 transition-transform">
                    {number}
                </div>
                <div className="w-0.5 flex-1 bg-[var(--color-sand)] mt-2" />
            </div>

            <div className="flex-1 pb-6 md:pb-8">
                <div className="bg-white border border-[var(--color-sand)] rounded-[var(--radius-xl)] p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-white border border-[var(--color-sand)] rounded-[var(--radius-xl)] p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="font-[var(--font-heading)] text-xl font-semibold text-[var(--color-charcoal)]">
                            {name}
                        </h3>
                        <span
                            className={`
                px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap w-fit
                ${interactionColors[interactionType]}
              `}
                        >
                            {interactionLabels[interactionType]}
                        </span>
                    </div>

                    <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                        {description}
                    </p>

                    {timeNote && (
                        <div className="flex items-center gap-2 text-sm text-[var(--color-light-muted)]">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span>{timeNote}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
