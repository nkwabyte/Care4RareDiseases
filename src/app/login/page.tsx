'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/store/hooks';
import { login } from '@/lib/store/slices/authSlice';
import { LoginScreen } from '@/components/LoginScreen';

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleLoginSuccess = async (email: string, password: string) => {
        try {
            const result = await dispatch(login({ email, password })).unwrap();
            router.push('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
}
