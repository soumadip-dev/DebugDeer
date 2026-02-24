import { useDashboardData } from '@/hooks/useDashboard';
import { ActivityCalendar } from 'react-activity-calendar';
import { useTheme } from './theme-provider';

export default function ContributionGraph() {
  const { theme } = useTheme();

  console.log(theme);

  const { contributionGraph, graphLoading } = useDashboardData();
  if (graphLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-12 sm:py-16">
        <div className="space-y-4 text-center">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-transparent via-primary/10 to-transparent blur-xl" />
            <div className="relative h-8 w-8 sm:h-10 sm:w-10 animate-spin rounded-full border-4 border-muted border-t-primary mx-auto" />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading contribution data...
          </p>
        </div>
      </div>
    );
  }

  if (!contributionGraph || !contributionGraph.contributions?.length) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-12 sm:py-16">
        <div className="text-center space-y-2">
          <div className="text-4xl sm:text-5xl mb-2">📊</div>
          <p className="text-sm sm:text-base font-medium text-muted-foreground">
            No contribution data available
          </p>
          <p className="text-xs text-muted-foreground/60">Start coding to see your activity here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-4 p-4">
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 sm:px-4 py-1.5 sm:py-2">
          <span className="text-xs sm:text-sm font-medium text-primary">Total contributions</span>
          <span className="text-sm sm:text-base font-bold text-primary">
            {contributionGraph.totalContributions.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="min-w-max px-2 sm:px-0">
        <ActivityCalendar
          data={contributionGraph.contributions}
          blockSize={10}
          blockMargin={4}
          fontSize={12}
          showMonthLabels
          showWeekdayLabels
          theme={{
            light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
            dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
          }}
          labels={{
            totalCount: '{{count}} contributions in the last year',
          }}
        />
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span>Less</span>
        {['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'].map((color, i) => (
          <div
            key={i}
            className="h-3 w-3 rounded-sm"
            style={{
              backgroundColor:
                theme === 'dark'
                  ? ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'][i]
                  : color,
            }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
