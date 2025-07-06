import { zodResolver } from '@hookform/resolvers/zod';
import type { PropsWithChildren } from 'react';
import { useForm } from 'react-hook-form';

import {
	Button,
	Checkbox,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Label,
} from '@/shared/components/ui';
import type { ILanguage } from '@/shared/types';

import { createValueSchema, type ValueSchema } from './create-value.schemas';
import { useAccessStore } from '@/stores';

interface Props extends PropsWithChildren {
	value_localization?: ILanguage[];
	onSubmit?: (data: ValueSchema) => void;
	type: 'string' | 'integer';
}

export function CreateValueDialog({
	value_localization = [],
	onSubmit,
	type,
	children,
}: Props) {
	const createType =
		type === 'string' ? 'строковое значение' : 'числовое значение';
	const access = useAccessStore((state) => state.access);
	const schema = createValueSchema(value_localization);

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			key: '',
			name: value_localization.reduce(
				(acc, lang) => {
					acc[lang] = '';
					return acc;
				},
				{} as Record<string, string>,
			),
			type,
			access: [],
		},
	});

	const handleSubmit = (data: any) => {
		onSubmit?.(data);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>

			<DialogContent className='sm:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Добавить {createType}</DialogTitle>
					<DialogDescription>
						Введите значение для добавления новой строки
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={(e) => {
							e.stopPropagation();
							form.handleSubmit(handleSubmit)(e);
						}}
						className='space-y-4'
					>
						<FormField
							control={form.control}
							name='key'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Ключ</FormLabel>
									<FormControl>
										<Input
											placeholder='Введите ключ...'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{value_localization.map((lang) => (
							<FormField
								key={`name-${lang}`}
								control={form.control}
								name={`name.${lang}` as any}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Название ({lang})</FormLabel>
										<FormControl>
											<Input
												placeholder={`Введите название на ${lang}...`}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						))}

						<FormField
							control={form.control}
							name='access'
							render={() => (
								<FormItem>
									<FormLabel>Доступы</FormLabel>
									<div className='flex flex-wrap gap-2 space-y-2'>
										{access?.map((accessItem) => (
											<FormField
												key={accessItem._id}
												control={form.control}
												name='access'
												render={({ field }) => {
													return (
														<FormItem
															key={accessItem._id}
															className='flex flex-row items-start space-y-0 space-x-3'
														>
															<FormControl>
																<Label className='hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950'>
																	<Checkbox
																		checked={field.value?.includes(
																			accessItem._id,
																		)}
																		onCheckedChange={(checked) => {
																			return checked
																				? field.onChange([
																						...(field.value || []),
																						accessItem._id,
																					])
																				: field.onChange(
																						field.value?.filter(
																							(value) =>
																								value !== accessItem._id,
																						),
																					);
																		}}
																		className='data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700'
																	/>

																	<p className='text-sm leading-none font-medium'>
																		{accessItem.role}
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

						<div className='flex items-center justify-end gap-x-2'>
							<DialogClose asChild>
								<Button
									variant='secondary'
									type='button'
								>
									Отмена
								</Button>
							</DialogClose>

							<Button type='submit'>Добавить </Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
