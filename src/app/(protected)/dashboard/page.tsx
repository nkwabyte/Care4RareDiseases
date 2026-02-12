'use client';

import { DashboardScreen } from '@/components/DashboardScreen';
import { Sidebar } from '@/components/Sidebar';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setActiveScreen } from '@/lib/store/slices/uiSlice';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleNavigateToPatients = () => {
        dispatch(setActiveScreen('patients'));
        router.push('/patients');
    };

    return (
        <>
            <Sidebar
                activeItem="dashboard"
                onItemClick={(itemId) => {
                    dispatch(setActiveScreen(itemId as any));
                    router.push(`/${itemId}`);
                }}
            />
            <DashboardScreen onNavigateToPatients={handleNavigateToPatients} />
        </>
    );
}
