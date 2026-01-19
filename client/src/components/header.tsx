import { Button } from '@/components/ui/button';
import { Github, Menu, X, LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ModeToggle } from './mode-toggle';
import { useNavigate } from 'react-router';
import { signIn, signOut, useSession } from '../lib/auth-client';

export function Header() {
  const { data: session, isPending: sessionPending } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleGithubLogin = async () => {
    setIsLoading(true);
    try {
      await signIn.social({
        provider: 'github',
        callbackURL: 'http://localhost:5173/dashboard',
      });
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Optionally navigate to home page after sign out
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
    setMobileMenuOpen(false);
  };

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen) {
        const header = document.querySelector('header');
        if (header && !header.contains(event.target as Node)) {
          setMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        borderColor: scrolled ? 'var(--border)' : 'transparent',
        backgroundColor: scrolled
          ? 'rgba(var(--background), 0.95)'
          : 'rgba(var(--background), 0.98)',
        backdropFilter: scrolled ? 'blur(12px)' : 'blur(8px)',
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'var(--shadow-xs)',
        transition:
          'background-color 300ms, border-color 300ms, box-shadow 300ms, backdrop-filter 300ms',
        willChange: 'background-color, border-color, box-shadow',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2 sm:gap-3 group">
              <img
                src="/DebugDeer-logo.svg"
                alt="DebugDeer Logo"
                className="h-7 w-7 sm:h-8 sm:w-8 object-contain transition-transform group-hover:scale-110"
              />
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                DebugDeer
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-4">
            <ModeToggle />

            {sessionPending ? (
              // Loading skeleton
              <div className="h-9 w-24 rounded-md bg-muted animate-pulse"></div>
            ) : session ? (
              // Signed in state
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 hover:bg-muted"
                  onClick={handleDashboardClick}
                >
                  <User className="h-4 w-4" />
                  <span className="font-medium">Dashboard</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            ) : (
              // Signed out state
              <Button
                className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-opacity px-4 py-2"
                onClick={handleGithubLogin}
                disabled={isLoading}
              >
                <Github className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ModeToggle />
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2 text-foreground hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              disabled={sessionPending}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 border-t border-border/50 bg-background/95 backdrop-blur-xl transform transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? 'translate-y-0 opacity-100 visible'
            : '-translate-y-2 opacity-0 invisible'
        }`}
        style={{
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="px-4 py-6 space-y-4">
          {sessionPending ? (
            // Loading state for mobile
            <div className="space-y-3">
              <div className="h-12 w-full rounded-md bg-muted animate-pulse"></div>
              <div className="h-12 w-full rounded-md bg-muted animate-pulse"></div>
            </div>
          ) : session ? (
            // Signed in mobile menu
            <div className="space-y-3">
              <div className="px-3 py-2 rounded-lg bg-muted/50">
                <p className="text-sm font-medium text-foreground">Signed in as</p>
                <p className="text-sm text-muted-foreground truncate">
                  {session.user.email || session.user.name || 'User'}
                </p>
              </div>

              <Button
                className="w-full justify-start bg-gradient-to-r from-primary to-secondary text-white py-3"
                onClick={handleDashboardClick}
              >
                <User className="mr-3 h-5 w-5" />
                Dashboard
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors py-3"
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign Out
              </Button>
            </div>
          ) : (
            // Signed out mobile menu
            <div className="space-y-4">
              <Button
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 text-base font-medium"
                onClick={() => {
                  handleGithubLogin();
                  setMobileMenuOpen(false);
                }}
                disabled={isLoading}
              >
                <Github className="mr-3 h-5 w-5" />
                {isLoading ? 'Signing In...' : 'Sign In with GitHub'}
              </Button>

              <div className="pt-2 border-t border-border/30">
                <p className="text-sm text-muted-foreground text-center px-2">
                  Sign in to access your dashboard
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
