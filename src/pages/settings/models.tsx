import { PlusIcon } from 'lucide-react';

import { ModelCreateDialog, ModelsTable } from '@/features/models/components';

import { Button } from '@/shared/components/ui';

export function ModelsPage() {
	return (
		<div className='h-full w-full space-y-4'>
			<div className='flex items-center justify-end'>
				<ModelCreateDialog>
					<Button>
						<PlusIcon />
						Создать модель
					</Button>
				</ModelCreateDialog>
			</div>
			<ModelsTable />
		</div>
	);
}
