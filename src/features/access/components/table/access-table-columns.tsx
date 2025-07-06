import type { ColumnDef } from '@tanstack/react-table';

import type { IAccess } from '../../types';

export const accessTableColumns: ColumnDef<IAccess>[] = [
	{
		accessorKey: '_id',
		header: 'ID',
	},
	{
		accessorKey: 'role',
		header: 'Роль',
	},
];
