import { DataTable } from '@/shared/components/shared';

import { useGetModels } from '../../hooks';

import { modelsTableColumns } from './models-table-columns';

export function ModelsTable() {
	const { models, isModelsLoading } = useGetModels();

	return (
		<>
			<DataTable
				columns={modelsTableColumns}
				data={models || []}
				isLoading={isModelsLoading}
			/>
		</>
	);
}
