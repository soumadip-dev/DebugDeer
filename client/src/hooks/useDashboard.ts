import { useQuery } from '@tanstack/react-query';
import type {
  DashboardStatsResponse,
  MonthlyActivityResponse,
  DashboardStats,
  MonthlyActivity,
  ContributionGraphResponse,
  ContributionGraph,
} from '../types/dashboard';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

async function fetchDashboardStats(): Promise<DashboardStatsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }
  return response.json();
}

async function fetchMonthlyActivity(): Promise<MonthlyActivityResponse> {
  const response = await fetch(`${API_BASE_URL}/api/dashboard/activity`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch monthly activity');
  }

  return response.json();
}

async function fetchContributionGraph(): Promise<ContributionGraphResponse> {
  const response = await fetch(`${API_BASE_URL}/api/dashboard/contribution-graph`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch contribution graph');
  }

  return response.json();
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
    refetchOnWindowFocus: false,
    select: (data): DashboardStats => data.data,
  });
}

export function useMonthlyActivity() {
  return useQuery({
    queryKey: ['monthly-activity'],
    queryFn: fetchMonthlyActivity,
    refetchOnWindowFocus: false,
    select: (data): MonthlyActivity[] => data.data,
  });
}

export function useContributionGraph() {
  return useQuery({
    queryKey: ['contribution-graph'],
    queryFn: fetchContributionGraph,
    staleTime: 5 * 60 * 1000,
    select: (data): ContributionGraph => data.data,
  });
}

export function useDashboardData() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();

  const {
    data: monthlyActivity,
    isLoading: activityLoading,
    error: activityError,
  } = useMonthlyActivity();

  const {
    data: contributionGraph,
    isLoading: graphLoading,
    error: graphError,
  } = useContributionGraph();

  return {
    stats,
    monthlyActivity,
    contributionGraph,
    activityLoading,
    statsLoading,
    graphLoading,
    error: statsError || activityError || graphError,
  };
}
