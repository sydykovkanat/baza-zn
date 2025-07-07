import { useQuery } from '@tanstack/react-query';

import { modelService } from '../services';

export function useGetActiveModels() {
	const { data: activeModels, isLoading: isActiveModelsLoading } = useQuery({
		queryKey: ['models', 'active'],
		queryFn: () => modelService.getAllActive(),
	});

	return { activeModels, isActiveModelsLoading };
}
