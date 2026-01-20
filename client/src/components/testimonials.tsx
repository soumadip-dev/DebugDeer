import { Card, CardContent } from '../components/ui/card';
import { Star, Quote } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    {
      quote:
        "I love how deeply it analyzes code... it spots potential errors more often than other tools. It's like having a senior engineer review every PR.",
      author: 'Sarah Chen',
      role: 'Technical Founder',
      company: 'TechStart Inc',
    },
    {
      quote:
        'DebugDeer routinely catches off-by-ones, edge cases, and even security slips before they hit production. Game changer for our team.',
      author: 'Brandon Mitchell',
      role: 'Senior Staff Software Engineer',
      company: 'CloudScale',
    },
    {
      quote:
        'It enforced a more precise UUID validation that saved us from a production issue. The ROI was immediate.',
      author: 'Kyzylo Ivanov',
      role: 'Engineering Lead',
      company: 'DataFlow Systems',
    },
    {
      quote:
        'Writing code faster was never the issue; the bottleneck was always code review. DebugDeer is solving that exact problem.',
      author: 'Kizan Kanagasekar',
      role: 'Senior Engineering Manager',
      company: 'Enterprise Solutions',
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Loved by{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Developers
            </span>{' '}
            Worldwide
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            We handle the heavy lifting. You focus on shipping great features.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-6 sm:grid-cols-2 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="group relative border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 sm:p-8">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
                  <Quote className="h-5 w-5" />
                </div>
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-primary text-primary transition-transform group-hover:scale-110"
                      style={{ transitionDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>

                <p className="mb-6 text-base leading-relaxed text-foreground">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white font-bold text-lg">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-xs text-muted-foreground/80">{testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
