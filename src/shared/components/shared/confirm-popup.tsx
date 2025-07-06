import { PopoverClose } from '@radix-ui/react-popover';
import { type LucideIcon, Trash2Icon, XIcon } from 'lucide-react';
import type { PropsWithChildren } from 'react';

import { Button, Popover, PopoverContent, PopoverTrigger } from '../ui';

interface Props extends PropsWithChildren {
	onConfirm?: () => void;
	onCancel?: () => void;
	confirmText?: string;
	cancelText?: string;
	confirmIcon?: LucideIcon;
	cancelIcon?: LucideIcon;
}

export function ConfirmPopup({
	onConfirm,
	onCancel,
	confirmText = 'Продолжить',
	cancelText = 'Отмена',
	confirmIcon: ConfirmIcon,
	cancelIcon: CancelIcon,
	children,
}: Props) {
	return (
		<Popover>
			<PopoverTrigger asChild>{children}</PopoverTrigger>

			<PopoverContent className='space-y-2 p-2'>
				<h4 className='text-center text-sm'>
					Вы уверены, что хотите это?
					<br />
					Это действие необратимо.
				</h4>

				<div className='flex items-center justify-center gap-x-2'>
					<PopoverClose asChild>
						<Button
							size={'sm'}
							className='flex-1'
							onClick={onCancel}
						>
							{CancelIcon ? <CancelIcon /> : <XIcon />}
							{cancelText}
						</Button>
					</PopoverClose>

					<PopoverClose asChild>
						<Button
							size={'sm'}
							className='flex-1'
							variant={'secondary'}
							onClick={onConfirm}
						>
							{ConfirmIcon ? <ConfirmIcon /> : <Trash2Icon />}
							{confirmText}
						</Button>
					</PopoverClose>
				</div>
			</PopoverContent>
		</Popover>
	);
}
