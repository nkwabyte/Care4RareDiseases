export interface Report {
  id: string;
  patientName: string;
  patientId: string;
  dateGenerated: string;
  generatedBy: string;
}

export const REPORTS: Report[] = [
  {
    id: 'RPT-2025-001',
    patientName: 'Akosua Addo',
    patientId: 'UDN-P4',
    dateGenerated: '2025-11-01',
    generatedBy: 'Dr. Ama Asante',
  },
  {
    id: 'RPT-2025-002',
    patientName: 'Kofi Owusu',
    patientId: 'UDN-P7',
    dateGenerated: '2025-11-02',
    generatedBy: 'Dr. Kwame Mensah',
  },
  {
    id: 'RPT-2025-003',
    patientName: 'Esi Bonsu',
    patientId: 'UDN-P12',
    dateGenerated: '2025-11-03',
    generatedBy: 'Dr. Ama Asante',
  },
  {
    id: 'RPT-2025-004',
    patientName: 'Kwabena Ansah',
    patientId: 'UDN-P15',
    dateGenerated: '2025-10-20',
    generatedBy: 'Dr. Abena Osei',
  },
];
