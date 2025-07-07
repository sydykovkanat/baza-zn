import { instance } from '@/shared/api';

import type { IInstance } from '../types';

function extractLocalizations(data: any): string[] {
	const languages = new Set<string>();

	// Проходим по всем полям в data
	Object.values(data).forEach((field: any) => {
		// Проверяем поля name и value на наличие локализаций
		if (field.name && typeof field.name === 'object') {
			Object.keys(field.name).forEach((lang) => languages.add(lang));
		}

		if (field.value && typeof field.value === 'object') {
			Object.keys(field.value).forEach((lang) => languages.add(lang));
		}
	});

	return Array.from(languages);
}

class InstancesService {
	async getInstances(): Promise<IInstance[]> {
		return (
			await instance<IInstance[]>({
				url: '/instances',
				method: 'GET',
			})
		).data;
	}

	async create(data: any) {
		const localizations = extractLocalizations(data.data || {});

		return (
			await instance<IInstance>({
				url: '/instances',
				method: 'POST',
				data: {
					...data,
					comment: null,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					is_active: true,
					removed: false,
					is_last: true,
					parent_instance: null,
					previous_instance: null,
					publicised_date: null,
					version: '1.0.0',
					value_localization: localizations,
				},
			})
		).data;
	}
}

export const instancesService = new InstancesService();
