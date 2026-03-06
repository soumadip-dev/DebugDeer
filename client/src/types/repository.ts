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

export interface ConnectedRepository {
  id: string;
  name: string;
  fullName: string;
  url: string;
  createdAt: string;
}

export interface ConnectedRepositoriesResponse {
  success: boolean;
  message: string;
  data: ConnectedRepository[];
}

export interface DisconnectRepositoryResponse {
  success: boolean;
  message: string;
}

export interface DisconnectAllRepositoriesResponse {
  success: boolean;
  message: string;
}
