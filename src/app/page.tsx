import Button from "@/components/Button";
import ImageCarousel from "@/components/ImageCarousel";
import { carouselImages } from "@/lib/mockData";

/**
 * Home Page
 * Landing page with hero, carousel, CTAs, and contact section
 */
export default function HomePage() {
  return (
    <div className="pt-24 md:pt-28">
      {/* Hero Section — Desktop: generous vertical padding; Mobile: tighter */}
      <section className="relative py-12 md:py-24 lg:py-32 overflow-hidden">
        {/* Subtle background texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-stone)] rounded-full mb-8 animate-fade-in">
              <span className="w-2 h-2 bg-[var(--color-forest)] rounded-full" />
              <span className="text-sm text-[var(--color-muted)] font-medium">
                Route-based travel discovery
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-[var(--font-heading)] font-medium text-[var(--color-charcoal)] leading-tight mb-6 animate-fade-in-up">
              Travel with intention.
              <br />
              <span className="text-[var(--color-forest)]">Discover with meaning.</span>
            </h1>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-[var(--color-muted)] leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              We curate walking routes that connect you to the soul of every place —
              heritage walks, local exploration, and slow tourism for travelers who
              want to truly understand where they are.
            </p>

            {/* Value Props */}
            <div className="flex flex-wrap justify-center gap-6 mb-10 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              {[
                "Heritage Routes",
                "Local Discovery",
                "Food Trails",
              ].map((prop) => (
                <div key={prop} className="flex items-center gap-2 text-[var(--color-muted)]">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-[var(--color-forest)]"
                  >
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-sm font-medium">{prop}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Image Carousel */}
      <section className="animate-fade-in" style={{ animationDelay: "300ms" }}>
        <ImageCarousel images={carouselImages} />
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-[var(--color-stone)]">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-[var(--font-heading)] text-3xl md:text-4xl font-medium text-[var(--color-charcoal)] mb-4">
              Ready to explore?
            </h2>
            <p className="text-[var(--color-muted)] mb-10 text-lg mx-auto max-w-md">
              Start planning your meaningful journey today.
            </p>

            {/* Desktop: side-by-side centered; Mobile: full-width stacked */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full md:w-auto">
              <Button href="/route" size="lg" fullWidth className="md:w-auto">
                Plan Your Route
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
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Button>
              <Button href="/route" variant="secondary" size="lg" fullWidth className="md:w-auto">
                Discover Hidden Paths
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-28">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content */}
            <div>
              <span className="text-sm font-medium text-[var(--color-forest)] uppercase tracking-wide mb-4 block">
                Our Philosophy
              </span>
              <h2 className="font-[var(--font-heading)] text-3xl md:text-4xl font-medium text-[var(--color-charcoal)] mb-6">
                Routes, not random points
              </h2>
              <p className="text-[var(--color-muted)] leading-relaxed mb-6">
                We believe the best travel experiences come from understanding
                the connections between places, not just checking off landmarks.
                Our routes are crafted to tell stories — of history, culture,
                and the people who make each place unique.
              </p>
              <p className="text-[var(--color-muted)] leading-relaxed">
                Every path on WanderPath is designed for slow exploration,
                giving you time to pause, observe, and truly connect with
                your surroundings.
              </p>
            </div>

            {/* Visual */}
            <div className="relative">
              {/* Visual — Desktop: square; Mobile: shorter aspect ratio */}
              <div className="aspect-[4/3] md:aspect-square bg-[var(--color-stone)] rounded-[var(--radius-xl)] overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    width="120"
                    height="120"
                    viewBox="0 0 120 120"
                    fill="none"
                    className="text-[var(--color-sage)]"
                  >
                    <path
                      d="M20 80 Q40 20 60 60 Q80 100 100 40"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <circle cx="20" cy="80" r="6" fill="var(--color-forest)" />
                    <circle cx="60" cy="60" r="5" fill="var(--color-sand)" />
                    <circle cx="100" cy="40" r="6" fill="var(--color-forest)" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-20 border-t border-[var(--color-sand)]">
        <div className="container">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-[var(--font-heading)] text-2xl font-medium text-[var(--color-charcoal)] mb-4">
              Have questions?
            </h3>
            <p className="text-[var(--color-muted)] mb-6">
              We&apos;d love to hear from you. Reach out and let&apos;s talk about your next journey.
            </p>
            <Button variant="ghost" size="md">
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
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
