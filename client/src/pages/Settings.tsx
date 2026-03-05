import { ProfileForm } from '@/components/profile-form';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your account settings and connected repositories
        </p>
      </div>
      <ProfileForm />
    </div>
  );
};

export default Settings;
