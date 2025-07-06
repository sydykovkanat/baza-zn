import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { modelService } from '../services';
import type { IModel } from '../types';

interface Props {
	onSuccess?: (data: IModel) => void;
}

export function useRemoveModel({ onSuccess }: Props = {}) {
	const queryClient = useQueryClient();

	const {
		mutate: removeModel,
		isPending: isRemoveModelLoading,
		isSuccess: isRemoveModelSuccess,
	} = useMutation({
		mutationKey: ['remove-model'],
		mutationFn: (id: string) => modelService.remove(id),
		onSuccess: async (data: IModel) => {
			await queryClient.invalidateQueries({ queryKey: ['models'] });

			toast.success('Модель успешно удалена', {
				description: `Модель "${data.title}" успешно удалена.`,
			});

			if (onSuccess) {
				onSuccess(data);
			}
		},
	});

	return { removeModel, isRemoveModelLoading, isRemoveModelSuccess };
}
