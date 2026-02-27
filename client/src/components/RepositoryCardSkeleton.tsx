import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function RepositoryCardSkeleton() {
  return (
    <Card className="border-border/50 hover:shadow-md transition-all duration-300 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap items-center gap-5">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

export function RepositoryListSkeleton() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <RepositoryCardSkeleton key={i} />
      ))}
    </div>
  );
}
