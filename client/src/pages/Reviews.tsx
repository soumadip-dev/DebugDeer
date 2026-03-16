import { useReviews } from '@/hooks/useReviews';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ExternalLink,
  Clock,
  GitPullRequest,
  CheckCircle2,
  XCircle,
  GitBranch,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';

export default function Reviews() {
  const { data: reviews, isLoading, isError } = useReviews();

  if (isLoading) {
    return (
      <div className="space-y-6 md:space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Reviews
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Overview of your AI-powered code reviews
          </p>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <Card
              key={i}
              className="border-border/50 hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-48 bg-muted rounded animate-pulse" />
                      <div className="h-5 w-20 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="h-4 w-64 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="h-9 w-9 bg-muted rounded animate-pulse" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-5">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-20 bg-muted/50 rounded-lg animate-pulse" />
                <div className="h-9 w-36 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6 md:space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Reviews
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Overview of your AI-powered code reviews
          </p>
        </div>
        <Card className="border-border/50 hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-destructive/10 p-4 mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <p className="text-sm font-medium text-destructive mb-2">Failed to load reviews</p>
            <p className="text-xs text-muted-foreground mb-4">Please try again</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="h-9 border-border/60 hover:bg-muted/50 transition-all"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge
            variant="secondary"
            className="gap-1 bg-green-500/10 text-green-600 border-green-500/20 font-normal"
          >
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </Badge>
        );
      case 'failed':
        return (
          <Badge
            variant="destructive"
            className="gap-1 bg-destructive/10 text-destructive border-destructive/20 font-normal"
          >
            <XCircle className="h-3 w-3" />
            Failed
          </Badge>
        );
      case 'pending':
        return (
          <Badge
            variant="outline"
            className="gap-1 bg-yellow-500/10 text-yellow-600 border-yellow-500/20 font-normal"
          >
            <Loader2 className="h-3 w-3 animate-spin" />
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Reviews
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Overview of your AI-powered code reviews
        </p>
      </div>

      {!reviews?.length ? (
        <Card className="border-border/50 hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted/30 p-4 mb-4">
              <GitPullRequest className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">No reviews yet</p>
            <p className="text-xs text-muted-foreground/60 text-center max-w-sm">
              Reviews will appear here once you create pull requests and AI completes the analysis
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reviews.map(review => (
            <Card
              key={review.id}
              className="border-border/50 hover:shadow-md transition-all duration-300 overflow-hidden group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-base sm:text-lg font-semibold truncate">
                        {review.prTitle}
                      </CardTitle>
                      {getStatusBadge(review.status)}
                    </div>
                    <CardDescription className="flex items-center gap-1.5 text-sm">
                      <GitBranch className="h-3.5 w-3.5" />
                      {review.repository.fullName} • PR #{review.prNumber}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="text-muted-foreground hover:text-foreground h-9 w-9 shrink-0"
                  >
                    <a href={review.repository.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-5 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>
                      {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                {review.status === 'completed' && (
                  <>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <div className="bg-muted/40 border border-border/50 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground line-clamp-3">
                          <ReactMarkdown>{review.review}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      asChild
                      className="border-border/60 hover:bg-muted/50 transition-all h-9"
                    >
                      <a href={review.prUrl} target="_blank" rel="noopener noreferrer">
                        View full review on GitHub
                      </a>
                    </Button>
                  </>
                )}

                {review.status === 'pending' && (
                  <div className="bg-muted/40 border border-border/50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        AI is analyzing your pull request...
                      </p>
                    </div>
                  </div>
                )}

                {review.status === 'failed' && (
                  <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <p className="text-sm text-destructive/90">
                        Review failed to complete. Please try again.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
