import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchAllPatients } from '@/lib/store/slices/databaseSlice';
import { useEffect } from 'react';

// Define interface locally or import from schema/types if available
interface DatabasePatient {
  patientId: string;
  age: number;
  sex: string;
  status: 'Pending Analysis' | 'Results Ready' | 'Reviewed';
  lastUpdated: string;
  assignedClinician: string;
}
import { useAssignedPatients } from '../hooks/useAssignedPatients';

interface DatabaseScreenProps {
  onPatientClick?: (patientId: string) => void;
}

export function DatabaseScreen({ onPatientClick }: DatabaseScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const { assignedPatientIds, isLoading: isLoadingAssigned } = useAssignedPatients();
  const doctor = useAppSelector((state) => state.auth.doctor);
  const dispatch = useAppDispatch();
  const { patients, isLoading: isLoadingDatabase } = useAppSelector((state) => state.database);

  useEffect(() => {
    dispatch(fetchAllPatients());
  }, [dispatch]);

  const isLoading = isLoadingAssigned || isLoadingDatabase;

  const getStatusColor = (status: DatabasePatient['status']) => {
    switch (status) {
      case 'Pending Analysis':
        return 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/20';
      case 'Results Ready':
        return 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/20';
      case 'Reviewed':
        return 'bg-slate-500/20 text-slate-300 hover:bg-slate-500/20';
      default:
        return 'bg-slate-500/20 text-slate-400 hover:bg-slate-500/20';
    }
  };

  // Map patients to show current doctor's name
  const patientsWithCurrentDoctor = patients.map((patient: any) => ({
    ...patient,
    patientId: patient.id || patient.patientId,
    assignedClinician: doctor?.name || patient.assignedClinician || 'Unassigned'
  }));

  const filteredAndSortedPatients = patientsWithCurrentDoctor.filter((patient) => {
    // Only show assigned patients
    const isAssignedPatient = assignedPatientIds.includes(patient.patientId);

    // safe string check helper
    const safeLower = (str: any) => (str || '').toString().toLowerCase();

    const matchesSearch =
      safeLower(patient.patientId).includes(searchQuery.toLowerCase()) ||
      safeLower(patient.assignedClinician).includes(searchQuery.toLowerCase()) ||
      safeLower(patient.sex).includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || patient.status === statusFilter;

    return isAssignedPatient && matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
    } else if (sortBy === 'oldest') {
      return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
    }
    return 0;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Top Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Title */}
          <h1 className="text-slate-100">Patient Database</h1>

          {/* Right: Filters and Search */}
          <div className="flex items-center gap-3">
            {/* Filter by Status */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-56 bg-[#2d1b4e] border-purple-900/20 text-slate-200">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a0f2e] border-purple-900/20">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending Analysis">Pending Analysis</SelectItem>
                <SelectItem value="Results Ready">Results Ready</SelectItem>
                <SelectItem value="Reviewed">Reviewed</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort by Last Updated */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-56 bg-[#2d1b4e] border-purple-900/20 text-slate-200">
                <SelectValue placeholder="Sort by Last Updated" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a0f2e] border-purple-900/20">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>

            {/* Search Patients */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              />
              <Input
                type="text"
                placeholder="Search Patients"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-[#2d1b4e] border-purple-900/20 text-slate-200 placeholder:text-slate-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <Card className="bg-card border-border">
          <div className="p-6">
            <h2 className="mb-6 text-slate-100">All Patients</h2>

            <Table>
              <TableHeader>
                <TableRow className="border-purple-900/20 hover:bg-transparent">
                  <TableHead className="text-slate-300">Patient ID</TableHead>
                  <TableHead className="text-slate-300">Age</TableHead>
                  <TableHead className="text-slate-300">Sex</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Last Updated</TableHead>
                  <TableHead className="text-slate-300">Assigned Clinician</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Loading skeleton
                  Array.from({ length: 6 }).map((_, index) => (
                    <TableRow key={index} className="border-purple-900/20">
                      <TableCell>
                        <Skeleton className="h-4 w-20 bg-purple-900/20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-8 bg-purple-900/20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-12 bg-purple-900/20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-28 bg-purple-900/20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24 bg-purple-900/20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32 bg-purple-900/20" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredAndSortedPatients.length === 0 ? (
                  <TableRow className="border-purple-900/20 hover:bg-purple-900/10">
                    <TableCell colSpan={6} className="text-center text-slate-400 py-8">
                      No patients found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedPatients.map((patient) => (
                    <TableRow
                      key={patient.patientId}
                      className="cursor-pointer hover:bg-purple-900/10 transition-colors border-purple-900/20"
                      onClick={() => onPatientClick?.(patient.patientId)}
                    >
                      <TableCell className="text-purple-400">
                        {patient.patientId}
                      </TableCell>
                      <TableCell className="text-slate-100">
                        {patient.age}
                      </TableCell>
                      <TableCell className="text-slate-100">
                        {patient.sex}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(patient.status)}>
                          {patient.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {new Date(patient.lastUpdated).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {patient.assignedClinician}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
