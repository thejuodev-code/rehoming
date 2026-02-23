'use client';

import { NavermapsProvider } from 'react-naver-maps';

export default function Providers({ children, clientId }: { children: React.ReactNode, clientId: string }) {
    return (
        <NavermapsProvider ncpClientId={clientId}>
            {children}
        </NavermapsProvider>
    );
}
