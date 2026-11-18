import type { Metadata } from 'next';
import { connection } from 'next/server';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
    title: { default: 'Care4RareDiseases', template: '%s · Care4RareDiseases' },
    description: 'Rare disease diagnostic decision support for clinicians',
    robots: { index: false, follow: false },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    // Render per request so the CSP nonce set in proxy.ts is applied to every script.
    await connection();

    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
