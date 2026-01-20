import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextEffect } from '@/components/ui/text-effect';

export function HeroSection() {
  return (
    <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 lg:pt-40 lg:pb-20 overflow-hidden">
      <div className="absolute inset-0 -z-10 hero-gradient" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_120%,rgba(139,92,246,0.1),transparent_50%)]" />

      <div
        className="absolute inset-0 -z-10 opacity-20 dark:opacity-10"
        style={{
          backgroundImage: `linear-gradient(to right, rgb(59 130 246 / 0.1) 1px, transparent 1px),
                           linear-gradient(to bottom, rgb(59 130 246 / 0.1) 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem',
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <a
              href="#features"
              className="group inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-4 py-1.5 text-sm backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-muted"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-foreground/80">Powered by Advanced AI</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          <h1 className="mx-auto max-w-5xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <TextEffect preset="fade-in-blur" speedSegment={0.3}>
              Ship Cleaner Code Faster
            </TextEffect>
          </h1>

          <TextEffect
            per="line"
            preset="fade-in-blur"
            speedSegment={0.3}
            delay={0.5}
            as="p"
            className="mx-auto mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed"
          >
            AI-powered code reviews that catch bugs before they reach production. DebugDeer analyzes
            your pull requests and helps you ship with confidence.
          </TextEffect>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 px-8 h-12 text-base font-semibold group"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border/50 hover:border-primary/50 hover:bg-muted h-12 px-8 text-base font-semibold"
            >
              Watch Demo
            </Button>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Trusted by <span className="font-semibold text-foreground">10,000+</span> development
            teams worldwide
          </p>
        </div>

        <div className="mt-16 sm:mt-20 lg:mt-24">
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-3xl blur-3xl opacity-50" />

            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl ring-1 ring-border/10">
              <div className="aspect-[16/9] bg-gradient-to-br from-muted/50 to-muted">
                <img
                  className="h-full w-full object-cover object-center"
                  src="/banner.png"
                  alt="DebugDeer AI Code Review Dashboard"
                  loading="eager"
                />
              </div>
            </div>

            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-primary to-secondary opacity-20 blur-2xl animate-pulse" />
            <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-gradient-to-br from-secondary to-primary opacity-20 blur-2xl animate-pulse delay-700" />
          </div>
        </div>
      </div>
    </section>
  );
}
