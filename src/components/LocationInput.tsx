"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface LocationInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: "start" | "end";
}


const LocationInput = forwardRef<HTMLInputElement, LocationInputProps>(
    ({ label, icon = "start", className = "", ...props }, ref) => {
        return (
            <div className="relative">
                <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-2">
                    {label}
                </label>
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">
                        {icon === "start" ? (
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
                                <circle cx="12" cy="12" r="3" />
                                <circle cx="12" cy="12" r="10" strokeDasharray="4 4" />
                            </svg>
                        ) : (
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
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                <circle cx="12" cy="9" r="2.5" />
                            </svg>
                        )}
                    </div>

                    <input
                        ref={ref}
                        type="text"
                        className={`
              w-full pl-12 pr-4 py-4
              bg-white
              border border-[var(--color-sand)]
              rounded-[var(--radius-lg)]
              text-[var(--color-charcoal)]
              placeholder:text-[var(--color-light-muted)]
              transition-all duration-[var(--transition-fast)]
              focus:outline-none focus:border-[var(--color-forest)] focus:ring-2 focus:ring-[var(--color-forest)]/20
              hover:border-[var(--color-sage)]
              ${className}
            `}
                        {...props}
                    />
                </div>
            </div>
        );
    }
);

LocationInput.displayName = "LocationInput";

export default LocationInput;
