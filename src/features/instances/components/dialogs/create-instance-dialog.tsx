import { type PropsWithChildren, useState } from 'react';

import { useGetActiveModels } from '@/features/models/hooks';
import type { IModel } from '@/features/models/types';

import {
	Badge,
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/shared/components/ui';
import { type IField, type ILanguage, Language } from '@/shared/types';

import { useCreateInstance } from '../../hooks';

interface FormData {
	title: string;
	parent_model: string;
	data: Record<
		string,
		{
			name: Record<ILanguage, string>;
			type: 'string' | 'integer';
			access: string[];
			value: Record<ILanguage, string> | number | undefined;
		}
	>;
}

interface ModelSelectorProps {
	value: string;
	activeModels: IModel[];
	isLoading: boolean;
	onChange: (modelId: string, model: IModel | null) => void;
}

function ModelSelector({
	value,
	activeModels,
	isLoading,
	onChange,
}: ModelSelectorProps) {
	return (
		<div className='space-y-2'>
			<label className='text-sm font-medium'>Модель</label>
			<Select
				value={value}
				onValueChange={(modelId) => {
					const selectedModel = activeModels.find((m) => m._id === modelId);
					onChange(modelId, selectedModel || null);
				}}
			>
				<SelectTrigger>
					<SelectValue placeholder='Выберите модель' />
				</SelectTrigger>
				<SelectContent>
					{isLoading ? (
						<SelectItem
							disabled
							value='loading'
						>
							Загрузка моделей...
						</SelectItem>
					) : (
						activeModels.map((model) => (
							<SelectItem
								key={model._id}
								value={model._id}
							>
								{model.title}
							</SelectItem>
						))
					)}
				</SelectContent>
			</Select>
		</div>
	);
}

interface LocalizationBadgesProps {
	languages: ILanguage[];
}

function LocalizationBadges({ languages }: LocalizationBadgesProps) {
	const getLanguageName = (lang: ILanguage): string => {
		const langNames: Record<ILanguage, string> = {
			[Language.RU]: 'Русский',
			[Language.EN]: 'English',
			[Language.KY]: 'Кыргызча',
			[Language.UZ]: "O'zbekcha",
		};
		return langNames[lang] || lang;
	};

	return (
		<div className='space-y-2'>
			<label className='text-sm font-medium'>Языки локализации</label>
			<div className='flex flex-wrap gap-2'>
				{languages.map((lang) => (
					<Badge
						key={lang}
						variant='outline'
					>
						{getLanguageName(lang)}
					</Badge>
				))}
			</div>
		</div>
	);
}

interface StringFieldInputsProps {
	fieldKey: string;
	field: IField;
	languages: ILanguage[];
	values: Record<ILanguage, string>;
	onChange: (lang: ILanguage, value: string) => void;
}

function StringFieldInputs({
	fieldKey,
	field,
	languages,
	values,
	onChange,
}: StringFieldInputsProps) {
	return (
		<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
			{languages.map((lang) => (
				<div
					key={`${fieldKey}-${lang}`}
					className='space-y-2'
				>
					<label className='text-sm font-medium'>
						{(field.name as unknown as Record<ILanguage, string>)[lang] ||
							`${fieldKey} (${lang})`}
					</label>
					<Input
						placeholder={`Введите значение для ${lang}...`}
						value={values[lang] || ''}
						onChange={(e) => onChange(lang, e.target.value)}
					/>
				</div>
			))}
		</div>
	);
}

interface IntegerFieldInputProps {
	fieldKey: string;
	field: IField;
	value: number | undefined;
	onChange: (value: number | undefined) => void;
}

function IntegerFieldInput({
	fieldKey,
	field,
	value,
	onChange,
}: IntegerFieldInputProps) {
	return (
		<div className='space-y-2'>
			<label className='text-sm font-medium'>
				{(field.name as unknown as Record<ILanguage, string>)[Language.RU] ||
					fieldKey}
			</label>
			<Input
				type='number'
				placeholder='Введите число (0 или больше)'
				value={value ?? ''}
				onChange={(e) => {
					const val = e.target.value;
					if (val === '') {
						onChange(undefined);
					} else {
						const num = parseInt(val, 10);
						if (!isNaN(num) && num >= 0) {
							onChange(num);
						}
					}
				}}
			/>
		</div>
	);
}

interface AccessBadgesProps {
	access: string[];
}

function AccessBadges({ access }: AccessBadgesProps) {
	return (
		<div className='space-y-2'>
			<label className='text-sm'>Права доступа</label>
			<div className='flex flex-wrap gap-2'>
				{access.map((accessId) => (
					<Badge
						key={accessId}
						variant='outline'
					>
						{accessId}
					</Badge>
				))}
			</div>
		</div>
	);
}

interface IFieldCardProps {
	fieldKey: string;
	field: IField;
	languages: ILanguage[];
	fieldData: FormData['data'][string];
	onStringChange: (lang: ILanguage, value: string) => void;
	onIntegerChange: (value: number | undefined) => void;
}

function IFieldCard({
	fieldKey,
	field,
	languages,
	fieldData,
	onStringChange,
	onIntegerChange,
}: IFieldCardProps) {
	const isFieldFilled = (): boolean => {
		if (!fieldData) return false;

		if (field.type === 'string') {
			const values = fieldData.value as Record<string, string>;
			return Object.values(values).every((val) => val && val.trim());
		}

		if (field.type === 'integer') {
			return typeof fieldData.value === 'number' && fieldData.value >= 0;
		}

		return false;
	};

	const filled = isFieldFilled();

	return (
		<div className='space-y-4 rounded-lg border p-4'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-4'>
					<span className='font-medium'>{fieldKey}</span>
					<Badge variant='secondary'>{field.type}</Badge>
					{!filled && (
						<Badge
							variant='destructive'
							className='text-xs'
						>
							Требует заполнения
						</Badge>
					)}
				</div>
			</div>

			{field.type === 'string' && (
				<StringFieldInputs
					fieldKey={fieldKey}
					field={field}
					languages={languages}
					values={fieldData.value as Record<ILanguage, string>}
					onChange={onStringChange}
				/>
			)}

			{field.type === 'integer' && (
				<IntegerFieldInput
					fieldKey={fieldKey}
					field={field}
					value={fieldData.value as number | undefined}
					onChange={onIntegerChange}
				/>
			)}

			<AccessBadges access={field.access} />
		</div>
	);
}

export function CreateInstanceDialog({ children }: PropsWithChildren) {
	const { activeModels, isActiveModelsLoading } = useGetActiveModels();
	const [selectedModel, setSelectedModel] = useState<IModel | null>(null);
	const [formData, setFormData] = useState<FormData>({
		title: '',
		parent_model: '',
		data: {},
	});

	const { createInstance, isCreateInstanceLoading } = useCreateInstance({
		onSuccess: () => {
			setFormData({
				title: '',
				parent_model: '',
				data: {},
			});
			setSelectedModel(null);
		},
	});

	const initializeModelData = (model: IModel): void => {
		const modelData: FormData['data'] = {};

		Object.entries(model.data).forEach(([key, field]) => {
			modelData[key] = {
				name: field.name as unknown as Record<ILanguage, string>,
				type: field.type,
				access: field.access,
				value:
					field.type === 'string'
						? model.value_localization.reduce(
								(acc, lang) => {
									acc[lang] = '';
									return acc;
								},
								{} as Record<ILanguage, string>,
							)
						: undefined,
			};
		});

		setFormData((prev) => ({
			...prev,
			data: modelData,
		}));
	};

	const handleModelChange = (modelId: string, model: IModel | null): void => {
		setSelectedModel(model);
		setFormData((prev) => ({
			...prev,
			parent_model: modelId,
			data: {},
		}));

		if (model) {
			initializeModelData(model);
		}
	};

	const handleStringFieldChange = (
		fieldKey: string,
		lang: ILanguage,
		value: string,
	): void => {
		setFormData((prev) => ({
			...prev,
			data: {
				...prev.data,
				[fieldKey]: {
					...prev.data[fieldKey],
					value: {
						...(prev.data[fieldKey].value as Record<ILanguage, string>),
						[lang]: value,
					},
				},
			},
		}));
	};

	const handleIntegerFieldChange = (
		fieldKey: string,
		value: number | undefined,
	): void => {
		setFormData((prev) => ({
			...prev,
			data: {
				...prev.data,
				[fieldKey]: {
					...prev.data[fieldKey],
					value: value,
				},
			},
		}));
	};

	const handleSubmit = (): void => {
		createInstance(formData);
	};

	const isFormValid = (): boolean => {
		if (!formData.title.trim() || !formData.parent_model) return false;

		return Object.entries(formData.data).every(([, field]) => {
			if (field.type === 'string') {
				const values = field.value as Record<string, string>;
				return Object.values(values).every((val) => val && val.trim());
			}
			if (field.type === 'integer') {
				return typeof field.value === 'number' && field.value >= 0;
			}
			return false;
		});
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>

			<DialogContent className='sm:max-w-4xl'>
				<DialogHeader>
					<DialogTitle>Создать экземпляр</DialogTitle>
					<DialogDescription>
						Заполните форму для создания нового экземпляра
					</DialogDescription>
				</DialogHeader>

				<div className='max-h-[80vh] space-y-6 overflow-y-auto'>
					<div className='space-y-6'>
						<ModelSelector
							value={formData.parent_model}
							activeModels={activeModels || []}
							isLoading={isActiveModelsLoading}
							onChange={handleModelChange}
						/>

						<div className='space-y-2'>
							<label className='text-sm font-medium'>Заголовок</label>
							<Input
								placeholder='Введите заголовок'
								value={formData.title}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, title: e.target.value }))
								}
							/>
						</div>

						{selectedModel && (
							<LocalizationBadges
								languages={selectedModel.value_localization}
							/>
						)}

						{selectedModel && Object.keys(selectedModel.data).length > 0 && (
							<div className='space-y-6'>
								{Object.entries(selectedModel.data).map(([key, field]) => (
									<IFieldCard
										key={key}
										fieldKey={key}
										field={field}
										languages={selectedModel.value_localization}
										fieldData={formData.data[key]}
										onStringChange={(lang, value) =>
											handleStringFieldChange(key, lang, value)
										}
										onIntegerChange={(value) =>
											handleIntegerFieldChange(key, value)
										}
									/>
								))}
							</div>
						)}

						<DialogFooter>
							<DialogClose asChild>
								<Button
									variant='secondary'
									type='button'
								>
									Отмена
								</Button>
							</DialogClose>
							<Button
								onClick={handleSubmit}
								disabled={!isFormValid()}
								loading={isCreateInstanceLoading}
							>
								Сохранить
							</Button>
						</DialogFooter>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
