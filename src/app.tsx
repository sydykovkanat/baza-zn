import { Route, Routes } from 'react-router';

import { Home } from './pages';
import { Layout } from './shared/components/shared';

export function App() {
	return (
		<Layout>
			<Routes>
				<Route
					path='/'
					element={<Home />}
				/>
			</Routes>
		</Layout>
	);
}
