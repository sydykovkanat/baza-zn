'use client';

import {
	CameraIcon,
	ChartBarIcon,
	DatabaseIcon,
	FileIcon,
	FilesIcon,
	FolderIcon,
	HelpCircleIcon,
	HelpingHandIcon,
	HexagonIcon,
	LayoutDashboardIcon,
	ListIcon,
	SearchIcon,
	SettingsIcon,
	UsersIcon,
} from 'lucide-react';
import * as React from 'react';

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/shared/components/ui';

import { NavDocuments } from './nav-documents';
import { NavMain } from './nav-main';
import { NavSecondary } from './nav-secondary';
import { NavUser } from './nav-user';

const data = {
	user: {
		name: 'shadcn',
		email: 'm@example.com',
		avatar: '/avatars/shadcn.jpg',
	},
	navMain: [
		{
			title: 'Dashboard',
			url: '#',
			icon: LayoutDashboardIcon,
		},
		{
			title: 'Lifecycle',
			url: '#',
			icon: ListIcon,
		},
		{
			title: 'Analytics',
			url: '#',
			icon: ChartBarIcon,
		},
		{
			title: 'Projects',
			url: '#',
			icon: FolderIcon,
		},
		{
			title: 'Team',
			url: '#',
			icon: UsersIcon,
		},
	],
	navClouds: [
		{
			title: 'Capture',
			icon: CameraIcon,
			isActive: true,
			url: '#',
			items: [
				{
					title: 'Active Proposals',
					url: '#',
				},
				{
					title: 'Archived',
					url: '#',
				},
			],
		},
		{
			title: 'Proposal',
			icon: FileIcon,
			url: '#',
			items: [
				{
					title: 'Active Proposals',
					url: '#',
				},
				{
					title: 'Archived',
					url: '#',
				},
			],
		},
		{
			title: 'Prompts',
			icon: FilesIcon,
			url: '#',
			items: [
				{
					title: 'Active Proposals',
					url: '#',
				},
				{
					title: 'Archived',
					url: '#',
				},
			],
		},
	],
	navSecondary: [
		{
			title: 'Settings',
			url: '#',
			icon: SettingsIcon,
		},
		{
			title: 'Get Help',
			url: '#',
			icon: HelpCircleIcon,
		},
		{
			title: 'Search',
			url: '#',
			icon: SearchIcon,
		},
	],
	documents: [
		{
			name: 'Data Library',
			url: '#',
			icon: DatabaseIcon,
		},
		{
			name: 'Reports',
			url: '#',
			icon: HelpingHandIcon,
		},
		{
			name: 'Word Assistant',
			url: '#',
			icon: FileIcon,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar
			collapsible='offcanvas'
			{...props}
		>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className='data-[slot=sidebar-menu-button]:!p-1.5'
						>
							<a href='#'>
								<HexagonIcon className='!size-5' />
								<span className='text-base font-semibold'>Acme Inc.</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavDocuments items={data.documents} />
				<NavSecondary
					items={data.navSecondary}
					className='mt-auto'
				/>
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
