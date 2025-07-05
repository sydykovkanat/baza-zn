import {
	DatabaseIcon,
	FingerprintIcon,
	HomeIcon,
	LayoutDashboardIcon,
	type LucideIcon,
	Settings2Icon,
} from 'lucide-react';
import type { ReactNode } from 'react';

import { HomePage, InstancesPage, ModelsPage, ViewsPage } from '@/pages';

interface IPage {
	title: string;
	url: string;
	icon: LucideIcon;
	component?: ReactNode;
}

interface ICategory {
	title: string;
	icon: LucideIcon;
	pages: IPage[];
}

interface IPageWithCategory extends IPage {
	categoryKey: string;
	categoryTitle: string;
	categoryIcon: LucideIcon;
}

interface ICategoryInfo {
	key: string;
	title: string;
	icon: LucideIcon;
	pagesCount: number;
}

type PagesStructure = {
	[K in 'global' | 'settings']: ICategory;
};

export const PAGES: PagesStructure = {
	global: {
		title: 'Общее',
		icon: HomeIcon,
		pages: [
			{
				title: 'Главная',
				url: '/',
				icon: HomeIcon,
				component: <HomePage />,
			},
		],
	},
	settings: {
		title: 'Настройки',
		icon: Settings2Icon,
		pages: [
			{
				title: 'Модели',
				url: '/settings/models',
				icon: DatabaseIcon,
				component: <ModelsPage />,
			},
			{
				title: 'Экземпляры',
				url: '/settings/instances',
				icon: FingerprintIcon,
				component: <InstancesPage />,
			},
			{
				title: 'Представления',
				url: '/settings/views',
				icon: LayoutDashboardIcon,
				component: <ViewsPage />,
			},
		],
	},
} as const;

export const pagesUtils = {
	getAllPages: (): IPageWithCategory[] => {
		return Object.entries(PAGES).flatMap(([categoryKey, category]) =>
			category.pages.map((page) => ({
				...page,
				categoryKey,
				categoryTitle: category.title,
				categoryIcon: category.icon,
			})),
		);
	},

	getCategories: (): ICategoryInfo[] => {
		return Object.entries(PAGES).map(([key, category]) => ({
			key,
			title: category.title,
			icon: category.icon,
			pagesCount: category.pages.length,
		}));
	},

	findPageByUrl: (url: string): IPageWithCategory | null => {
		for (const [categoryKey, category] of Object.entries(PAGES)) {
			const page = category.pages.find((p) => p.url === url);
			if (page) {
				return {
					...page,
					categoryKey,
					categoryTitle: category.title,
					categoryIcon: category.icon,
				};
			}
		}
		return null;
	},

	getPagesByCategory: (categoryKey: keyof PagesStructure): IPage[] => {
		return PAGES[categoryKey]?.pages || [];
	},

	getRelativePathForNestedRoute: (
		fullPath: string,
		parentPath: string,
	): string => {
		return fullPath.replace(parentPath, '').replace(/^\//, '') || '/';
	},
};
