export function Stats() {
  const stats = [
    {
      label: 'Repositories Analyzed',
      value: '2M+',
      description: 'Across all platforms',
    },
    {
      label: 'Pull Requests Reviewed',
      value: '13M+',
      description: 'And counting daily',
    },
    {
      label: 'Bug Detection Rate',
      value: '98%',
      description: 'Critical issues caught',
    },
    {
      label: 'Active Teams',
      value: '10K+',
      description: 'Shipping better code',
    },
  ];

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 border-y border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
      <div
        className="absolute inset-0 opacity-5 dark:opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(59 130 246 / 0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Trusted by Industry Leaders
          </p>
          <p className="mt-2 text-lg text-muted-foreground">
            Most installed AI code review app on GitHub & GitLab
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="group text-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative">
                <p className="text-4xl font-bold sm:text-5xl lg:text-6xl bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent transition-all group-hover:scale-110">
                  {stat.value}
                </p>
                <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-gradient-to-r from-primary to-secondary transition-all group-hover:w-20" />
              </div>
              <p className="mt-3 text-sm font-medium text-foreground">{stat.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
