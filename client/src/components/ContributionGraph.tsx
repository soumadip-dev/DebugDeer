import { useDashboardData } from '@/hooks/useDashboard';
import { ActivityCalendar } from 'react-activity-calendar';
import { useTheme } from './theme-provider';

export default function ContributionGraph() {
  const { theme } = useTheme();

  console.log(theme);

  const { contributionGraph, graphLoading } = useDashboardData();
  if (graphLoading)
    return (
      <div className="w-full flex flex-col items-center justify-center p-8">
        <div className="animate-pulse text-muted-foreground">Loading contribution data...</div>
      </div>
    );

  if (!contributionGraph || !contributionGraph.contributions.length) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-8">
        <div className="text-muted-foreground">No contribution data available</div>
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col items-center gap-4 p-4">
      <div className="font-semibold text-foreground">
        <span className="font-semibold text-foreground">
          {contributionGraph.totalContributions}
        </span>
        &nbsp;contributions in the last year
      </div>
      <ActivityCalendar
        data={contributionGraph.contributions}
        blockSize={11}
        blockMargin={4}
        fontSize={14}
        showMonthLabels
        showWeekdayLabels
        theme={{
          light: ['hsl(0, 0%, 92%)', 'hsl(142,71%,45%)'],
          dark: ['#161b22', 'hsl(142,71%,45%)'],
        }}
      />
    </div>
  );
}
