import { Outlet, useLocation, useNavigate } from 'react-router';

import { Button } from '../components/ui';
import { pagesUtils } from '../configs';

export function SettingsLayout() {
	const navigate = useNavigate();
	const location = useLocation();
	const settingsPages = pagesUtils.getPagesByCategory('settings');

	const handleTabClick = (url: string) => {
		navigate(url);
	};

	return (
		<div className='flex h-full flex-col'>
			<div className='mb-4'>
				<div className='flex items-center gap-4'>
					{settingsPages.map((page) => {
						const isActive =
							location.pathname === page.url ||
							(location.pathname === '/settings' &&
								page.url === settingsPages[0]?.url);

						return (
							<Button
								key={page.url}
								onClick={() => handleTabClick(page.url)}
								variant={isActive ? 'default' : 'ghost'}
							>
								<page.icon className='h-4 w-4' />
								<span>{page.title}</span>
							</Button>
						);
					})}
				</div>
			</div>

			<div className='flex-1 overflow-auto'>
				<Outlet />
			</div>
		</div>
	);
}
