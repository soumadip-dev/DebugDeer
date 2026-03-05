export interface Repository {
  id: number;
  name: string;
  fullName: string;
  url: string;
  description: string | null;
  private: boolean;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
  connected: boolean;
}

export interface PaginationInfo {
  page: number;
  perPage: number;
}

export interface RepositoriesResponse {
  success: boolean;
  data: Repository[];
  pagination: PaginationInfo;
}

export interface RepositoriesQueryParams {
  page?: number;
  perPage?: number;
}

export interface ConnectRepositoryParams {
  owner: string;
  repo: string;
  githubId: number;
}
