import type { ColumnDef } from '@tanstack/react-table';
import { InfoIcon, Trash2Icon } from 'lucide-react';

import { ConfirmPopup } from '@/shared/components/shared';
import { Badge, Button } from '@/shared/components/ui';

import type { IModel } from '../../types';
import { ModelsDetailDialog } from '../dialogs';

interface ModelsTableColumnsProps {
	removeModel: (modelId: string) => void;
}

export const createModelsTableColumns = ({
	removeModel,
}: ModelsTableColumnsProps): ColumnDef<IModel>[] => [
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
					{isParent ? 'Родитель' : parentModel?.title || 'Нет'}
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
		cell: ({ row }) => {
			const model = row.original;

			return (
				<div className='flex items-center gap-2'>
					<ModelsDetailDialog model={model}>
						<Button
							size={'icon'}
							variant={'ghost'}
						>
							<InfoIcon />
						</Button>
					</ModelsDetailDialog>

					<ConfirmPopup onConfirm={() => removeModel(model._id)}>
						<Button
							size={'icon'}
							variant={'ghost-destructive'}
						>
							<Trash2Icon />
						</Button>
					</ConfirmPopup>
				</div>
			);
		},
	},
];
