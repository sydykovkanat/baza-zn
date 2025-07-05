import type { ILanguage } from '@/shared/types';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui';

export function LanguageSelect({
	selectedLanguage,
	setSelectedLanguage,
	languages,
}: {
	selectedLanguage: string | null;
	setSelectedLanguage: (language: ILanguage) => void;
	languages: string[];
}) {
	return (
		<Select
			value={selectedLanguage || ''}
			onValueChange={setSelectedLanguage}
		>
			<SelectTrigger>
				<SelectValue placeholder='Выберите язык' />
			</SelectTrigger>

			<SelectContent>
				{languages.map((lang) => (
					<SelectItem
						key={lang}
						value={lang}
					>
						{lang}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
