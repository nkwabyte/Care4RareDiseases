'use client';

import { useRouter } from 'next/navigation';
import { DashboardScreen } from '@/components/screens';
import { Sidebar } from '@/components/layout';
import { useAppDispatch } from '@/lib/store/hooks';
import { setSelectedPatient } from '@/lib/store/slices/patientSlice';

export default function DashboardPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    return (
        <>
            <Sidebar />
            <DashboardScreen
                onOpenPatient={(patientId) => {
                    dispatch(setSelectedPatient(patientId));
                    router.push('/patients');
                }}
            />
        </>
    );
}
