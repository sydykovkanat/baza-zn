import { useQuery } from '@tanstack/react-query';

import { modelService } from '../services';

export function useGetModels() {
	const { data: models, isLoading: isModelsLoading } = useQuery({
		queryKey: ['models'],
		queryFn: async () => await modelService.getAll(),
	});

	return { models, isModelsLoading };
}
