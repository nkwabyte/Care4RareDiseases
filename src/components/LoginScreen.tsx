import { useState } from 'react';
import { Lock, User, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';

interface LoginScreenProps {
  onLoginSuccess: (session: any, doctor: any) => void;
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed. Please check your credentials.');
        setIsLoading(false);
        return;
      }

      // Login successful
      onLoginSuccess(data, data.doctor);
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0514] flex items-center justify-center p-4">
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
        <Card className="bg-[#1a0f2e] border-purple-900/20">
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
                    placeholder="doctor@hospital.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-[#0a0514] border-purple-900/20 text-slate-100 placeholder:text-slate-500 focus:border-purple-500"
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-[#0a0514] border-purple-900/20 text-slate-100 placeholder:text-slate-500 focus:border-purple-500"
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

            <div className="mt-4 p-4 bg-slate-800/30 border border-slate-700/30 rounded-lg">
              <p className="text-xs text-slate-400 mb-3">
                <strong className="text-slate-300">Demo Account:</strong>
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Email:</span>
                  <code className="text-purple-300 bg-slate-900/50 px-2 py-0.5 rounded">admin@care4rare.com</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Password:</span>
                  <code className="text-purple-300 bg-slate-900/50 px-2 py-0.5 rounded">admin123</code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-slate-500">
          <p>Secure medical diagnostic platform</p>
          <p className="mt-1">All data is encrypted and HIPAA compliant</p>
        </div>
      </div>
    </div>
  );
}
