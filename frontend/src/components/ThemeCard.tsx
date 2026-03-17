"use client";

interface ThemeCardProps {
    id: string;
    name: string;
    description: string;
    icon: "heritage" | "local" | "food";
    selected: boolean;
    onSelect: (id: string) => void;
}

export default function ThemeCard({
    id,
    name,
    description,
    icon,
    selected,
    onSelect,
}: ThemeCardProps) {
    const icons = {
        heritage: (
            <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
                <path d="M9 10h.01M15 10h.01" />
            </svg>
        ),
        local: (
            <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
        food: (
            <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" />
                <line x1="10" y1="1" x2="10" y2="4" />
                <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
        ),
    };

    return (
        <button
            onClick={() => onSelect(id)}
            className={`
        relative w-full p-6 text-left
        bg-white
        border-2 rounded-[var(--radius-xl)]
        transition-all duration-[var(--transition-base)]
        hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)] focus:ring-offset-2
        ${selected
                    ? "border-[var(--color-forest)] shadow-md"
                    : "border-[var(--color-sand)] hover:border-[var(--color-sage)]"
                }
      `}
        >

            {selected && (
                <div className="absolute top-4 right-4 w-5 h-5 bg-[var(--color-forest)] rounded-full flex items-center justify-center">
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
            )}


            <div
                className={`
          w-12 h-12 mb-4 rounded-[var(--radius-md)]
          flex items-center justify-center
          transition-colors duration-[var(--transition-base)]
          ${selected
                        ? "bg-[var(--color-forest)] text-white"
                        : "bg-[var(--color-stone)] text-[var(--color-muted)]"
                    }
        `}
            >
                {icons[icon]}
            </div>


            <h3 className="font-[var(--font-heading)] text-lg font-semibold text-[var(--color-charcoal)] mb-1">
                {name}
            </h3>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                {description}
            </p>
        </button>
    );
}
