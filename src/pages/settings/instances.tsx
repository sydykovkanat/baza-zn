import { PlusIcon } from 'lucide-react';

import {
	CreateInstanceDialog,
	InstancesTable,
} from '@/features/instances/components';

import { Button } from '@/shared/components/ui';

export function InstancesPage() {
	return (
		<div className='h-full w-full space-y-4'>
			<div className='flex items-center justify-end'>
				<CreateInstanceDialog>
					<Button>
						<PlusIcon />
						Создать экземпляр
					</Button>
				</CreateInstanceDialog>
			</div>
			<InstancesTable />
		</div>
	);
}
