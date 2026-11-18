import { useState } from 'react';
import { Lock, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LoginScreenProps {
  onLoginSuccess: (email: string, password: string) => Promise<void>;
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call the parent's onLoginSuccess which dispatches the Server Action via Redux
      await onLoginSuccess(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-2xl mb-4">
            <Lock className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-slate-100 mb-2">Care for Rare</h1>
          <p className="text-slate-400">
            Rare Disease Diagnostic Platform
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-popover border-purple-900/20">
          <CardHeader>
            <CardTitle className="text-slate-100">Doctor Login</CardTitle>
            <CardDescription className="text-slate-400">
              Enter your credentials to access the diagnostic platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert className="bg-red-500/10 border-red-500/20">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-300">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Email Address
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="username"
                    spellCheck={false}
                    placeholder="doctor@hospital.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-background border-purple-900/20 text-slate-100 placeholder:text-muted-foreground focus:border-purple-500"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-background border-purple-900/20 text-slate-100 placeholder:text-muted-foreground focus:border-purple-500"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <p className="text-xs text-slate-400">
                <strong className="text-purple-300">Note:</strong> Access to this platform is restricted to enrolled medical professionals.
                Contact your administrator if you need login credentials.
              </p>
            </div>

          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>Authorised clinical users only. Access is logged.</p>
        </div>
      </div>
    </div>
  );
}
