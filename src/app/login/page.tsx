'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/lib/store/hooks';
import { login } from '@/lib/store/slices/authSlice';
import { LoginScreen } from '@/components/auth';

/** Only allow same-site relative paths, so `?next=` cannot be used as an open redirect. */
function safeNext(next: string | null): string {
    return next && next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\') ? next : '/dashboard';
}

function LoginPageInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();

    const handleLogin = async (email: string, password: string) => {
        try {
            await dispatch(login({ email, password })).unwrap();
        } catch (error) {
            // Surface the server's message (invalid credentials, lockout) to the form.
            throw new Error(typeof error === 'string' ? error : 'Sign-in failed. Please try again.');
        }
        router.replace(safeNext(searchParams.get('next')));
    };

    return <LoginScreen onLoginSuccess={handleLogin} />;
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginPageInner />
        </Suspense>
    );
}
