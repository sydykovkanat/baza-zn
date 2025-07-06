import { zodResolver } from '@hookform/resolvers/zod';
import { HashIcon, ListPlusIcon, TypeIcon } from 'lucide-react';
import { type PropsWithChildren, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
	CreateValueDialog,
	ValueCard,
	type ValueSchema,
} from '@/shared/components/shared';
import {
	Button,
	Checkbox,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Label,
} from '@/shared/components/ui';
import { LANGUAGES } from '@/shared/constants';
import { type ILanguage, Language } from '@/shared/types';
import { cn } from '@/shared/utils';

import { useCreateModel } from '../../hooks';
import { modelCreateSchema, type ModelCreateSchema } from '../../schemas';

export function ModelCreateDialog({ children }: PropsWithChildren) {
	const [isOpen, setIsOpen] = useState(false);
	const form = useForm<ModelCreateSchema>({
		resolver: zodResolver(modelCreateSchema),
		defaultValues: {
			title: '',
			value_localization: [Language.RU],
			data: {},
			generation: 1,
			is_active: true,
			removed: false,
		},
	});

	const { createModel, isCreateModelLoading } = useCreateModel({
		onSuccess: () => {
			setIsOpen(false);
			form.reset();
		},
	});

	const onSubmit = async (data: ModelCreateSchema) => {
		createModel(data);
	};

	const handleCreateValue = (value: ValueSchema) => {
		const currentValues = form.getValues('data');
		const newData = {
			...currentValues,
			[value.key]: {
				name: value.name,
				value: {
					...Object.fromEntries(
						Object.keys(value.name).map((lang) => [lang, null]),
					),
				},
				type: value.type,
				access: value.access,
			},
		};
		form.setValue('data', newData);
	};

	const handleValueChange = (
		originalKey: string,
		updatedValue: ValueSchema,
	) => {
		const currentValues = form.getValues('data');
		const newData = { ...currentValues };

		if (originalKey !== updatedValue.key) {
			delete newData[originalKey];
		}

		newData[updatedValue.key] = {
			name: updatedValue.name,
			value: {
				...Object.fromEntries(
					Object.keys(updatedValue.name).map((lang) => [lang, null]),
				),
			},
			type: updatedValue.type,
			access: updatedValue.access,
		};

		form.setValue('data', newData);
	};

	const handleRemoveValue = (key: string) => {
		const currentValues = form.getValues('data');
		const newData = { ...currentValues };
		delete newData[key];
		form.setValue('data', newData);
	};

	const isFormValid = () => {
		const formValues = form.getValues();

		if (!formValues.title?.trim()) return false;

		if (!formValues.value_localization?.length) return false;

		const dataEntries = Object.entries(formValues.data);
		if (!dataEntries.length) return false;

		return dataEntries.every(([key, value]) => {
			if (!key?.trim()) return false;

			if (!value.access?.length) return false;

			return formValues.value_localization.every((lang) => {
				const nameForLang = value.name[lang];
				return nameForLang && nameForLang.trim();
			});
		});
	};

	const updateValuesForLanguageChange = (newLanguages: ILanguage[]) => {
		const currentValues = form.getValues('data');

		const updatedValues: Record<string, any> = {};

		Object.entries(currentValues).forEach(([key, value]) => {
			const newName: Record<string, string> = {};

			newLanguages.forEach((lang) => {
				newName[lang] = value.name[lang] ?? '';
			});

			updatedValues[key] = {
				...value,
				name: newName,
			};
		});

		form.setValue('data', updatedValues);
	};

	const watchedLanguages = form.watch('value_localization');
	const watchedData = form.watch('data');

	useEffect(() => {
		updateValuesForLanguageChange(watchedLanguages);
	}, [watchedLanguages]);

	return (
		<Dialog
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<DialogTrigger asChild>{children}</DialogTrigger>

			<Form {...form}>
				<DialogContent
					className={cn('max-h-[80vh] sm:max-w-2xl', {
						'sm:max-w-7xl': Object.keys(watchedData).length > 0,
					})}
				>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4'
					>
						<DialogHeader>
							<DialogTitle>Создать модель</DialogTitle>

							<DialogDescription>
								Заполните форму для создания новой модели.
							</DialogDescription>
						</DialogHeader>

						<div className='flex max-h-[60vh] items-start space-y-4 gap-x-4 overflow-y-auto'>
							<div
								className={cn('w-full space-y-4', {
									'bg-background sticky top-1':
										Object.keys(watchedData).length > 0,
								})}
							>
								<FormField
									control={form.control}
									name='title'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Название модели</FormLabel>
											<FormControl>
												<Input
													placeholder='Введите название модели...'
													{...field}
												/>
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='value_localization'
									render={() => (
										<FormItem>
											<FormLabel>Языки локализации</FormLabel>
											<FormDescription>
												Выберите языки, для которых будет доступна модель
											</FormDescription>

											<div className='flex flex-wrap items-center gap-4'>
												{LANGUAGES.map((item) => (
													<FormField
														key={item.value}
														control={form.control}
														name='value_localization'
														render={({ field }) => {
															return (
																<FormItem
																	key={item.value}
																	className='flex flex-row items-center gap-2'
																>
																	<FormControl>
																		<Label className='hover:bg-accent/50 flex w-full items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950'>
																			<Checkbox
																				checked={field.value?.includes(
																					item.value,
																				)}
																				onCheckedChange={(checked) => {
																					return checked
																						? field.onChange([
																								...field.value,
																								item.value,
																							])
																						: field.onChange(
																								field.value?.filter(
																									(value) =>
																										value !== item.value,
																								),
																							);
																				}}
																				className='data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700'
																			/>

																			<p className='text-sm leading-none font-medium'>
																				{item.label}
																			</p>
																		</Label>
																	</FormControl>
																</FormItem>
															);
														}}
													/>
												))}
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>

								<DropdownMenu modal={false}>
									<DropdownMenuTrigger asChild>
										<Button className='ml-auto flex'>
											<ListPlusIcon />
											Добавить свойства
										</Button>
									</DropdownMenuTrigger>

									<DropdownMenuContent className='flex flex-col gap-1'>
										<DropdownMenuItem asChild>
											<CreateValueDialog
												type='string'
												value_localization={form.watch('value_localization')}
												onSubmit={handleCreateValue}
											>
												<Button
													variant={'ghost'}
													size={'sm'}
												>
													<TypeIcon className='text-muted-foreground' />
													Строковое значение
												</Button>
											</CreateValueDialog>
										</DropdownMenuItem>

										<DropdownMenuItem asChild>
											<CreateValueDialog
												type='integer'
												value_localization={form.watch('value_localization')}
												onSubmit={handleCreateValue}
											>
												<Button
													variant={'ghost'}
													size={'sm'}
												>
													<HashIcon className='text-muted-foreground' />
													Числовое значение
												</Button>
											</CreateValueDialog>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>

							{Object.keys(watchedData).length > 0 && (
								<div className='w-full space-y-4'>
									{Object.entries(watchedData).map(([key, value], index) => (
										<ValueCard
											key={index}
											value={
												{
													key,
													name: value.name,
													type: value.type,
													access: value.access,
												} as ValueSchema
											}
											valueKey={key}
											onValueChange={(updatedValue) =>
												handleValueChange(key, updatedValue)
											}
											onRemove={() => handleRemoveValue(key)}
										/>
									))}
								</div>
							)}
						</div>

						<DialogFooter>
							<DialogClose asChild>
								<Button
									type='button'
									variant={'secondary'}
								>
									Закрыть
								</Button>
							</DialogClose>

							<Button
								type='submit'
								disabled={!isFormValid()}
								loading={isCreateModelLoading}
							>
								Создать
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Form>
		</Dialog>
	);
}
