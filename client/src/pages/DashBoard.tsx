import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { GitCommit, GitPullRequest, MessageSquare, GitBranch, Loader2 } from 'lucide-react';
import ContributionGraph from '@/components/ContributionGraph';
import { useDashboardData } from '@/hooks/useDashboard';

export default function DashBoard() {
  const { stats, statsLoading, monthlyActivity, activityLoading } = useDashboardData();

  const statCards = [
    {
      title: 'Total Repositories',
      value: stats?.totalRepos || 0,
      icon: GitBranch,
      description: 'Connected repositories',
      gradient: 'from-blue-500/10 to-blue-500/5',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Total Commits',
      value: stats?.totalCommits?.toLocaleString() || '0',
      icon: GitCommit,
      description: 'In the last year',
      gradient: 'from-green-500/10 to-green-500/5',
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-500',
    },
    {
      title: 'Pull Requests',
      value: stats?.totalPRs || 0,
      icon: GitPullRequest,
      description: 'All time',
      gradient: 'from-purple-500/10 to-purple-500/5',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-500',
    },
    {
      title: 'AI Reviews',
      value: stats?.totalReviews || 0,
      icon: MessageSquare,
      description: 'Generated reviews',
      gradient: 'from-orange-500/10 to-orange-500/5',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-500',
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Overview of your coding activity and AI reviews
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map(stat => (
          <Card
            key={stat.title}
            className="overflow-hidden border-border/50 hover:shadow-md transition-all duration-300"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg ${stat.iconBg} p-2`}>
                <stat.icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {statsLoading ? (
                  <div className="h-7 w-16 animate-pulse rounded-md bg-muted" />
                ) : (
                  stat.value
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50 hover:shadow-md transition-all duration-300">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-lg sm:text-xl">Contribution Activity</CardTitle>
          <CardDescription className="text-sm">
            Visualizing your coding frequency over the last year
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <ContributionGraph />
        </CardContent>
      </Card>

       <Card className="border-border/50 hover:shadow-md transition-all duration-300">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-lg sm:text-xl">Activity Overview</CardTitle>
          <CardDescription className="text-sm">
            Monthly breakdown of your development activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activityLoading ? (
            <div className="h-[300px] sm:h-[400px] w-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Loading activity data...</p>
              </div>
            </div>
          ) : (
            <div className="h-[300px] sm:h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyActivity || []}
                  margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted/30"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                    labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                  />
                  <Legend
                    wrapperStyle={{
                      paddingTop: '20px',
                    }}
                  />
                  <Bar
                    dataKey="commits"
                    name="Commits"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  />
                  <Bar
                    dataKey="prs"
                    name="Pull Requests"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  />
                  <Bar
                    dataKey="reviews"
                    name="AI Reviews"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
