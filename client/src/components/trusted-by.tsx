export function TrustedBy() {
  const companies = [
    'Appsmith',
    'Chegg',
    'Hasura',
    'Ashby',
    'Gilead',
    'Viz.ai',
    'Groupon',
    'Memberstack',
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 border-b border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-muted-foreground mb-8">
          Trusted by engineering teams at
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-12 lg:gap-x-16">
          {companies.map((company, index) => (
            <div
              key={company}
              className="group cursor-default transition-all"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <span className="text-lg font-semibold text-muted-foreground/50 transition-all group-hover:text-muted-foreground group-hover:scale-110 inline-block">
                {company}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
