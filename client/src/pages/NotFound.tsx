import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router';
import { ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-muted/20">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-5 dark:opacity-[0.03]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgb(59 130 246 / 0.4) 1px, transparent 0),
              radial-gradient(circle at 75% 75%, rgb(168 85 247 / 0.3) 1px, transparent 0)
            `,
            backgroundSize: '60px 60px, 80px 80px',
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-primary/5" />
      </div>

      <div className="fixed top-1/4 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-x-1/2" />
      <div className="fixed bottom-1/4 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-8">
        <div className="text-center">
          <div className="relative mb-6 sm:mb-8 md:mb-10">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-9xl sm:text-[12rem] md:text-[14rem] lg:text-[16rem] font-black text-muted/10 dark:text-muted/5 tracking-wider select-none">
                404
              </div>
            </div>
            <p className="relative text-8xl sm:text-9xl md:text-[10rem] lg:text-[12rem] font-bold bg-gradient-to-br from-primary/30 via-primary/60 to-secondary/50 bg-clip-text text-transparent animate-pulse">
              404
            </p>
          </div>

          <div className="relative mb-6 sm:mb-8">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-4 w-24 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Page Not Found
            </h1>
            <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-4 w-16 h-1 bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
          </div>

          <div className="max-w-xl sm:max-w-2xl mx-auto px-4 mb-10 sm:mb-12">
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed sm:leading-loose">
              Oops! The page you're looking for seems to have wandered off into the digital
              wilderness. It might have been moved, deleted, or never existed in the first place.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12">
            <Button
              size="lg"
              onClick={() => {
                console.log('Go Back');
                navigate(-1);
              }}
              className="group relative overflow-hidden gap-3 bg-gradient-to-r from-primary to-secondary text-white hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-0.5 px-6 sm:px-8 h-12 sm:h-14 text-sm sm:text-base font-semibold cursor-pointer rounded-xl"
            >
              <span className="relative z-10 flex items-center gap-2">
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:-translate-x-1" />
                Go Back
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>

            <Button
              size="lg"
              onClick={() => {
                console.log('Home Page');
                navigate('/');
              }}
              variant="outline"
              className="group relative overflow-hidden gap-3 border-2 border-border/50 hover:border-primary/70 hover:bg-primary/5 transition-all duration-300 transform hover:-translate-y-0.5 px-6 sm:px-8 h-12 sm:h-14 text-sm sm:text-base font-semibold cursor-pointer rounded-xl backdrop-blur-sm"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Home className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:scale-110" />
                Home Page
              </span>
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </div>

          <div className="max-w-md mx-auto px-4">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground/70 bg-muted/20 backdrop-blur-sm rounded-full px-4 py-2 border border-border/30">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span>Check the URL or try using the navigation menu</span>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
    </div>
  );
};

export default NotFound;
