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

    // Only include fields that have changed
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

  // Show error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500">
            Failed to load profile. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
            <div className="h-10 bg-muted rounded w-32"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Update your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              {...register('name')}
              disabled={updateMutation.isPending}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register('email')}
              disabled={updateMutation.isPending}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={updateMutation.isPending || !isDirty || !isValid}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
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
