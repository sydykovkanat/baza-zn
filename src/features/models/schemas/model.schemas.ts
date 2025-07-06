import { z } from 'zod';

import { Language } from '@/shared/types';

export const modelCreateSchema = z.object({
	title: z.string().min(1, 'Название модели не может быть пустым'),
	value_localization: z
		.array(
			z.enum([Language.RU, Language.KY, Language.EN, Language.UZ], {
				message: 'Выбраны некорректные языки',
			}),
		)
		.min(1, 'Должен быть выбран хотя бы один язык'),
	data: z.record(
		z.string(),
		z.object({
			name: z.record(
				z.string(),
				z.string().min(1, 'Название не может быть пустым'),
			),
			value: z.record(z.string(), z.null().optional()),
			type: z.enum(['string', 'integer'], {
				message: 'Некорректный тип значения',
			}),
			access: z
				.array(z.string())
				.min(1, 'Должен быть выбран хотя бы один доступ'),
		}),
	),
	generation: z.number(),
	is_active: z.boolean(),
	removed: z.boolean(),
});

export type ModelCreateSchema = z.infer<typeof modelCreateSchema>;
