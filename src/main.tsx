import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app';
import { Providers } from './shared/providers';
import './shared/styles/globals.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Providers>
			<App />
		</Providers>
	</StrictMode>,
);
