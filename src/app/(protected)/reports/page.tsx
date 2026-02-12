'use client';

import { Sidebar } from '@/components/Sidebar';
import { ReportsScreen } from '@/components/ReportsScreen';
import { useAppDispatch } from '@/lib/store/hooks';
import { setActiveScreen } from '@/lib/store/slices/uiSlice';
import { useRouter } from 'next/navigation';

export default function ReportsPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    return (
        <>
            <Sidebar
                activeItem="reports"
                onItemClick={(itemId) => {
                    dispatch(setActiveScreen(itemId as any));
                    router.push(`/${itemId}`);
                }}
            />
            <ReportsScreen />
        </>
    );
}
