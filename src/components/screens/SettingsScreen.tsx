import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, Bell, Eye, Shield, Database, LogOut, KeyRound, MonitorSmartphone } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { logout } from '@/lib/store/slices/authSlice';
import {
  changePasswordAction,
  getSecurityPolicyAction,
  signOutEverywhereAction,
} from '@/lib/actions/auth';
import { toast } from 'sonner';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrator',
  clinician: 'Clinician',
  researcher: 'Researcher',
  user: 'User',
};

type Policy = { sessionMaxHours: number; idleTimeoutMinutes: number; maxFailedLogins: number; minPasswordLength: number };

function PreviewBadge() {
  return (
    <span className="text-xs font-medium uppercase tracking-wide text-warning bg-warning-soft border border-warning/30 rounded px-1.5 py-0.5">
      Not yet available
    </span>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-foreground">{value}</p>
    </div>
  );
}

export function SettingsScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.doctor);

  // Preview-only controls (not persisted; disabled in the UI)
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [analysisComplete, setAnalysisComplete] = useState(true);
  const [newPatientAssigned, setNewPatientAssigned] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('Africa/Accra');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [compactView, setCompactView] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState('0.8');
  const [maxCandidateGenes, setMaxCandidateGenes] = useState('10');

  // Security (real)
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSigningOutAll, setIsSigningOutAll] = useState(false);

  useEffect(() => {
    getSecurityPolicyAction().then((r) => r.success && r.policy && setPolicy(r.policy));
  }, []);

  const handleLogout = async () => {
    await dispatch(logout());
    router.push('/login');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    setIsChangingPassword(true);
    const result = await changePasswordAction(currentPassword, newPassword);
    setIsChangingPassword(false);
    if (!result.success) {
      setPasswordError(result.error ?? 'Could not change password');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    toast.success('Password changed', { description: 'All other sessions have been signed out.' });
  };

  const handleSignOutEverywhere = async () => {
    setIsSigningOutAll(true);
    const result = await signOutEverywhereAction();
    setIsSigningOutAll(false);
    if (!result.success) {
      toast.error(result.error ?? 'Could not sign out other sessions');
      return;
    }
    await dispatch(logout());
    router.push('/login');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-[-0.01em] text-foreground">Settings</h1>
            <p className="text-muted-foreground">Your account and session security</p>
          </div>
          <Button
            variant="outline"
            className="border border-input text-foreground hover:bg-muted gap-2"
            onClick={handleLogout}
          >
            <LogOut size={16} aria-hidden />
            Log out
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <Card className="bg-card border-border">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div>
                  <h2 className="text-foreground">Account</h2>
                  <p className="text-muted-foreground">Name, email and role are managed by your administrator.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <ReadOnlyField label="Full name" value={user?.name ?? '—'} />
                <ReadOnlyField label="Email" value={user?.email ?? '—'} />
                <ReadOnlyField label="Role" value={ROLE_LABELS[user?.role ?? ''] ?? '—'} />
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div>
                  <h2 className="text-foreground">Security</h2>
                  <p className="text-muted-foreground">Policies enforced for every account on this system.</p>
                </div>
              </div>

              {policy && (
                <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="rounded-lg border border-border p-4">
                    <dt className="text-sm text-muted-foreground">Idle sign-out</dt>
                    <dd className="text-foreground mt-1">After {policy.idleTimeoutMinutes} minutes of inactivity</dd>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <dt className="text-sm text-muted-foreground">Maximum session length</dt>
                    <dd className="text-foreground mt-1">{policy.sessionMaxHours} hours</dd>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <dt className="text-sm text-muted-foreground">Failed sign-in lockout</dt>
                    <dd className="text-foreground mt-1">After {policy.maxFailedLogins} attempts, for 15 minutes</dd>
                  </div>
                </dl>
              )}

              <Separator className="bg-muted mb-6" />

              <form onSubmit={handleChangePassword} className="space-y-4" noValidate>
                <h3 className="text-foreground flex items-center gap-2">
                  <KeyRound size={16} className="text-primary" aria-hidden /> Change password
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-foreground">Current password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      autoComplete="current-password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-surface border-border text-foreground"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-foreground">New password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      autoComplete="new-password"
                      minLength={policy?.minPasswordLength ?? 12}
                      aria-describedby="newPasswordHint"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-surface border-border text-foreground"
                      required
                    />
                    <p id="newPasswordHint" className="text-xs text-muted-foreground">
                      At least {policy?.minPasswordLength ?? 12} characters. A passphrase works well.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-foreground">Confirm new password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-surface border-border text-foreground"
                      required
                    />
                  </div>
                </div>
                {passwordError && (
                  <p role="alert" className="text-sm text-destructive">{passwordError}</p>
                )}
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover"
                  disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                >
                  {isChangingPassword ? 'Changing…' : 'Change password'}
                </Button>
              </form>

              <Separator className="bg-muted my-6" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-foreground flex items-center gap-2">
                    <MonitorSmartphone size={16} className="text-primary" aria-hidden /> Sign out everywhere
                  </h3>
                  <p className="text-muted-foreground text-sm">Ends every session on all devices, including this one.</p>
                </div>
                <Button
                  variant="outline"
                  className="border-destructive/30 text-destructive hover:bg-destructive-soft hover:text-destructive"
                  onClick={handleSignOutEverywhere}
                  disabled={isSigningOutAll}
                >
                  {isSigningOutAll ? 'Signing out…' : 'Sign out all sessions'}
                </Button>
              </div>
            </div>
          </Card>

          <p id="preview-note" className="text-sm text-muted-foreground">
            The sections below are design previews. Their settings are not saved yet.
          </p>
          {/* Notifications Section */}
          <Card className="bg-card border-border">
            <fieldset disabled className="p-6 disabled:opacity-60" aria-describedby="preview-note">
              <div className="flex items-center gap-3 mb-6">
                <div>
                  <h2 className="text-foreground flex items-center gap-2">Notifications <PreviewBadge /></h2>
                  <p className="text-muted-foreground">Configure how you receive updates</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-foreground">Email Notifications</p>
                    <p className="text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-foreground">Analysis Complete</p>
                    <p className="text-muted-foreground">Notify when patient analysis is complete</p>
                  </div>
                  <Switch
                    checked={analysisComplete}
                    onCheckedChange={setAnalysisComplete}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-foreground">New Patient Assigned</p>
                    <p className="text-muted-foreground">Notify when a new patient is assigned to you</p>
                  </div>
                  <Switch
                    checked={newPatientAssigned}
                    onCheckedChange={setNewPatientAssigned}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-foreground">Weekly Digest</p>
                    <p className="text-muted-foreground">Receive a weekly summary of your cases</p>
                  </div>
                  <Switch
                    checked={weeklyDigest}
                    onCheckedChange={setWeeklyDigest}
                  />
                </div>
              </div>
            </fieldset>
          </Card>

          {/* Display Preferences Section */}
          <Card className="bg-card border-border">
            <fieldset disabled className="p-6 disabled:opacity-60" aria-describedby="preview-note">
              <div className="flex items-center gap-3 mb-6">
                <div>
                  <h2 className="text-foreground flex items-center gap-2">Display Preferences <PreviewBadge /></h2>
                  <p className="text-muted-foreground">Customize your viewing experience</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-foreground">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language" className="bg-surface border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-foreground">Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger id="timezone" className="bg-surface border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="GMT">GMT (Greenwich Mean Time)</SelectItem>
                        <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                        <SelectItem value="Africa/Cairo">Cairo (GMT+2)</SelectItem>
                        <SelectItem value="Africa/Johannesburg">Johannesburg (GMT+2)</SelectItem>
                        <SelectItem value="Africa/Lagos">Lagos (GMT+1)</SelectItem>
                        <SelectItem value="Africa/Nairobi">Nairobi (GMT+3)</SelectItem>
                        <SelectItem value="Africa/Accra">Accra (GMT)</SelectItem>
                        <SelectItem value="Africa/Casablanca">Casablanca (GMT+1)</SelectItem>
                        <SelectItem value="Africa/Algiers">Algiers (GMT+1)</SelectItem>
                        <SelectItem value="Africa/Addis_Ababa">Addis Ababa (GMT+3)</SelectItem>
                        <SelectItem value="Africa/Dar_es_Salaam">Dar es Salaam (GMT+3)</SelectItem>
                        <SelectItem value="Africa/Kampala">Kampala (GMT+3)</SelectItem>
                        <SelectItem value="Africa/Khartoum">Khartoum (GMT+2)</SelectItem>
                        <SelectItem value="Africa/Kinshasa">Kinshasa (GMT+1)</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT/BST)</SelectItem>
                        <SelectItem value="Europe/Paris">Paris (GMT+1/+2)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateFormat" className="text-foreground">Date Format</Label>
                    <Select value={dateFormat} onValueChange={setDateFormat}>
                      <SelectTrigger id="dateFormat" className="bg-surface border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator className="bg-muted" />

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-foreground">Compact View</p>
                    <p className="text-muted-foreground">Display more information in less space</p>
                  </div>
                  <Switch
                    checked={compactView}
                    onCheckedChange={setCompactView}
                  />
                </div>
              </div>
            </fieldset>
          </Card>

          {/* Analysis Settings Section */}
          <Card className="bg-card border-border">
            <fieldset disabled className="p-6 disabled:opacity-60" aria-describedby="preview-note">
              <div className="flex items-center gap-3 mb-6">
                <div>
                  <h2 className="text-foreground flex items-center gap-2">Analysis Settings <PreviewBadge /></h2>
                  <p className="text-muted-foreground">Configure diagnostic analysis parameters</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-foreground">Auto-save Patient Data</p>
                    <p className="text-muted-foreground">Automatically save changes as you work</p>
                  </div>
                  <Switch
                    checked={autoSave}
                    onCheckedChange={setAutoSave}
                  />
                </div>

                <Separator className="bg-muted" />

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="confidenceThreshold" className="text-foreground">Confidence Threshold</Label>
                    <Select value={confidenceThreshold} onValueChange={setConfidenceThreshold}>
                      <SelectTrigger id="confidenceThreshold" className="bg-surface border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="0.6">60% (Low)</SelectItem>
                        <SelectItem value="0.7">70% (Medium-Low)</SelectItem>
                        <SelectItem value="0.8">80% (Medium)</SelectItem>
                        <SelectItem value="0.9">90% (High)</SelectItem>
                        <SelectItem value="0.95">95% (Very High)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxCandidateGenes" className="text-foreground">Max Candidate Genes</Label>
                    <Select value={maxCandidateGenes} onValueChange={setMaxCandidateGenes}>
                      <SelectTrigger id="maxCandidateGenes" className="bg-surface border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="5">5 genes</SelectItem>
                        <SelectItem value="10">10 genes</SelectItem>
                        <SelectItem value="15">15 genes</SelectItem>
                        <SelectItem value="20">20 genes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </fieldset>
          </Card>
        </div>
      </div>
    </div>
  );
}
