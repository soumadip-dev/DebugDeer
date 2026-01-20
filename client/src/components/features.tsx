import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Zap, MessageSquare, FileText, Settings, Bug, BarChart } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Zap,
      tag: '1-Click Fixes',
      title: 'Catch Fast. Fix Faster.',
      description:
        'One-click commits for simple fixes. AI-powered suggestions for complex issues. Speed up your workflow.',
    },
    {
      icon: MessageSquare,
      tag: 'Interactive',
      title: 'Chat with Your Code',
      description:
        'Engage directly with DebugDeer. Get instant feedback, trigger reviews, and refine suggestions in real-time.',
    },
    {
      icon: FileText,
      tag: 'Smart Summaries',
      title: 'TL;DR for Every Diff',
      description:
        'Quick context with change summaries, visual diagrams, and architectural insights at a glance.',
    },
    {
      icon: Settings,
      tag: 'Customizable',
      title: 'Your Code, Your Rules',
      description:
        "Fully configurable workflows and rules. Adapt DebugDeer to match your team's coding standards perfectly.",
    },
    {
      icon: Bug,
      tag: 'AI-Powered',
      title: 'Find Bugs, Skip Noise',
      description:
        'Catch critical issues humans miss without overwhelming your team with false positives or style nitpicks.',
    },
    {
      icon: BarChart,
      tag: 'Auto Reports',
      title: 'Insights That Matter',
      description:
        'Automated changelogs, quality metrics, and trend analysis. Make data-driven decisions effortlessly.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
            Features
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Why Teams Choose{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              DebugDeer
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            AI moves fast. Your code reviews shouldn't slow you down. We help you maintain quality
            at velocity.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="group border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/25 transition-transform group-hover:scale-110">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <Badge
                    variant="outline"
                    className="border-primary/30 text-xs text-primary font-medium"
                  >
                    {feature.tag}
                  </Badge>
                </div>
                <CardTitle className="text-xl text-foreground font-semibold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
