import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ModeToggle } from './mode-toggle';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mobileMenuOpen]);

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        borderColor: scrolled ? 'var(--border)' : 'transparent',
        backgroundColor: scrolled ? 'rgba(var(--background), 0.8)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        transition: 'background-color 300ms, border-color 300ms, box-shadow 300ms, backdrop-filter 300ms',
        willChange: 'background-color, border-color, box-shadow'
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-3 group">
              <img 
                src="/DebugDeer-logo.svg" 
                alt="DebugDeer Logo" 
                className="h-8 w-8 object-contain transition-transform group-hover:scale-110" 
              />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                DebugDeer
              </span>
            </a>
          </div>

          <div className="hidden md:flex md:items-center md:gap-3">
            <ModeToggle />
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              Sign In
            </Button>
            <Button className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-opacity">
              Get Started
            </Button>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2.5 text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary md:hidden transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-3">
            <div className="flex justify-center pb-3 border-b border-border">
              <ModeToggle />
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-center text-muted-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Button>
            <Button 
              className="w-full bg-gradient-to-r from-primary to-secondary text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
