import { z } from 'zod';

const languageEnum = z.enum(['ru', 'ky', 'en', 'uz']);

// Упрощенная схема для многоязычного текста
const multilingualTextSchema = z
	.record(languageEnum, z.string())
	.refine(
		(data) => Object.values(data).some((value) => value && value.trim()),
		{
			message: 'Должно быть заполнено хотя бы одно поле',
		},
	);

// Схема для строковых значений - требует заполнения ВСЕХ языков
const stringValueSchema = z
	.record(languageEnum, z.string())
	.refine(
		(data) => Object.values(data).every((value) => value && value.trim()),
		{
			message: 'Все языковые поля должны быть заполнены',
		},
	);

// Упрощенная схема для значений полей
const fieldValueSchema = z.union([
	stringValueSchema, // Для строковых полей с обязательной проверкой
	z.number().min(0, 'Значение должно быть положительным'), // Для числовых полей
]);

// Упрощенная схема для поля
const fieldSchema = z
	.object({
		name: multilingualTextSchema,
		value: fieldValueSchema,
		type: z.enum(['string', 'integer']),
		access: z
			.array(z.string())
			.min(1, 'Должен быть указан хотя бы один доступ'),
	})
	.refine(
		(data) => {
			// Дополнительная проверка в зависимости от типа поля
			if (data.type === 'string') {
				// Для строковых полей проверяем, что есть хотя бы одно заполненное значение
				const values = data.value as Record<string, string>;
				return Object.values(values).some((val) => val && val.trim());
			}
			if (data.type === 'integer') {
				// Для числовых полей проверяем, что значение больше или равно 0
				return typeof data.value === 'number' && data.value >= 0;
			}
			return true;
		},
		{
			message: 'Поле должно быть заполнено корректно',
			path: ['value'], // Указываем путь к полю с ошибкой
		},
	);

// Основная схема для создания экземпляра
export const instanceCreateSchema = z.object({
	title: z.string().min(1, 'Название не может быть пустым'),
	parent_model: z.string().min(1, 'Модель обязательна для заполнения'),
	data: z
		.record(z.string(), fieldSchema)
		.refine((data) => Object.keys(data).length > 0, {
			message: 'Должно быть заполнено хотя бы одно поле данных',
		})
		.refine(
			(data) => {
				return Object.entries(data).every(([, field]) => {
					if (field.type === 'string') {
						const values = field.value as Record<string, string>;
						return Object.values(values).every((val) => val && val.trim());
					}
					if (field.type === 'integer') {
						return typeof field.value === 'number' && field.value >= 0;
					}
					return true;
				});
			},
			{
				message: 'Все поля данных должны быть заполнены полностью',
			},
		),
});

export type InstanceCreateSchema = z.infer<typeof instanceCreateSchema>;
