import type { Metadata } from 'next';
import { connection } from 'next/server';
import { Source_Sans_3, Source_Code_Pro } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const sans = Source_Sans_3({ subsets: ['latin'], variable: '--font-source-sans', display: 'swap' });
const mono = Source_Code_Pro({ subsets: ['latin'], variable: '--font-source-code', display: 'swap' });

export const metadata: Metadata = {
    title: { default: 'Care4RareDiseases', template: '%s · Care4RareDiseases' },
    description: 'Rare disease diagnostic decision support for clinicians',
    robots: { index: false, follow: false },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    // Render per request so the CSP nonce set in proxy.ts is applied to every script.
    await connection();

    return (
        <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
