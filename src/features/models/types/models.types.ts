import type { IField, ILanguage } from '@/shared/types';

export interface IModel {
	_id: string;
	previous_model: {
		id: string;
		title: string;
	} | null;
	parent_model: {
		id: string;
		title: string;
	};
	generation: number;
	publicised_date: Date | null;
	value_localization: ILanguage[];
	removed: boolean;
	is_active: boolean;
	comment: string | null;
	title: string;
	data: Record<string, IField>;
	createdAt: Date;
	updatedAt: Date;
	previous_model_data?: IModel | null;
}
