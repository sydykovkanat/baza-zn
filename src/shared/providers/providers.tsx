import type { PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router';

import { KeycloakProvider, TanstackQueryProvider } from '@/shared/providers';

import { Toaster } from '../components/ui';

export function Providers({ children }: PropsWithChildren) {
	return (
		<BrowserRouter>
			<TanstackQueryProvider>
				<Toaster />
				<KeycloakProvider>{children}</KeycloakProvider>
			</TanstackQueryProvider>
		</BrowserRouter>
	);
}
