import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Activity,
  Users,
  FileText,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  BarChart3,
  ArrowUpRight,
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from './ui/chart';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { useAssignedPatients } from '../hooks/useAssignedPatients';
import { DATABASE_PATIENTS } from '../data/databaseData';
import { REPORTS } from '../data/reportsData';

interface DashboardScreenProps {
  onNavigateToPatients?: () => void;
}

export function DashboardScreen({ onNavigateToPatients }: DashboardScreenProps) {
  const { doctor } = useAuth();
  const { assignedPatientIds } = useAssignedPatients();

  // Calculate metrics based on assigned patients
  const assignedPatientsData = DATABASE_PATIENTS.filter(p => 
    assignedPatientIds.includes(p.patientId)
  );

  const pendingAnalysisCount = assignedPatientsData.filter(p => 
    p.status === 'Pending Analysis'
  ).length;

  const resultsReadyCount = assignedPatientsData.filter(p => 
    p.status === 'Results Ready'
  ).length;

  const reviewedCount = assignedPatientsData.filter(p => 
    p.status === 'Reviewed'
  ).length;

  // Get reports for assigned patients (this month)
  const assignedReportsThisMonth = REPORTS.filter(r => {
    const isAssigned = assignedPatientIds.includes(r.patientId);
    const reportDate = new Date(r.dateGenerated);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return isAssigned && reportDate.getMonth() === currentMonth && reportDate.getFullYear() === currentYear;
  }).length;
  // Mock data for charts
  const monthlyDiagnosesData = [
    { month: 'Apr', diagnosed: 12, pending: 8 },
    { month: 'May', diagnosed: 15, pending: 6 },
    { month: 'Jun', diagnosed: 18, pending: 10 },
    { month: 'Jul', diagnosed: 14, pending: 7 },
    { month: 'Aug', diagnosed: 20, pending: 9 },
    { month: 'Sep', diagnosed: 22, pending: 5 },
    { month: 'Oct', diagnosed: 19, pending: 11 },
  ];

  const diseaseDistributionData = [
    { category: 'Metabolic', count: 45 },
    { category: 'Neurological', count: 38 },
    { category: 'Immunological', count: 22 },
    { category: 'Cardiovascular', count: 18 },
    { category: 'Other', count: 12 },
  ];

  // Recent activity filtered to assigned patients only
  const allActivity = [
    {
      id: 1,
      type: 'analysis_complete',
      patient: 'UDN-P4',
      message: 'Analysis completed for patient UDN-P4',
      time: '2 hours ago',
      status: 'success',
    },
    {
      id: 2,
      type: 'alert',
      patient: 'UDN-P12',
      message: 'High-confidence variant detected in UDN-P12',
      time: '6 hours ago',
      status: 'warning',
    },
    {
      id: 3,
      type: 'report',
      patient: 'UDN-P7',
      message: 'Report generated for patient UDN-P7',
      time: '1 day ago',
      status: 'success',
    },
    {
      id: 4,
      type: 'new_patient',
      patient: 'UDN-P18',
      message: 'New patient UDN-P18 assigned to you',
      time: '2 days ago',
      status: 'info',
    },
  ];

  const recentActivity = allActivity.filter(activity => 
    assignedPatientIds.includes(activity.patient)
  );

  // Get pending cases from assigned patients with priority
  const pendingCases = assignedPatientsData
    .filter(p => p.status === 'Pending Analysis' || p.status === 'Results Ready')
    .map(p => {
      const daysWaiting = Math.floor(
        (new Date().getTime() - new Date(p.lastUpdated).getTime()) / (1000 * 60 * 60 * 24)
      );
      // Assign priority based on days waiting
      let priority: 'High' | 'Medium' | 'Low' = 'Low';
      if (daysWaiting >= 5) priority = 'High';
      else if (daysWaiting >= 2) priority = 'Medium';
      
      return {
        patientId: p.patientId,
        age: p.age,
        status: p.status,
        priority,
        daysWaiting,
      };
    })
    .sort((a, b) => b.daysWaiting - a.daysWaiting); // Sort by days waiting (descending)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500/20 text-red-300 hover:bg-red-500/20';
      case 'Medium':
        return 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/20';
      case 'Low':
        return 'bg-slate-500/20 text-slate-300 hover:bg-slate-500/20';
      default:
        return 'bg-slate-500/20 text-slate-400 hover:bg-slate-500/20';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'analysis_complete':
        return <CheckCircle size={16} className="text-purple-400" />;
      case 'new_patient':
        return <Users size={16} className="text-cyan-400" />;
      case 'alert':
        return <AlertCircle size={16} className="text-amber-400" />;
      case 'report':
        return <FileText size={16} className="text-slate-400" />;
      default:
        return <Activity size={16} className="text-slate-400" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Top Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-slate-100">Dashboard</h1>
            <p className="text-slate-400">Welcome back, {doctor?.name || 'Doctor'}</p>
          </div>
          <div className="text-slate-400">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-4 gap-6">
            {/* Total Patients */}
            <Card className="bg-card border-border">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Users size={24} className="text-purple-400" />
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/20">
                    Active
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-500">Total Patients</p>
                  <h2>{assignedPatientIds.length}</h2>
                </div>
              </div>
            </Card>

            {/* Pending Analysis */}
            <Card className="bg-card border-border">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                    <Clock size={24} className="text-amber-400" />
                  </div>
                  <Badge className="bg-amber-500/20 text-amber-300 hover:bg-amber-500/20">
                    {pendingAnalysisCount} {pendingAnalysisCount === 1 ? 'case' : 'cases'}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-400">Pending Analysis</p>
                  <h2 className="text-slate-100">{pendingAnalysisCount}</h2>
                </div>
              </div>
            </Card>

            {/* Reports This Month */}
            <Card className="bg-card border-border">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <FileText size={24} className="text-cyan-400" />
                  </div>
                  <Badge className="bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20">
                    Reports
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-400">This Month</p>
                  <h2 className="text-slate-100">{assignedReportsThisMonth}</h2>
                </div>
              </div>
            </Card>

            {/* Results Ready */}
            <Card className="bg-card border-border">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle size={24} className="text-green-400" />
                  </div>
                  <Badge className="bg-green-500/20 text-green-300 hover:bg-green-500/20">
                    Ready
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-400">Results Ready</p>
                  <h2 className="text-slate-100">{resultsReadyCount}</h2>
                </div>
              </div>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-3 gap-6">
            {/* Monthly Diagnoses Trend */}
            <Card className="bg-card border-border col-span-2">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-slate-100">Diagnosis Activity</h2>
                    <p className="text-slate-400">Monthly trends and pending cases</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={monthlyDiagnosesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d1b4e" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a0f2e',
                        border: '1px solid #581c87',
                        borderRadius: '8px',
                        color: '#e5e5e7',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="diagnosed" fill="#a855f7" name="Diagnosed" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pending" fill="#f59e0b" name="Pending" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Disease Distribution */}
            <Card className="bg-card border-border">
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-slate-100">Disease Categories</h2>
                  <p className="text-slate-400">Distribution by type</p>
                </div>
                <div className="space-y-4">
                  {diseaseDistributionData.map((item) => (
                    <div key={item.category}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-300">{item.category}</span>
                        <span className="text-slate-100">{item.count}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${(item.count / 135) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Pending Cases and Recent Activity Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Pending Cases */}
            <Card className="bg-card border-border">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-slate-100">Pending Cases</h2>
                    <p className="text-slate-400">Cases requiring attention</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onNavigateToPatients}
                    className="text-purple-400 border-purple-700 hover:bg-purple-900/30"
                  >
                    View All
                    <ArrowUpRight size={16} className="ml-2" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {pendingCases.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <CheckCircle size={32} className="mx-auto mb-2 text-green-400" />
                      <p>No pending cases</p>
                      <p className="text-sm">All patients up to date</p>
                    </div>
                  ) : (
                    pendingCases.map((case_) => (
                      <div
                        key={case_.patientId}
                        className="flex items-center justify-between p-3 bg-[#2d1b4e] rounded-lg hover:bg-purple-900/30 transition-colors cursor-pointer"
                        onClick={onNavigateToPatients}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <Users size={18} className="text-purple-400" />
                          </div>
                          <div>
                            <p className="text-slate-100">{case_.patientId}</p>
                            <p className="text-slate-400">Age: {case_.age} • {case_.daysWaiting} days waiting</p>
                          </div>
                        </div>
                        <Badge className={getPriorityColor(case_.priority)}>
                          {case_.priority}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-card border-border">
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-slate-100">Recent Activity</h2>
                  <p className="text-slate-400">Latest updates and notifications</p>
                </div>
                <div className="space-y-4">
                  {recentActivity.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <Activity size={32} className="mx-auto mb-2" />
                      <p>No recent activity</p>
                    </div>
                  ) : (
                    recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#2d1b4e] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-200">{activity.message}</p>
                          <p className="text-slate-400">{activity.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-card border-border">
            <div className="p-6">
              <h2 className="mb-6 text-slate-100">Quick Actions</h2>
              <div className="grid grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center gap-2 hover:bg-purple-900/30 hover:border-purple-700 text-slate-200"
                  onClick={onNavigateToPatients}
                >
                  <Users size={24} className="text-purple-400" />
                  <span>New Patient</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center gap-2 hover:bg-purple-900/30 hover:border-purple-700 text-slate-200"
                >
                  <Activity size={24} className="text-purple-400" />
                  <span>Run Analysis</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center gap-2 hover:bg-purple-900/30 hover:border-purple-700 text-slate-200"
                >
                  <FileText size={24} className="text-purple-400" />
                  <span>Generate Report</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center gap-2 hover:bg-purple-900/30 hover:border-purple-700 text-slate-200"
                >
                  <BarChart3 size={24} className="text-purple-400" />
                  <span>View Analytics</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
