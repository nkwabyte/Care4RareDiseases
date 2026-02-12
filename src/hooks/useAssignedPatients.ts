import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchAssignedPatients } from '@/lib/store/slices/patientSlice';

export function useAssignedPatients() {
    const dispatch = useAppDispatch();
    const { assignedPatientIds, isLoading, error } = useAppSelector((state) => state.patient);

    useEffect(() => {
        dispatch(fetchAssignedPatients());
    }, [dispatch]);

    return { assignedPatientIds, isLoading, error };
}
