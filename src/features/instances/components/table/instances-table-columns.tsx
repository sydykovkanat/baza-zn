import type { ColumnDef } from '@tanstack/react-table';
import { Trash2Icon } from 'lucide-react';

import { Badge, Button } from '@/shared/components/ui';

import type { IInstance } from '../../types';

export const instancesTableColumns: ColumnDef<IInstance>[] = [
	{
		accessorKey: 'title',
		header: 'Название',
	},
	{
		accessorKey: 'value_localization',
		header: 'Языки',
		cell: ({ row }) => {
			const valueLocalization = row.original.value_localization;

			return (
				<div className='flex flex-wrap gap-2'>
					{valueLocalization.map((lang, index) => (
						<Badge
							key={index}
							variant={'secondary'}
							className='capitalize'
						>
							{lang}
						</Badge>
					))}
				</div>
			);
		},
	},
	{
		accessorKey: 'version',
		header: 'Версии',
		cell: ({ row }) => {
			const version = row.original.version;

			return (
				<Badge variant={'secondary'}>{version ? version : 'Нет версии'}</Badge>
			);
		},
	},
	{
		accessorKey: 'tags',
		header: 'Метки',
		cell: ({ row }) => {
			const isActive = row.original.is_active;
			const isLast = row.original.is_last;

			return (
				<div className='flex items-center gap-2'>
					<Badge variant={isActive ? 'default' : 'destructive'}>
						{isActive ? 'Активная' : 'Неактивная'}
					</Badge>

					{isLast && <Badge variant={'secondary'}>Последний</Badge>}
				</div>
			);
		},
	},
	{
		accessorKey: 'parent_model.title',
		header: 'Родительская модель',
		cell: ({ row }) => {
			const parentModel = row.original.parent_model;

			return (
				<Badge variant={!parentModel ? 'default' : 'secondary'}>
					{!parentModel ? 'Родитель' : parentModel?.title || 'Нет'}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'parent_instance',
		header: 'Родительский экземпляр',
		cell: ({ row }) => {
			const parentInstance = row.original.parent_instance;
			const isParent = parentInstance?.id === row.original._id;

			return (
				<Badge variant={isParent ? 'default' : 'secondary'}>
					{isParent ? 'Родитель' : parentInstance?.title || 'Нет'}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'previous_instance',
		header: 'Предыдущий экземпляр',
		cell: ({ row }) => {
			const previousInstance = row.original.previous_instance;

			return (
				<Badge variant={!previousInstance ? 'default' : 'secondary'}>
					{!previousInstance ? 'Родитель' : previousInstance?.title}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'actions',
		header: 'Действия',
		cell: () => {
			return (
				<div className='flex items-center gap-2'>
					<Button
						size={'icon'}
						variant={'ghost'}
						className='text-muted-foreground hover:bg-destructive/20! hover:text-destructive'
					>
						<Trash2Icon />
					</Button>
				</div>
			);
		},
	},
];
