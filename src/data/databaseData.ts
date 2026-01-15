export interface DatabasePatient {
  patientId: string;
  age: number;
  sex: string;
  status: 'Pending Analysis' | 'Results Ready' | 'Reviewed';
  lastUpdated: string;
  assignedClinician: string;
}

export const DATABASE_PATIENTS: DatabasePatient[] = [
  {
    patientId: 'UDN-P4',
    age: 8,
    sex: 'Female',
    status: 'Results Ready',
    lastUpdated: '2025-11-01',
    assignedClinician: 'Dr. Ama Asante',
  },
  {
    patientId: 'UDN-P7',
    age: 12,
    sex: 'Male',
    status: 'Reviewed',
    lastUpdated: '2025-11-02',
    assignedClinician: 'Dr. Kwame Mensah',
  },
  {
    patientId: 'UDN-P12',
    age: 5,
    sex: 'Female',
    status: 'Pending Analysis',
    lastUpdated: '2025-10-29',
    assignedClinician: 'Dr. Ama Asante',
  },
  {
    patientId: 'UDN-P15',
    age: 15,
    sex: 'Male',
    status: 'Results Ready',
    lastUpdated: '2025-10-20',
    assignedClinician: 'Dr. Abena Osei',
  },
  {
    patientId: 'UDN-P18',
    age: 10,
    sex: 'Female',
    status: 'Pending Analysis',
    lastUpdated: '2025-10-26',
    assignedClinician: 'Dr. Kwame Mensah',
  },
  {
    patientId: 'UDN-P21',
    age: 7,
    sex: 'Male',
    status: 'Reviewed',
    lastUpdated: '2025-10-15',
    assignedClinician: 'Dr. Abena Osei',
  },
];
