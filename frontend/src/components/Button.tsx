import { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
    href?: string;
    children: ReactNode;
    fullWidth?: boolean;
}


export default function Button({
    variant = "primary",
    size = "md",
    href,
    children,
    fullWidth = false,
    className = "",
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-[var(--font-body)] font-medium
    rounded-[var(--radius-md)]
    transition-all duration-[var(--transition-base)]
    focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)] focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    min-h-[44px]
  `;

    const variants = {
        primary: `
      bg-[var(--color-forest)] text-white
      hover:bg-[var(--color-forest-dark)]
      active:scale-[0.98]
    `,
        secondary: `
      bg-transparent text-[var(--color-forest)]
      border-2 border-[var(--color-forest)]
      hover:bg-[var(--color-forest)] hover:text-white
      active:scale-[0.98]
    `,
        ghost: `
      bg-transparent text-[var(--color-muted)]
      hover:text-[var(--color-charcoal)] hover:bg-[var(--color-stone)]
    `,
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };

    const combinedStyles = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `.trim();

    if (href && !disabled) {
        return (
            <Link href={href} className={combinedStyles}>
                {children}
            </Link>
        );
    }

    return (
        <button className={combinedStyles} disabled={disabled} {...props}>
            {children}
        </button>
    );
}
