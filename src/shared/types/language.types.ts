export type ILanguage = 'ru' | 'ky' | 'en' | 'uz';

export const Language = {
	RU: 'ru' as const,
	KY: 'ky' as const,
	EN: 'en' as const,
	UZ: 'uz' as const,
} satisfies Record<string, ILanguage>;
