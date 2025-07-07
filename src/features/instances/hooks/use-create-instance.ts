import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { instancesService } from '../services';

interface Props {
	onSuccess?: () => void;
}

export function useCreateInstance({ onSuccess }: Props = {}) {
	const { mutate: createInstance, isPending: isCreateInstanceLoading } =
		useMutation({
			mutationKey: ['create-instance'],
			mutationFn: (data: any) => instancesService.create(data),
			onSuccess: () => {
				toast.success('Экземпляр успешно создан', {
					description: 'Экземпляр успешно создан.',
				});

				if (onSuccess) {
					onSuccess();
				}
			},
		});

	return { createInstance, isCreateInstanceLoading };
}
