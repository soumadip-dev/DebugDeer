import { Input } from '@/components/ui/input';
import { useRepositories } from '@/hooks/useRepositories';
import {
  Clock,
  ExternalLink,
  GitFork,
  Globe,
  Lock,
  Search,
  Star,
  Loader2,
  Filter,
  GitBranch,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Repository } from '../types/repository';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RepositoryListSkeleton } from '@/components/RepositoryCardSkeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useConnectRepository } from '@/hooks/useRepositories';

type ConnectionFilter = 'all' | 'connected' | 'not-connected';

export default function Repositories() {
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useRepositories();

  const { mutate: connectRepo } = useConnectRepository();

  const [searchQuery, setSearchQuery] = useState('');
  const [connectionFilter, setConnectionFilter] = useState<ConnectionFilter>('all');
  const [localConnectingID, setLocalConnectingID] = useState<number | null>(null);
  const observerTarget = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    const currentTarget = observerTarget.current;

    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="space-y-6 md:space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Repositories
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage and connect your GitHub repositories
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search repositories..."
              className="pl-9 h-9 bg-muted/40 border-border/60 focus-visible:ring-1"
              disabled
            />
          </div>
          <Button variant="outline" className="h-9" disabled>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        <RepositoryListSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6 md:space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Repositories
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage and connect your GitHub repositories
          </p>
        </div>
        <Card className="border-border/50 hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-destructive/10 p-4 mb-4">
              <div className="text-3xl">⚠️</div>
            </div>
            <p className="text-sm font-medium text-destructive mb-2">Failed to load repositories</p>
            <p className="text-xs text-muted-foreground mb-4">Please try again</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="h-9">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const allRepositories = data?.pages.flatMap(page => page.data) || [];

  const filteredRepositories = allRepositories.filter((repo: Repository) => {
    const matchesSearch =
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.fullName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesConnection =
      connectionFilter === 'all' ||
      (connectionFilter === 'connected' && repo.connected) ||
      (connectionFilter === 'not-connected' && !repo.connected);

    return matchesSearch && matchesConnection;
  });

  const handleConnectRepo = (repo: Repository) => {
    setLocalConnectingID(repo.id);
    const final = {
      owner: repo.fullName.split('/')[0],
      repo: repo.name,
      githubId: repo.id,
    };

    connectRepo(final, {
      onSettled: () => setLocalConnectingID(null),
    });
  };

  const connectedCount = allRepositories.filter((r: Repository) => r.connected).length;
  const notConnectedCount = allRepositories.filter((r: Repository) => !r.connected).length;

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Repositories
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage and connect your GitHub repositories
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search repositories..."
            className="pl-9 h-9 bg-background border-border/60 focus-visible:ring-1 focus-visible:ring-offset-0"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9 border-border/60">
              <Filter className="h-4 w-4 mr-2" />
              {connectionFilter === 'all' && 'All Repositories'}
              {connectionFilter === 'connected' && 'Connected'}
              {connectionFilter === 'not-connected' && 'Not Connected'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuRadioGroup
              value={connectionFilter}
              onValueChange={value => setConnectionFilter(value as ConnectionFilter)}
            >
              <DropdownMenuRadioItem value="all" className="cursor-pointer">
                All ({allRepositories.length})
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="connected" className="cursor-pointer">
                Connected ({connectedCount})
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="not-connected" className="cursor-pointer">
                Not Connected ({notConnectedCount})
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {filteredRepositories.length === 0 ? (
        <Card className="border-border/50 hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted/30 p-4 mb-4">
              <GitBranch className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">No repositories found</p>
            <p className="text-xs text-muted-foreground/60 mb-4">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Try changing your filter selection'}
            </p>
            {(connectionFilter !== 'all' || searchQuery) && (
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => {
                  setSearchQuery('');
                  setConnectionFilter('all');
                }}
              >
                Clear all filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredRepositories.map((repo: Repository) => (
            <Card
              key={repo.id}
              className="border-border/50 hover:shadow-md transition-all duration-300 overflow-hidden group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-base sm:text-lg font-semibold truncate">
                        {repo.name}
                      </CardTitle>

                      {repo.language && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-muted/40 border-border/60 font-normal"
                        >
                          {repo.language}
                        </Badge>
                      )}

                      {repo.connected ? (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-green-500/10 text-green-600 border-green-500/20 font-normal"
                        >
                          Connected
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-xs bg-muted/20 border-border/60 font-normal"
                        >
                          Available
                        </Badge>
                      )}
                    </div>

                    {repo.description && (
                      <CardDescription className="text-sm line-clamp-2">
                        {repo.description}
                      </CardDescription>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="text-muted-foreground hover:text-foreground h-9 w-9"
                    >
                      <a href={repo.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>

                    <Button
                      onClick={() => handleConnectRepo(repo)}
                      variant={repo.connected ? 'outline' : 'default'}
                      size="sm"
                      className={`min-w-[90px] h-9 ${
                        repo.connected
                          ? 'border-border/60 hover:bg-muted/50'
                          : 'shadow-sm hover:shadow-md'
                      }`}
                      disabled={localConnectingID === repo.id}
                    >
                      {localConnectingID === repo.id ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          <span>Connecting</span>
                        </>
                      ) : repo.connected ? (
                        'Connected'
                      ) : (
                        'Connect'
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex flex-wrap items-center gap-5 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4" />
                    <span>{repo.stars?.toLocaleString() || 0}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <GitFork className="h-4 w-4" />
                    <span>{repo.forks?.toLocaleString() || 0}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {repo.private ? (
                      <>
                        <Lock className="h-4 w-4" />
                        <span>Private</span>
                      </>
                    ) : (
                      <>
                        <Globe className="h-4 w-4" />
                        <span>Public</span>
                      </>
                    )}
                  </div>

                  {repo.updatedAt && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>
                        Updated{' '}
                        {new Date(repo.updatedAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div ref={observerTarget} className="py-4">
        {isFetchingNextPage && (
          <div className="space-y-4">
            <RepositoryListSkeleton />
          </div>
        )}
        {!hasNextPage && allRepositories.length > 0 && (
          <p className="text-center text-xs text-muted-foreground/60 py-4">
            You've reached the end of the list
          </p>
        )}
      </div>
    </div>
  );
}
