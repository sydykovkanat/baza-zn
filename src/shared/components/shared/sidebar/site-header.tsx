import { useLocation } from 'react-router';

import { Button, Separator, SidebarTrigger } from '@/shared/components/ui';
import { pagesUtils } from '@/shared/configs';

export function SiteHeader() {
	const location = useLocation();
	const currentPage = pagesUtils.findPageByUrl(location.pathname);

	const getPageTitle = () => {
		if (location.pathname.startsWith('/settings')) {
			if (location.pathname === '/settings') {
				const settingsPages = pagesUtils.getPagesByCategory('settings');
				return settingsPages[0]?.title || 'Настройки';
			}
			const settingsPage = pagesUtils
				.getPagesByCategory('settings')
				.find((page) => page.url === location.pathname);
			return settingsPage?.title || 'Настройки';
		}

		return currentPage?.title || 'Страница не найдена';
	};

	return (
		<header className='flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
			<div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6'>
				<SidebarTrigger className='-ml-1' />
				<Separator
					orientation='vertical'
					className='mx-2 data-[orientation=vertical]:h-4'
				/>
				<h1 className='text-base font-medium'>{getPageTitle()}</h1>
				<div className='ml-auto flex items-center gap-2'>
					<Button
						variant='ghost'
						asChild
						size='sm'
						className='hidden sm:flex'
					>
						<a
							href='https://github.com/sydykovkanat'
							rel='noopener noreferrer'
							target='_blank'
							className='dark:text-foreground'
						>
							GitHub
						</a>
					</Button>
				</div>
			</div>
		</header>
	);
}
