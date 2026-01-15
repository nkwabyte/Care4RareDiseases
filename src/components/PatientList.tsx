import { useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { useAssignedPatients } from '../hooks/useAssignedPatients';

interface PatientListProps {
  selectedPatientId: string;
  onPatientSelect: (patientId: string) => void;
  onNewPatient?: () => void;
}

export function PatientList({ selectedPatientId, onPatientSelect, onNewPatient }: PatientListProps) {
  const { assignedPatientIds, isLoading } = useAssignedPatients();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter patient IDs based on search query
  const filteredPatientIds = useMemo(() => {
    if (!searchQuery.trim()) {
      return assignedPatientIds;
    }
    
    const query = searchQuery.toLowerCase();
    return assignedPatientIds.filter(patientId => 
      patientId.toLowerCase().includes(query)
    );
  }, [assignedPatientIds, searchQuery]);

  return (
    <div className="w-64 bg-[#1a0f2e] border-r border-purple-900/20 h-screen flex flex-col">
      <div className="p-4 border-b border-purple-900/20">
        <h2 className="mb-3 text-slate-200">Patients</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
          <Input 
            placeholder="Search patients..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-[#2d1b4e] border-purple-900/20 text-slate-200 placeholder:text-slate-500"
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="px-3 py-2.5 mb-1">
                <Skeleton className="h-5 w-full bg-purple-900/20" />
              </div>
            ))
          ) : filteredPatientIds.length === 0 ? (
            <div className="px-3 py-8 text-center text-slate-400 text-sm">
              {searchQuery ? 'No patients found' : 'No patients assigned'}
            </div>
          ) : (
            filteredPatientIds.map((patientId) => {
              const isSelected = patientId === selectedPatientId;
              
              return (
                <button
                  key={patientId}
                  onClick={() => onPatientSelect(patientId)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                    isSelected 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border border-purple-400/30' 
                      : 'text-slate-300 hover:bg-purple-900/30'
                  }`}
                >
                  <div>{patientId}</div>
                </button>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* New Patient Button - Fixed at bottom */}
      <div className="p-4 border-t border-purple-900/20">
        <Button 
          onClick={onNewPatient}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Plus size={16} className="mr-2" />
          New Patient
        </Button>
      </div>
    </div>
  );
}
