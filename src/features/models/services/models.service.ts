import { instance } from '@/shared/api';

import type { ModelCreateSchema } from '../schemas';
import type { IModel } from '../types';

class ModelService {
	async getAll(): Promise<IModel[]> {
		return (
			await instance<IModel[]>({
				method: 'GET',
				url: '/models',
			})
		).data;
	}

	async getAllActive(): Promise<IModel[]> {
		return (
			await instance<IModel[]>({
				method: 'GET',
				url: '/models/get-active-model',
			})
		).data;
	}

	async create(data: ModelCreateSchema) {
		return (
			await instance<IModel>({
				method: 'POST',
				url: '/models',
				data: {
					...data,
					comment: null,
					createdAt: null,
					parent_model: null,
					previous_model: null,
					publicised_date: null,
					updatedAt: null,
				},
			})
		).data;
	}

	async remove(id: string) {
		return (
			await instance<IModel>({
				method: 'PUT',
				url: '/models/remove',
				params: { id },
			})
		).data;
	}
}

export const modelService = new ModelService();
