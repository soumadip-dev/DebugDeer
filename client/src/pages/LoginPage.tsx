import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';

import { Github } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function LoginPage() {




  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-96">
        <CardContent className="p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-6">Login</h1>
            <Button
              variant="outline"
              size="lg"
              onClick={handleGithubLogin}
              disabled={isLoading}
              className="w-full"
            >
              <Github className="mr-2 h-5 w-5" />
              {isLoading ? 'Logging in...' : 'Login with GitHub'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
