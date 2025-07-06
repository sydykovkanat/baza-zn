import z from 'zod';

import { type ILanguage } from '@/shared/types';

export const createValueSchema = (languages: ILanguage[]) => {
	const nameSchema = z
		.object(
			languages.reduce(
				(acc, lang) => {
					acc[lang] = z
						.string()
						.min(1, `Название для ${lang.toUpperCase()} не может быть пустым`);
					return acc;
				},
				{} as Record<ILanguage, z.ZodString>,
			),
		)
		.and(
			z
				.record(z.string(), z.string().min(1, 'Название не может быть пустым'))
				.refine(
					(obj) => languages.every((lang) => lang in obj && obj[lang]?.trim()),
					{
						message: 'Должны быть заполнены все выбранные языки',
					},
				),
		);

	return z.object({
		key: z.string().min(1, 'Ключ не может быть пустым'),
		name: nameSchema,
		type: z.enum(['string', 'integer'], {
			message: 'Некорректный тип значения',
		}),
		access: z
			.array(z.string())
			.min(1, 'Должен быть выбран хотя бы один доступ'),
	});
};

export type ValueSchema = z.infer<ReturnType<typeof createValueSchema>>;
