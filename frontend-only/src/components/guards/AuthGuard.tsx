import React from 'react';
import { Navigate } from 'react-router-dom';
import { useGuest } from '@/contexts/GuestContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { User, Lock } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallbackPath = '/products' }) => {
  const { isGuest, setUserMode } = useGuest();

  if (isGuest) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-yellow-600" />
            </div>
            <CardTitle className="text-xl">Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              You need to be authenticated to access this page. Currently you're in guest mode with read-only access.
            </p>
            <div className="space-y-2">
              <Button
                onClick={() => setUserMode('authenticated')}
                className="w-full gap-2"
              >
                <User className="h-4 w-4" />
                Switch to Authenticated Mode
              </Button>
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="w-full"
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
