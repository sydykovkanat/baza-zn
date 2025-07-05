import type { IModel } from '@/features/models/types';

import type { IField, ILanguage } from '@/shared/types';

interface NestedInstance {
	id: string;
	title: string;
}

export interface IInstance {
	_id: string | null;
	previous_instance: NestedInstance | null;
	parent_instance: NestedInstance | null;
	version: number;
	publicised_date: string | null;
	value_localization: ILanguage[];
	removed: boolean;
	is_active: boolean;
	is_last: boolean;
	parent_model: IModel | null;
	previous_model: IModel | null;
	comment: string | null;
	title: any;
	data: Record<string, IField>;
	updatedAt: string | null;
	createdAt: string | null;
}
