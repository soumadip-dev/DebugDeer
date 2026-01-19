import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Mail, CheckCircle } from 'lucide-react';

export function CTA() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl opacity-20" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Content */}
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Ready to{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Transform
              </span>
              {' '}Your Code Reviews?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Join 10,000+ teams shipping better code, faster. Start your free trial today.
            </p>

            {/* Email Form */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <div className="relative w-full">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@company.com"
                  className="h-12 pl-10 border-border/50 bg-card/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:border-primary transition-colors"
                />
              </div>
              <Button 
                size="lg"
                className="w-full sm:w-auto h-12 bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 px-8 font-semibold group"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            {/* Benefits List */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Cancel anytime</span>
              </div>
            </div>

            {/* Legal Text */}
            <p className="mt-6 text-xs text-muted-foreground/80">
              By signing up, you agree to our{' '}
              <a href="#" className="text-primary hover:underline transition-colors">
                Terms of Service
              </a>
              {' '}and{' '}
              <a href="#" className="text-primary hover:underline transition-colors">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
