import { instance } from '@/shared/api';

import type { IAccess } from '../types';

class AccessService {
	async getAccess() {
		return (
			await instance<IAccess[]>({
				url: '/access',
				method: 'GET',
			})
		).data;
	}
}

export const accessService = new AccessService();
