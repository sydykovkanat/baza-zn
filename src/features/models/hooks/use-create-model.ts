import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { ModelCreateSchema } from '../schemas';
import { modelService } from '../services';
import type { IModel } from '../types';

interface Props {
	onSuccess?: (data: IModel) => void;
}

export function useCreateModel({ onSuccess }: Props = {}) {
	const queryClient = useQueryClient();

	const {
		mutate: createModel,
		isPending: isCreateModelLoading,
		isSuccess: isCreateModelSuccess,
	} = useMutation({
		mutationKey: ['create-model'],
		mutationFn: (data: ModelCreateSchema) => modelService.create(data),
		onSuccess: async (data: IModel) => {
			await queryClient.invalidateQueries({ queryKey: ['models'] });

			toast.success('Модель успешно создана', {
				description: `Модель "${data.title}" успешно создана.`,
			});

			if (onSuccess) {
				onSuccess(data);
			}
		},
	});

	return { createModel, isCreateModelLoading, isCreateModelSuccess };
}
