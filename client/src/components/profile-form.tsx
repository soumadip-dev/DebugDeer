import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, type ProfileFormValues } from '@/lib/validations/profile';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useUserProfile, useUpdateUserProfile } from '@/hooks/useUser';
import type { UpdateUserProfileParams } from '@/types/user';
import { User, Mail, Loader2 } from 'lucide-react';

export function ProfileForm() {
  const { data: profile, isLoading, error } = useUserProfile();
  const updateMutation = useUpdateUserProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || '',
        email: profile.email || '',
      });
    }
  }, [profile, reset]);

  const onSubmit = (data: ProfileFormValues) => {
    const updates: UpdateUserProfileParams = {};

    if (data.name !== profile?.name) updates.name = data.name;
    if (data.email !== profile?.email) updates.email = data.email;

    if (Object.keys(updates).length === 0) {
      toast.error('No changes to save');
      return;
    }

    updateMutation.mutate(updates, {
      onSuccess: data => {
        if (data?.success) {
          toast.success('Profile updated successfully');
          reset({
            name: data.data.name,
            email: data.data.email,
          });
        }
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to update profile');
      },
    });
  };

  if (error) {
    return (
      <Card className="border-border/50 hover:shadow-md transition-all duration-300 overflow-hidden">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-lg sm:text-xl">Profile Settings</CardTitle>
          <CardDescription className="text-sm">Update your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-destructive/10 p-3 mb-4">
              <div className="text-2xl">⚠️</div>
            </div>
            <p className="text-sm font-medium text-destructive">Failed to load profile</p>
            <p className="text-xs text-muted-foreground mt-1">Please try again later</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="border-border/50 hover:shadow-md transition-all duration-300 overflow-hidden">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-lg sm:text-xl">Profile Settings</CardTitle>
          <CardDescription className="text-sm">Update your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              <div className="h-10 bg-muted rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              <div className="h-10 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-10 w-32 bg-muted rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 hover:shadow-md transition-all duration-300 overflow-hidden">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-lg sm:text-xl">Profile Settings</CardTitle>
        <CardDescription className="text-sm">Update your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="John Doe"
                {...register('name')}
                disabled={updateMutation.isPending}
                className={`pl-9 ${errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
            </div>
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register('email')}
                disabled={updateMutation.isPending}
                className={`pl-9 ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={updateMutation.isPending || !isDirty || !isValid}
              className="min-w-[100px]"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>

            {isDirty && (
              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
