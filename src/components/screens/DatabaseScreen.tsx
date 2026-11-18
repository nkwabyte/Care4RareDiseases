import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { useAssignedPatients } from '@/hooks/useAssignedPatients';

interface DatabaseScreenProps {
  onPatientClick?: (patientId: string) => void;
}

export function DatabaseScreen({ onPatientClick }: DatabaseScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const { assignedPatientIds, isLoading: isLoadingAssigned } = useAssignedPatients();
  const dispatch = useAppDispatch();
  const { patients, isLoading: isLoadingDatabase } = useAppSelector((state) => state.database);

  useEffect(() => {
    dispatch(fetchAllPatients());
  }, [dispatch]);

  const isLoading = isLoadingAssigned || isLoadingDatabase;

  const getStatusColor = (status: DatabasePatient['status']) => {
    switch (status) {
      case 'Pending Analysis':
        return 'bg-warning-soft text-warning hover:bg-warning-soft';
      case 'Results Ready':
        return 'bg-muted text-primary hover:bg-muted';
      case 'Reviewed':
        return 'bg-muted text-body hover:bg-muted';
      default:
        return 'bg-muted text-muted-foreground hover:bg-muted';
    }
  };

  const patientsWithCurrentDoctor = patients.map((patient: any) => ({
    ...patient,
    patientId: patient.id || patient.patientId,
    assignedClinician: patient.assignedClinician || 'Unassigned'
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
          <div>
            <h1 className="text-2xl font-bold tracking-[-0.01em] text-foreground">Patient Database</h1>
            <p className="text-muted-foreground">Every case you can access, with status and clinician</p>
          </div>

          {/* Right: Filters and Search */}
          <div className="flex items-center gap-3">
            {/* Filter by Status */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-56 bg-surface border-border text-foreground">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending Analysis">Pending Analysis</SelectItem>
                <SelectItem value="Results Ready">Results Ready</SelectItem>
                <SelectItem value="Reviewed">Reviewed</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort by Last Updated */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-56 bg-surface border-border text-foreground">
                <SelectValue placeholder="Sort by Last Updated" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>

            {/* Search Patients */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="text"
                placeholder="Search Patients"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-surface border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <Card className="bg-card border-border">
          <div className="p-6">
            <h2 className="mb-6 text-foreground">All Patients</h2>

            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-body">Patient ID</TableHead>
                  <TableHead className="text-body">Age</TableHead>
                  <TableHead className="text-body">Sex</TableHead>
                  <TableHead className="text-body">Status</TableHead>
                  <TableHead className="text-body">Last Updated</TableHead>
                  <TableHead className="text-body">Assigned Clinician</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Loading skeleton
                  Array.from({ length: 6 }).map((_, index) => (
                    <TableRow key={index} className="border-border">
                      <TableCell>
                        <Skeleton className="h-4 w-20 bg-muted" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-8 bg-muted" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-12 bg-muted" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-28 bg-muted" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24 bg-muted" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32 bg-muted" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredAndSortedPatients.length === 0 ? (
                  <TableRow className="border-border hover:bg-muted">
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No patients found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedPatients.map((patient) => (
                    <TableRow
                      key={patient.patientId}
                      className="cursor-pointer hover:bg-muted transition-colors border-border"
                      onClick={() => onPatientClick?.(patient.patientId)}
                    >
                      <TableCell className="text-primary">
                        {patient.patientId}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {patient.age}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {patient.sex}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(patient.status)}>
                          {patient.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-body">
                        {new Date(patient.lastUpdated).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="text-body">
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
