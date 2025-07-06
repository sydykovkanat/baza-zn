import { Trash2Icon } from 'lucide-react';

import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Checkbox,
	Input,
	Label,
} from '../../ui';

import type { ValueSchema } from './create-value.schemas';
import { useAccessStore } from '@/stores';

interface Props {
	value: ValueSchema;
	valueKey: string;
	onValueChange?: (value: ValueSchema) => void;
	onRemove?: (valueKey: string) => void;
}

export function ValueCard({ value, valueKey, onValueChange, onRemove }: Props) {
	const access = useAccessStore((state) => state.access);

	const handleNameChange = (lang: string, newName: string) => {
		if (!onValueChange) return;

		const updatedValue = {
			...value,
			name: {
				...value.name,
				[lang]: newName,
			},
		};

		onValueChange(updatedValue);
	};

	const handleAccessChange = (accessId: string, checked: boolean) => {
		if (!onValueChange) return;

		const updatedAccess = checked
			? [...(value.access || []), accessId]
			: (value.access || []).filter((id) => id !== accessId);

		const updatedValue = {
			...value,
			access: updatedAccess,
		};

		onValueChange(updatedValue);
	};

	const handleRemove = () => {
		if (onRemove) {
			onRemove(valueKey);
		}
	};

	return (
		<Card className='gap-0'>
			<CardHeader>
				<CardTitle className='flex items-center justify-between gap-4 font-normal'>
					<div className='flex items-center gap-4'>
						{value.key}{' '}
						<span className='text-muted-foreground'>({value.type})</span>
					</div>

					{onRemove && (
						<Button
							variant='ghost-destructive'
							size='icon'
							type='button'
							onClick={handleRemove}
						>
							<Trash2Icon />
						</Button>
					)}
				</CardTitle>
			</CardHeader>

			<CardContent className='space-y-4'>
				{Object.entries(value.name).length > 0 && (
					<div>
						<h4 className='mb-2 text-sm font-medium'>Названия по языкам</h4>
						<div className='space-y-2'>
							{Object.entries(value.name).map(([lang, name]) => (
								<div key={lang}>
									<Label className='text-muted-foreground mb-1 block text-xs'>
										{lang.toUpperCase()}
									</Label>
									<Input
										value={name || ''}
										onChange={(e) => handleNameChange(lang, e.target.value)}
										placeholder={`Введите название на ${lang}`}
									/>
								</div>
							))}
						</div>
					</div>
				)}

				<div>
					<h4 className='mb-2 text-sm font-medium'>Доступы</h4>
					<div className='space-y-2'>
						{access?.map((accessItem) => (
							<Label
								key={accessItem._id}
								className='hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950'
							>
								<Checkbox
									checked={value.access?.includes(accessItem._id) || false}
									onCheckedChange={(checked) => {
										handleAccessChange(accessItem._id, checked as boolean);
									}}
									className='data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700'
								/>
								<p className='text-sm leading-none font-medium'>
									{accessItem.role}
								</p>
							</Label>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
