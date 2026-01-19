import { Footer } from '../components/footer';
import { CTA } from '../components/cta';
import { Features } from '../components/features';
import { HeroSection } from '../components/hero';
import { Stats } from '../components/stats';
import { Testimonials } from '../components/testimonials';
import { TrustedBy } from '../components/trusted-by';
import { Header } from '../components/header';

export default function LandingPage() {
  return (
    <>
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
    </>
  );
}
