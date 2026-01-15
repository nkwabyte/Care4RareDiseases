import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function SetupHelper() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSetup = async () => {
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-fbf76271/setup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Setup failed');
      }

      setSuccess(true);
    } catch (err: any) {
      console.error('Setup error:', err);
      setError(err.message || 'An error occurred during setup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0514] flex items-center justify-center p-4">
      <Card className="bg-[#1a0f2e] border-purple-900/20 max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-slate-100">Database Setup</CardTitle>
          <CardDescription className="text-slate-400">
            Initialize demo doctors and patients for the Care for Rare platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {success && (
            <Alert className="bg-green-500/10 border-green-500/20">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-300">
                Demo data initialized successfully! You can now log in with the demo credentials.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="bg-red-500/10 border-red-500/20">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 space-y-3">
            <h3 className="text-slate-100">Demo Credentials</h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-purple-300">Doctor 1:</p>
                <p className="text-slate-400">Email: kwame.mensah@hospital.gh</p>
                <p className="text-slate-400">Password: demo123</p>
              </div>
              <div className="mt-2">
                <p className="text-purple-300">Doctor 2:</p>
                <p className="text-slate-400">Email: ama.asante@hospital.gh</p>
                <p className="text-slate-400">Password: demo123</p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSetup}
            disabled={isLoading || success}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : success ? (
              'Setup Complete'
            ) : (
              'Initialize Demo Data'
            )}
          </Button>

          {success && (
            <p className="text-center text-sm text-slate-400">
              You can now close this page and access the login screen
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
