import { useEffect } from 'react';
import { Route, Routes } from 'react-router';

import { Layout } from './shared/components/shared';
import { pagesUtils } from './shared/configs';
import { SettingsLayout } from './shared/layouts';
import { useAccessStore } from './stores';

export function App() {
	const getAccess = useAccessStore((state) => state.getAccess);
	const globalPages = pagesUtils.getPagesByCategory('global');
	const settingsPages = pagesUtils.getPagesByCategory('settings');

	useEffect(() => {
		getAccess();
	}, [getAccess]);

	return (
		<Layout>
			<Routes>
				{globalPages.map((page) => (
					<Route
						key={page.url}
						path={page.url}
						element={page.component}
					/>
				))}

				<Route
					path='/settings'
					element={<SettingsLayout />}
				>
					{settingsPages.map((page) => {
						const relativePath = page.url.replace('/settings/', '');
						return (
							<Route
								key={page.url}
								path={relativePath}
								element={page.component}
							/>
						);
					})}
					<Route
						index
						element={settingsPages[0]?.component}
					/>
				</Route>
			</Routes>
		</Layout>
	);
}
