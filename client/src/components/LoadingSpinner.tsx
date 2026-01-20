import { Loader } from 'lucide-react';

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <Loader className="animate-spin" size={40} />
  </div>
);
