import { toast } from 'sonner';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type { IAccess } from '@/features/access/types';

import { instance } from '@/shared/api';
import { logger } from '@/shared/utils';

interface State {
	access: IAccess[];
	isAccessLoading?: boolean;
}

interface Actions {
	getAccess: () => Promise<void>;
	getFilteredAccess: (access: IAccess[]) => IAccess[];
}

type AccessStore = State & Actions;

const initialState: State = {
	access: [],
};

export const useAccessStore = create<AccessStore>()(
	subscribeWithSelector(
		immer((set, get) => ({
			...initialState,

			getAccess: async () => {
				try {
					set((state) => {
						state.isAccessLoading = true;
					});

					const { data: access } = await instance<IAccess[]>({
						method: 'GET',
						url: '/access',
					});

					set((state) => {
						state.access = access;
					});
				} catch (err) {
					logger.error('Не удалось загрузить доступы', err);

					toast.error('Не удалось загрузить доступы', {
						description: 'Попробуйте обновить страницу',
					});
				} finally {
					set((state) => {
						state.isAccessLoading = true;
					});
				}
			},

			getFilteredAccess: (access: IAccess[]): IAccess[] => {
				const accesses = get().access;

				return accesses.filter((role) =>
					access.some((item) => item._id === role._id),
				);
			},
		})),
	),
);
