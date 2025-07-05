import { useQuery } from '@tanstack/react-query';

import { instancesService } from '../services';

export function useGetInstances() {
	const { data: instances, isLoading: isInstancesLoading } = useQuery({
		queryKey: ['instances'],
		queryFn: async () => await instancesService.getInstances(),
	});

	return { instances, isInstancesLoading };
}
