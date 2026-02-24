export interface DashboardStatsResponse {
  message: string;
  data: {
    totalCommits: number;
    totalPRs: number;
    totalReviews: number;
    totalRepos: number;
  };
}

export interface MonthlyActivityResponse {
  message: string;
  data: {
    name: string;
    commits: number;
    prs: number;
    reviews: number;
  }[];
}
export interface ContributionGraphResponse {
  message: string;
  data: {
    contributions: {
      date: string;
      count: number;
      level: number;
    }[];
    totalContributions: number;
  };
}
export interface DashboardStats {
  totalCommits: number;
  totalPRs: number;
  totalReviews: number;
  totalRepos: number;
}

export interface MonthlyActivity {
  name: string;
  commits: number;
  prs: number;
  reviews: number;
}

export interface ContributionGraph {
  contributions: {
    date: string;
    count: number;
    level: number;
  }[];
  totalContributions: number;
}
