'use client';

import { Sidebar } from '@/components/Sidebar';
import { SettingsScreen } from '@/components/SettingsScreen';
import { useAppDispatch } from '@/lib/store/hooks';
import { setActiveScreen } from '@/lib/store/slices/uiSlice';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    return (
        <>
            <Sidebar
                activeItem="settings"
                onItemClick={(itemId) => {
                    dispatch(setActiveScreen(itemId as any));
                    router.push(`/${itemId}`);
                }}
            />
            <SettingsScreen />
        </>
    );
}
