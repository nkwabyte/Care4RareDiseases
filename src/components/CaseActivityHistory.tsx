import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { FileText, Download, Eye, Play, UserPlus, LucideIcon } from 'lucide-react';

export interface Activity {
  id: number;
  timestamp: string;
  description: string;
  icon: LucideIcon;
  color: 'purple' | 'slate';
}

interface CaseActivityHistoryProps {
  activities?: Activity[];
}

export function CaseActivityHistory({ activities: propActivities }: CaseActivityHistoryProps) {
  const defaultActivities: Activity[] = [
    {
      id: 1,
      timestamp: 'Today, 10:15 AM',
      description: 'Dr. K. Mensah added a new clinical note.',
      icon: FileText,
      color: 'purple',
    },
    {
      id: 2,
      timestamp: 'Yesterday, 4:30 PM',
      description: 'Report downloaded.',
      icon: Download,
      color: 'slate',
    },
    {
      id: 3,
      timestamp: 'Yesterday, 4:28 PM',
      description: 'Analysis results viewed.',
      icon: Eye,
      color: 'slate',
    },
    {
      id: 4,
      timestamp: '2 days ago, 9:05 AM',
      description: 'Analysis run successfully.',
      icon: Play,
      color: 'slate',
    },
    {
      id: 5,
      timestamp: '2 days ago, 9:00 AM',
      description: 'Patient case created.',
      icon: UserPlus,
      color: 'slate',
    },
  ];

  const activities = propActivities || defaultActivities;

  return (
    <Card className="p-5 bg-card border-border h-full flex flex-col">
      <h3 className="mb-4 text-slate-100">Case Activity & History</h3>
      
      <ScrollArea className="flex-1">
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            const isFirst = index === 0;
            
            return (
              <div key={activity.id} className="flex gap-3">
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isFirst 
                      ? 'bg-purple-500/20' 
                      : 'bg-slate-700'
                  }`}>
                    <Icon 
                      size={14} 
                      className={isFirst ? 'text-purple-400' : 'text-slate-400'} 
                    />
                  </div>
                  {index < activities.length - 1 && (
                    <div className="w-0.5 h-full min-h-8 bg-purple-900/20 mt-1"></div>
                  )}
                </div>
                
                {/* Activity Content */}
                <div className="flex-1 pb-2">
                  <p className="text-slate-400 mb-1">{activity.timestamp}</p>
                  <p className={isFirst ? 'text-slate-100' : 'text-slate-300'}>
                    {activity.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}
