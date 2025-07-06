import { useQuery } from '@tanstack/react-query';

import { accessService } from '../services';

export function useGetAccess() {
	const { data: access, isLoading: isAccessLoading } = useQuery({
		queryKey: ['access'],
		queryFn: async () => await accessService.getAccess(),
	});

	return { access, isAccessLoading };
}
