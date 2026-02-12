'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <title>Care4RareDiseases</title>
                <meta name="description" content="Rare Disease Diagnosis Platform" />
            </head>
            <body>
                <Provider store={store}>
                    {children}
                    <Toaster />
                </Provider>
            </body>
        </html>
    );
}
