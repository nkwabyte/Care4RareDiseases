'use client';

import { Sidebar } from '@/components/Sidebar';
import { DatabaseScreen } from '@/components/DatabaseScreen';
import { useAppDispatch } from '@/lib/store/hooks';
import { setActiveScreen } from '@/lib/store/slices/uiSlice';
import { setSelectedPatient } from '@/lib/store/slices/patientSlice';
import { useRouter } from 'next/navigation';

export default function DatabasePage() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handlePatientClick = (patientId: string) => {
        dispatch(setSelectedPatient(patientId));
        dispatch(setActiveScreen('patients'));
        router.push('/patients');
    };

    return (
        <>
            <Sidebar
                activeItem="database"
                onItemClick={(itemId) => {
                    dispatch(setActiveScreen(itemId as any));
                    router.push(`/${itemId}`);
                }}
            />
            <DatabaseScreen onPatientClick={handlePatientClick} />
        </>
    );
}
