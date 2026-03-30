'use client';

import { Sidebar } from '@/components/Sidebar';
import { HelpScreen } from '@/components/HelpScreen';
import { useAppDispatch } from '@/lib/store/hooks';
import { setActiveScreen } from '@/lib/store/slices/uiSlice';
import { useRouter } from 'next/navigation';

export default function HelpPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    return (
        <>
            <Sidebar
                activeItem="help"
                onItemClick={(itemId) => {
                    dispatch(setActiveScreen(itemId as any));
                    router.push(`/${itemId}`);
                }}
            />
            <HelpScreen />
        </>
    );
}
