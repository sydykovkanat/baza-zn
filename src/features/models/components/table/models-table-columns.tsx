import type { ColumnDef } from '@tanstack/react-table';
import { Trash2Icon } from 'lucide-react';

import { Badge, Button } from '@/shared/components/ui';

import type { IModel } from '../../types';

export const modelsTableColumns: ColumnDef<IModel>[] = [
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
		accessorKey: 'generation',
		header: 'Поколение',
		cell: ({ row }) => {
			const generation = row.original.generation;

			return (
				<Badge variant={'secondary'}>
					{generation > 0 ? generation : 'Нет'}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'tags',
		header: 'Метки',
		cell: ({ row }) => {
			const isActive = row.original.is_active;

			return (
				<Badge variant={isActive ? 'default' : 'destructive'}>
					{isActive ? 'Активная' : 'Неактивная'}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'parent_model.title',
		header: 'Родительская модель',
		cell: ({ row }) => {
			const parentModel = row.original.parent_model;
			const isParent = parentModel && parentModel.id === row.original._id;

			return (
				<Badge variant={isParent ? 'default' : 'secondary'}>
					{isParent ? 'Родитель' : parentModel.title || 'Нет'}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'previous_model.title',
		header: 'Предыдущая модель',
		cell: ({ row }) => {
			const previousModel = row.original.previous_model;

			return (
				<Badge variant={!previousModel ? 'default' : 'secondary'}>
					{!previousModel ? 'Родитель' : previousModel?.title || 'Нет'}
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
