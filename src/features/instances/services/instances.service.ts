import { instance } from '@/shared/api';

import type { IInstance } from '../types';

class InstancesService {
	async getInstances(): Promise<IInstance[]> {
		return (
			await instance<IInstance[]>({
				url: '/instances',
				method: 'GET',
			})
		).data;
	}
}

export const instancesService = new InstancesService();
