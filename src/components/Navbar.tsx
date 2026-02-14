"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

/**
 * Navbar Component
 * Desktop: logo left, nav links right, sticky
 * Mobile: logo left, hamburger right → full-screen overlay menu
 */
export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    /* Lock body scroll when mobile menu is open */
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileMenuOpen]);

    const navLinks = [
        { href: "/route", label: "Explore Routes" },
        { href: "/route", label: "Plan Journey" },
        { href: "#about", label: "About" },
        { href: "#contact", label: "Contact" },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? "bg-[var(--color-offwhite)]/95 backdrop-blur-sm shadow-sm"
                : "bg-transparent"
                }`}
        >
            <div className="container">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo — always left */}
                    <Link href="/" className="flex items-center gap-2 group z-50 relative">
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-[var(--color-forest)] transition-transform group-hover:scale-105"
                        >
                            <path
                                d="M16 2C10.477 2 6 6.477 6 12c0 7.5 10 18 10 18s10-10.5 10-18c0-5.523-4.477-10-10-10z"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                            />
                            <circle cx="16" cy="12" r="3" fill="currentColor" />
                        </svg>
                        <span className="font-[var(--font-heading)] text-xl font-semibold text-[var(--color-charcoal)]">
                            WanderPath
                        </span>
                    </Link>

                    {/* Desktop Navigation — hidden below md */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-[var(--color-muted)] hover:text-[var(--color-charcoal)] transition-colors text-sm font-medium"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Hamburger — ≥44×44px touch target, visible below md */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden flex items-center justify-center w-11 h-11 text-[var(--color-charcoal)] z-50 relative"
                        aria-label="Toggle menu"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            {isMobileMenuOpen ? (
                                <path d="M6 6l12 12M6 18L18 6" />
                            ) : (
                                <path d="M3 12h18M3 6h18M3 18h18" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Full-Screen Overlay Menu */}
            <div
                className={`
                    md:hidden fixed inset-0 z-40
                    bg-[var(--color-offwhite)] 
                    transition-all duration-300 ease-in-out
                    ${isMobileMenuOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-4 pointer-events-none"
                    }
                `}
            >
                <div className="flex flex-col items-center justify-center h-full gap-2 px-6">
                    {navLinks.map((link, index) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block w-full text-center py-4 text-xl font-[var(--font-heading)] font-medium text-[var(--color-charcoal)] hover:text-[var(--color-forest)] transition-colors"
                            style={{
                                animationDelay: `${index * 50}ms`,
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
