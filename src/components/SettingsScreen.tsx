import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { User, Bell, Eye, Shield, Database, Palette, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

export function SettingsScreen() {
  const { doctor, logout } = useAuth();
  
  // User Profile
  const [fullName, setFullName] = useState(doctor?.name || '');
  const [email, setEmail] = useState(doctor?.email || '');
  const [role, setRole] = useState('geneticist');
  const [department, setDepartment] = useState(doctor?.specialty || 'Genetics');

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [analysisComplete, setAnalysisComplete] = useState(true);
  const [newPatientAssigned, setNewPatientAssigned] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  // Display Preferences
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('Africa/Accra');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [compactView, setCompactView] = useState(false);

  // Analysis Settings
  const [autoSave, setAutoSave] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState('0.8');
  const [maxCandidateGenes, setMaxCandidateGenes] = useState('10');

  // Privacy & Security
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [dataRetention, setDataRetention] = useState('5years');

  const handleSaveSettings = () => {
    console.log('Settings saved');
    toast.success('Settings saved successfully', {
      description: 'Your preferences have been updated.',
    });
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully', {
      description: 'You have been securely logged out.',
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Top Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Title */}
          <h1 className="text-slate-100">Settings</h1>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300 gap-2"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Logout
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 px-8"
              onClick={handleSaveSettings}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* User Profile Section */}
          <Card className="bg-card border-border">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <User size={20} className="text-purple-400" />
                </div>
                <div>
                  <h2>User Profile</h2>
                  <p className="text-slate-500">Manage your personal information</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-slate-200">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-[#2d1b4e] border-purple-900/20 text-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-200">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#2d1b4e] border-purple-900/20 text-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-slate-200">Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger id="role" className="bg-[#2d1b4e] border-purple-900/20 text-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a0f2e] border-purple-900/20">
                      <SelectItem value="geneticist">Geneticist</SelectItem>
                      <SelectItem value="physician">Physician</SelectItem>
                      <SelectItem value="researcher">Researcher</SelectItem>
                      <SelectItem value="counselor">Genetic Counselor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department" className="text-slate-200">Department</Label>
                  <Input
                    id="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="bg-[#2d1b4e] border-purple-900/20 text-slate-200"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Notifications Section */}
          <Card className="bg-card border-border">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Bell size={20} className="text-purple-400" />
                </div>
                <div>
                  <h2 className="text-slate-100">Notifications</h2>
                  <p className="text-slate-400">Configure how you receive updates</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-slate-900">Email Notifications</p>
                    <p className="text-slate-500">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-slate-900">Analysis Complete</p>
                    <p className="text-slate-500">Notify when patient analysis is complete</p>
                  </div>
                  <Switch
                    checked={analysisComplete}
                    onCheckedChange={setAnalysisComplete}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-slate-900">New Patient Assigned</p>
                    <p className="text-slate-500">Notify when a new patient is assigned to you</p>
                  </div>
                  <Switch
                    checked={newPatientAssigned}
                    onCheckedChange={setNewPatientAssigned}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-slate-900">Weekly Digest</p>
                    <p className="text-slate-500">Receive a weekly summary of your cases</p>
                  </div>
                  <Switch
                    checked={weeklyDigest}
                    onCheckedChange={setWeeklyDigest}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Display Preferences Section */}
          <Card className="bg-card border-border">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Eye size={20} className="text-purple-400" />
                </div>
                <div>
                  <h2 className="text-slate-100">Display Preferences</h2>
                  <p className="text-slate-400">Customize your viewing experience</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-slate-200">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language" className="bg-[#2d1b4e] border-purple-900/20 text-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a0f2e] border-purple-900/20">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-slate-200">Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger id="timezone" className="bg-[#2d1b4e] border-purple-900/20 text-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a0f2e] border-purple-900/20">
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
                    <Label htmlFor="dateFormat" className="text-slate-200">Date Format</Label>
                    <Select value={dateFormat} onValueChange={setDateFormat}>
                      <SelectTrigger id="dateFormat" className="bg-[#2d1b4e] border-purple-900/20 text-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a0f2e] border-purple-900/20">
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator className="bg-purple-900/20" />

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-slate-100">Compact View</p>
                    <p className="text-slate-400">Display more information in less space</p>
                  </div>
                  <Switch
                    checked={compactView}
                    onCheckedChange={setCompactView}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Analysis Settings Section */}
          <Card className="bg-card border-border">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Database size={20} className="text-purple-400" />
                </div>
                <div>
                  <h2 className="text-slate-100">Analysis Settings</h2>
                  <p className="text-slate-400">Configure diagnostic analysis parameters</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-slate-100">Auto-save Patient Data</p>
                    <p className="text-slate-400">Automatically save changes as you work</p>
                  </div>
                  <Switch
                    checked={autoSave}
                    onCheckedChange={setAutoSave}
                  />
                </div>

                <Separator className="bg-purple-900/20" />

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="confidenceThreshold" className="text-slate-200">Confidence Threshold</Label>
                    <Select value={confidenceThreshold} onValueChange={setConfidenceThreshold}>
                      <SelectTrigger id="confidenceThreshold" className="bg-[#2d1b4e] border-purple-900/20 text-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a0f2e] border-purple-900/20">
                        <SelectItem value="0.6">60% (Low)</SelectItem>
                        <SelectItem value="0.7">70% (Medium-Low)</SelectItem>
                        <SelectItem value="0.8">80% (Medium)</SelectItem>
                        <SelectItem value="0.9">90% (High)</SelectItem>
                        <SelectItem value="0.95">95% (Very High)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxCandidateGenes" className="text-slate-200">Max Candidate Genes</Label>
                    <Select value={maxCandidateGenes} onValueChange={setMaxCandidateGenes}>
                      <SelectTrigger id="maxCandidateGenes" className="bg-[#2d1b4e] border-purple-900/20 text-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a0f2e] border-purple-900/20">
                        <SelectItem value="5">5 genes</SelectItem>
                        <SelectItem value="10">10 genes</SelectItem>
                        <SelectItem value="15">15 genes</SelectItem>
                        <SelectItem value="20">20 genes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Privacy & Security Section */}
          <Card className="bg-card border-border">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Shield size={20} className="text-purple-400" />
                </div>
                <div>
                  <h2 className="text-slate-100">Privacy & Security</h2>
                  <p className="text-slate-400">Manage your security preferences</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-slate-100">Two-Factor Authentication</p>
                    <p className="text-slate-400">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={twoFactorAuth}
                    onCheckedChange={setTwoFactorAuth}
                  />
                </div>

                <Separator className="bg-purple-900/20" />

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout" className="text-slate-200">Session Timeout (minutes)</Label>
                    <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                      <SelectTrigger id="sessionTimeout" className="bg-[#2d1b4e] border-purple-900/20 text-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a0f2e] border-purple-900/20">
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataRetention" className="text-slate-200">Data Retention Period</Label>
                    <Select value={dataRetention} onValueChange={setDataRetention}>
                      <SelectTrigger id="dataRetention" className="bg-[#2d1b4e] border-purple-900/20 text-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a0f2e] border-purple-900/20">
                        <SelectItem value="1year">1 year</SelectItem>
                        <SelectItem value="3years">3 years</SelectItem>
                        <SelectItem value="5years">5 years</SelectItem>
                        <SelectItem value="10years">10 years</SelectItem>
                        <SelectItem value="indefinite">Indefinite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator className="bg-purple-900/20" />

                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start border-purple-900/20 text-slate-200 hover:bg-purple-900/30 hover:text-slate-100">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-purple-900/20 text-slate-200 hover:bg-purple-900/30 hover:text-slate-100">
                    Download My Data
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-card border-red-500/30">
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-red-400">Danger Zone</h2>
                <p className="text-slate-400">Irreversible actions</p>
              </div>

              <Separator className="mb-6 bg-red-500/20" />

              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start text-red-400 border-red-500/30 hover:bg-red-500/10 hover:text-red-300">
                  Clear All Cache Data
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-400 border-red-500/30 hover:bg-red-500/10 hover:text-red-300">
                  Deactivate Account
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
