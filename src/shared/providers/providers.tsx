import type { PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router';

import { KeycloakProvider } from '@/shared/providers';

import { Toaster } from '../components/ui';

export function Providers({ children }: PropsWithChildren) {
	return (
		<BrowserRouter>
			<Toaster />
			<KeycloakProvider>{children}</KeycloakProvider>
		</BrowserRouter>
	);
}
