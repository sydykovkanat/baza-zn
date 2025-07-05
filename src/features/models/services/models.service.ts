import { instance } from '@/shared/api';

import type { IModel } from '../types';

class ModelService {
	async getModels(): Promise<IModel[]> {
		return (
			await instance<IModel[]>({
				method: 'GET',
				url: '/models',
			})
		).data;
	}
}

export const modelService = new ModelService();
