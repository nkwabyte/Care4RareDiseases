import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { PATIENTS } from '../data/patientData';

export function useAssignedPatients() {
  const { session } = useAuth();
  const [assignedPatientIds, setAssignedPatientIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      setAssignedPatientIds([]);
      setIsLoading(false);
      return;
    }

    const fetchAssignedPatients = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-fbf76271/patients`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch assigned patients');
        }

        const data = await response.json();
        
        // Extract patient IDs from the response
        const patientIds = data.patients?.map((p: any) => p.id) || [];
        setAssignedPatientIds(patientIds);
        setError(null);
      } catch (err) {
        console.error('Error fetching assigned patients:', err);
        setError('Failed to load assigned patients');
        // Fallback: show all patients if fetch fails (for demo purposes)
        setAssignedPatientIds(Object.keys(PATIENTS));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignedPatients();
  }, [session]);

  // Filter PATIENTS data to only include assigned patients
  const assignedPatients = assignedPatientIds.reduce((acc, id) => {
    if (PATIENTS[id]) {
      acc[id] = PATIENTS[id];
    }
    return acc;
  }, {} as typeof PATIENTS);

  return {
    assignedPatientIds,
    assignedPatients,
    isLoading,
    error,
  };
}
