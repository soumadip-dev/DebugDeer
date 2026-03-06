import { useDashboardData } from '@/hooks/useDashboard';
import { ActivityCalendar } from 'react-activity-calendar';
import { useTheme } from './theme-provider';
import { useEffect, useRef, useState } from 'react';

export default function ContributionGraph() {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [blockSize, setBlockSize] = useState(10);
  const [showWeekdays, setShowWeekdays] = useState(true);

  console.log(theme);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.offsetWidth;

      if (width < 400) {
        setBlockSize(6);
        setShowWeekdays(false);
      } else if (width < 500) {
        setBlockSize(7);
        setShowWeekdays(false);
      } else if (width < 640) {
        setBlockSize(8);
        setShowWeekdays(true);
      } else if (width < 768) {
        setBlockSize(9);
        setShowWeekdays(true);
      } else if (width < 1024) {
        setBlockSize(10);
        setShowWeekdays(true);
      } else {
        setBlockSize(12);
        setShowWeekdays(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <div className="w-full flex flex-col items-center gap-4 p-2 sm:p-4">
      <div className="flex justify-center w-full">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-primary/10 px-2.5 sm:px-4 py-1 sm:py-1.5">
          <span className="text-[10px] sm:text-xs md:text-sm font-medium text-primary">
            Total contributions
          </span>
          <span className="text-xs sm:text-sm md:text-base font-bold text-primary">
            {contributionGraph.totalContributions.toLocaleString()}
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="w-full flex justify-center overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
      >
        <div className="px-2 sm:px-0">
          <ActivityCalendar
            data={contributionGraph.contributions}
            blockSize={blockSize}
            blockMargin={blockSize < 8 ? 2 : 4}
            fontSize={showWeekdays ? 12 : 10}
            showMonthLabels
            showWeekdayLabels={showWeekdays}
            theme={{
              light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
              dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
            }}
            labels={{
              totalCount: '{{count}} contributions in the last year',
            }}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-0.5 sm:gap-1">
          {['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'].map((color, i) => (
            <div
              key={i}
              className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-sm"
              style={{
                backgroundColor:
                  theme === 'dark'
                    ? ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'][i]
                    : color,
              }}
            />
          ))}
        </div>
        <span>More</span>
      </div>

      <p className="text-[10px] text-muted-foreground/50 sm:hidden">
        Scroll horizontally to see all contributions →
      </p>
    </div>
  );
}
