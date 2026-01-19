import { CTA } from './components/cta';
import { Features } from './components/features';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { HeroSection } from './components/hero';
import { Stats } from './components/stats';
import { Testimonials } from './components/testimonials';
import { TrustedBy } from './components/trusted-by';

function App() {
  return (
    <div className="min-h-screen w-full bg-background" style={{ overflow: 'hidden', position: 'relative' }}>
      <Header />
      <main className="w-full" style={{ overflow: 'hidden' }}>
        <HeroSection />
        <TrustedBy />
        <Stats />
        <Features />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
