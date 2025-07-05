import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { Loader2Icon } from 'lucide-react';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/shared/components/ui';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	isLoading?: boolean;
	onRowClick?: (row: TData) => void;
	rowClassName?: string;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	isLoading = false,
	onRowClick,
	rowClassName,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className='overflow-hidden rounded-lg border'>
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{isLoading ? (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className='h-24 text-center'
							>
								<Loader2Icon className='text-muted-foreground mx-auto block size-5 animate-spin' />
							</TableCell>
						</TableRow>
					) : table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && 'selected'}
								onClick={() => onRowClick?.(row.original)}
								className={
									onRowClick
										? `hover:bg-muted/50 cursor-pointer ${rowClassName || ''}`
										: rowClassName
								}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className='h-24 text-center'
							>
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
