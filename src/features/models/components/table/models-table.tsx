import { DataTable } from '@/shared/components/shared';

import { useGetModels, useRemoveModel } from '../../hooks';

import { createModelsTableColumns } from './models-table-columns';

export function ModelsTable() {
	const { models, isModelsLoading } = useGetModels();
	const { removeModel } = useRemoveModel();

	return (
		<>
			<DataTable
				columns={createModelsTableColumns({
					removeModel,
				})}
				data={models || []}
				isLoading={isModelsLoading}
			/>
		</>
	);
}
