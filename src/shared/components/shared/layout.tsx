import type { PropsWithChildren } from 'react';

import { SidebarInset, SidebarProvider } from '../ui';

import { AppSidebar, SiteHeader } from './sidebar';

export function Layout({ children }: PropsWithChildren) {
	return (
		<SidebarProvider
			style={
				{
					'--sidebar-width': 'calc(var(--spacing) * 72)',
					'--header-height': 'calc(var(--spacing) * 12)',
				} as React.CSSProperties
			}
		>
			<AppSidebar variant='inset' />
			<SidebarInset>
				<SiteHeader />
				<div className='flex flex-1 flex-col'>{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
