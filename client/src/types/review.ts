export interface Review {
  id: string;
  prNumber: number;
  prTitle: string;
  prUrl: string;
  review: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  repository: {
    id: string;
    name: string;
    fullName: string;
    url: string;
  };
}

export interface ReviewsResponse {
  success: boolean;
  message: string;
  data: Review[];
}

export interface ReviewDetailsResponse {
  success: boolean;
  message: string;
  data: Review;
}

export interface ReviewsQueryParams {
  page?: number;
  perPage?: number;
  repositoryId?: string;
  status?: string;
}

export interface PaginationInfo {
  page: number;
  perPage: number;
  total?: number;
}

export interface PaginatedReviewsResponse {
  success: boolean;
  message: string;
  data: Review[];
  pagination: PaginationInfo;
}
