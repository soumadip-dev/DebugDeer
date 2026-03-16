import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  useConnectedRepositories,
  useDisconnectRepository,
  useDisconnectAllRepositories,
} from '../hooks/useRepositories';
import toast from 'react-hot-toast';
import { ExternalLink, Trash2, AlertTriangle, Loader2, GitBranch } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

const RepositoryList = () => {
  const [disconnectAllOpen, setDisconnectAllOpen] = useState(false);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);

  const { data: connectedRepos, isLoading } = useConnectedRepositories();
  const disconnectRepo = useDisconnectRepository();
  const disconnectAllRepos = useDisconnectAllRepositories();

  const handleDisconnect = (repoId: string) => {
    setDisconnectingId(repoId);
    disconnectRepo.mutate(repoId, {
      onSettled: () => {
        setDisconnectingId(null);
      },
      onError: error => {
        toast.error(error.message);
      },
    });
  };

  const handleDisconnectAll = () => {
    disconnectAllRepos.mutate(undefined, {
      onSuccess: () => {
        setDisconnectAllOpen(false);
        toast.success('All repositories disconnected successfully');
      },
      onError: error => {
        toast.error(error.message);
        setDisconnectAllOpen(false);
      },
    });
  };

  if (isLoading) {
    return (
      <Card className="border-border/50 hover:shadow-md transition-all duration-300 overflow-hidden">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-lg sm:text-xl">Connected Repositories</CardTitle>
          <CardDescription className="text-sm">
            Repositories you've connected for AI code reviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground animate-pulse">Loading repositories...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 hover:shadow-md transition-all duration-300 overflow-hidden">
      <CardHeader className="space-y-1 pb-4 flex flex-row items-start justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg sm:text-xl">Connected Repositories</CardTitle>
          <CardDescription className="text-sm">
            Repositories you've connected for AI code reviews
          </CardDescription>
        </div>
        {connectedRepos && connectedRepos.length > 0 && (
          <AlertDialog open={disconnectAllOpen} onOpenChange={setDisconnectAllOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="shadow-sm hover:shadow-md transition-all"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Disconnect All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-lg">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Disconnect All Repositories?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-muted-foreground">
                  This will disconnect all {connectedRepos.length} repositories and remove their
                  webhooks. You'll need to reconnect them individually to resume AI code reviews.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-2 mt-4">
                <AlertDialogCancel disabled={disconnectAllRepos.isPending} className="mt-0 sm:mt-0">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDisconnectAll}
                  disabled={disconnectAllRepos.isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow-md transition-all"
                >
                  {disconnectAllRepos.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Disconnecting...
                    </>
                  ) : (
                    'Disconnect All'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardHeader>
      <CardContent>
        {!connectedRepos || connectedRepos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted/30 p-4 mb-4">
              <GitBranch className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">No repositories connected</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Connect a repository to start getting AI code reviews
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {connectedRepos.map(repo => (
              <div
                key={repo.id}
                className="group flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-all duration-200 hover:shadow-sm"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium truncate">{repo.fullName}</h3>
                    <Badge
                      variant="outline"
                      className="bg-green-500/5 text-green-600 border-green-200 dark:border-green-900"
                    >
                      Connected
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Connected on{' '}
                    {new Date(repo.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(repo.url, '_blank')}
                    className="h-9 w-9 hover:bg-accent"
                    title="View on GitHub"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDisconnect(repo.id)}
                    disabled={disconnectingId === repo.id}
                    className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                    title="Disconnect repository"
                  >
                    {disconnectingId === repo.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}

            <p className="text-xs text-muted-foreground/60 text-center pt-4">
              {connectedRepos.length} {connectedRepos.length === 1 ? 'repository' : 'repositories'}{' '}
              connected
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RepositoryList;
