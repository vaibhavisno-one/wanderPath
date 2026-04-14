import Link from "next/link";


export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        explore: [
            { href: "/route", label: "Find Routes" },
            { href: "/route", label: "Heritage Walks" },
            { href: "/route", label: "Local Life" },
            { href: "/route", label: "Food Trails" },
        ],
        company: [
            { href: "#about", label: "About" },
            { href: "#contact", label: "Contact" },
            { href: "#", label: "Privacy" },
            { href: "#", label: "Terms" },
        ],
    };

    return (
        <footer className="bg-[var(--color-stone)] border-t border-[var(--color-sand)]/50">
            <div className="container py-10 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">

                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <svg
                                width="28"
                                height="28"
                                viewBox="0 0 32 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-[var(--color-forest)]"
                            >
                                <path
                                    d="M16 2C10.477 2 6 6.477 6 12c0 7.5 10 18 10 18s10-10.5 10-18c0-5.523-4.477-10-10-10z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                />
                                <circle cx="16" cy="12" r="3" fill="currentColor" />
                            </svg>
                            <span className="font-[var(--font-heading)] text-lg font-semibold text-[var(--color-charcoal)]">
                                WanderPath
                            </span>
                        </Link>
                        <p className="text-[var(--color-muted)] text-sm max-w-sm leading-relaxed">
                            Discover meaningful journeys through heritage walks, local exploration,
                            and slow tourism. Travel with intention.
                        </p>
                    </div>


                    <div>
                        <h4 className="font-[var(--font-heading)] text-sm font-semibold text-[var(--color-charcoal)] mb-4">
                            Explore
                        </h4>
                        <ul className="space-y-2">
                            {footerLinks.explore.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-[var(--color-muted)] hover:text-[var(--color-charcoal)] transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>


                    <div>
                        <h4 className="font-[var(--font-heading)] text-sm font-semibold text-[var(--color-charcoal)] mb-4">
                            Company
                        </h4>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-[var(--color-muted)] hover:text-[var(--color-charcoal)] transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-[var(--color-sand)]/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <p className="text-[var(--color-light-muted)] text-xs">
                        © {currentYear} WanderPath. All rights reserved.
                    </p>


                    <div className="flex items-center gap-4">
                        {["twitter", "instagram", "linkedin"].map((social) => (
                            <a
                                key={social}
                                href="#"
                                className="text-[var(--color-muted)] hover:text-[var(--color-forest)] transition-colors"
                                aria-label={social}
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    {social === "twitter" && (
                                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                                    )}
                                    {social === "instagram" && (
                                        <>
                                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                        </>
                                    )}
                                    {social === "linkedin" && (
                                        <>
                                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                            <rect x="2" y="9" width="4" height="12" />
                                            <circle cx="4" cy="4" r="2" />
                                        </>
                                    )}
                                </svg>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
