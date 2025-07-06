import { DataTable } from '@/shared/components/shared';

import { useGetAccess } from '../../hooks';

import { accessTableColumns } from './access-table-columns';

export function AccessTable() {
	const { access, isAccessLoading } = useGetAccess();

	return (
		<>
			<DataTable
				columns={accessTableColumns}
				data={access || []}
				isLoading={isAccessLoading}
			/>
		</>
	);
}
