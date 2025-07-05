import type { IField } from '@/shared/types';

import { Badge, Card, CardContent, ScrollArea, Separator } from '../ui';

import { useAccessStore } from '@/stores';

interface Props {
	valueKey: string;
	field: IField;
	selectedLanguage?: string | null;
}

export function Field({ valueKey, field, selectedLanguage }: Props) {
	const access = useAccessStore((state) => state.access);
	const getFilteredAccess = useAccessStore((state) => state.getFilteredAccess);

	const filteredAccess = () => {
		const acs = getFilteredAccess(access);
		return acs
			.filter((item) => field.access.includes(item._id))
			.map((item) => item.role);
	};

	const getFieldName = (): string => {
		if (
			selectedLanguage &&
			field.name[selectedLanguage as keyof typeof field.name]
		) {
			return String(field.name[selectedLanguage as keyof typeof field.name]);
		}

		return String(Object.values(field.name)[0]) || 'Без названия';
	};

	return (
		<Card>
			<CardContent className='space-y-4'>
				<div className='grid grid-cols-5 gap-x-4'>
					<h4 className='col-span-1 capitalize'>{valueKey}</h4>

					<div className='flex items-center gap-x-2'>
						<p className='text-muted-foreground text-sm'>Тип</p>
						<p>{field.type}</p>
					</div>

					<div className='flex items-center gap-x-2'>
						<p className='text-muted-foreground text-sm'>Доступ</p>
						<p>
							{filteredAccess().map((role, index) => (
								<Badge
									key={index}
									variant={'secondary'}
								>
									{role}
								</Badge>
							))}
						</p>
					</div>
				</div>

				<Separator />

				<div className='grid grid-cols-5 gap-x-4'>
					<h4 className='text-muted-foreground col-span-1'>Название</h4>

					<ScrollArea className='col-span-4 max-h-40 w-full'>
						{getFieldName()}
					</ScrollArea>
				</div>
			</CardContent>
		</Card>
	);
}
