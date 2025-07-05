import { DataTable } from '@/shared/components/shared';

import { instancesTableColumns } from '../../components';
import { useGetInstances } from '../../hooks';

export function InstancesTable() {
	const { instances, isInstancesLoading } = useGetInstances();

	return (
		<DataTable
			columns={instancesTableColumns}
			data={instances || []}
			isLoading={isInstancesLoading}
		/>
	);
}
