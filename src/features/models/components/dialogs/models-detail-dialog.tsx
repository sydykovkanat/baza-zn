import { CopyIcon, PencilIcon, PlusIcon } from 'lucide-react';
import { type PropsWithChildren, useState } from 'react';

import { Field, LanguageSelect } from '@/shared/components/shared';
import {
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/shared/components/ui';
import type { ILanguage } from '@/shared/types';

import type { IModel } from '../../types';

interface Props extends PropsWithChildren {
	model: IModel;
}

export function ModelsDetailDialog({ model, children }: Props) {
	const [selectedLanguage, setSelectedLanguage] = useState<ILanguage | null>(
		null,
	);

	const handleLanguageChange = (language: ILanguage) => {
		setSelectedLanguage(language);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>

			<DialogContent className='sm:max-w-5xl'>
				<DialogHeader>
					<DialogTitle>Детальная информация о модели</DialogTitle>

					<DialogDescription>
						Детальная информация о модели, включая поля, типы и другие
						метаданные.
					</DialogDescription>
				</DialogHeader>

				<div className='space-y-4'>
					<div className='flex flex-wrap items-center gap-2'>
						<LanguageSelect
							languages={model.value_localization}
							selectedLanguage={selectedLanguage}
							setSelectedLanguage={handleLanguageChange}
						/>

						<Button>
							<PlusIcon />
							Новое поколение
						</Button>

						<Button>
							<PlusIcon />
							Создать экземпляр
						</Button>

						<Button variant={'secondary'}>
							<CopyIcon />
							Скопировать поля
						</Button>

						<Button variant={'secondary'}>
							<PencilIcon />
							Редактировать
						</Button>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						{Object.entries(model.data).map(([key, field]) => (
							<Field
								key={key}
								valueKey={key}
								field={field}
								selectedLanguage={selectedLanguage}
							/>
						))}
					</div>
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button variant={'secondary'}>Закрыть</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
