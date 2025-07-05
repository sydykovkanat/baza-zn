import type { KeycloakInstance } from 'keycloak-js';
import { createContext, useCallback, useContext } from 'react';
import type { Socket } from 'socket.io-client';

import {
	getToken,
	isLoggedIn,
	setKeycloakInstance,
	updateToken,
} from '@/shared/lib';

export interface KeycloakContextType {
	keycloak: KeycloakInstance | null;
	authenticated: boolean;
	loading: boolean;
	token: string | null;
	socket: Socket | null;
	socketConnected: boolean;
	error: string | null;
	login: () => void;
	logout: () => void;
	getValidToken: () => string;
	updateToken: () => string;
	isLoggedIn: () => boolean;
}

export const KeycloakContext = createContext<KeycloakContextType | undefined>(
	undefined,
);

export function useKeycloak() {
	const context = useContext(KeycloakContext);
	if (context === undefined) {
		throw new Error('useKeycloak must be used within a KeycloakProvider');
	}

	if (context.keycloak && !context.loading) {
		setKeycloakInstance(context.keycloak);
	}

	return context;
}

export function useAuthState() {
	const { authenticated, loading, error, login, logout, keycloak } =
		useKeycloak();

	const loginWithRedirect = useCallback(
		(redirectUri?: string) => {
			if (keycloak) {
				keycloak.login({ redirectUri });
			}
		},
		[keycloak],
	);

	const logoutWithRedirect = useCallback(
		(redirectUri?: string) => {
			if (keycloak) {
				keycloak.logout({ redirectUri });
			}
		},
		[keycloak],
	);

	const updateProfile = useCallback(() => {
		if (keycloak) {
			keycloak.accountManagement();
		}
	}, [keycloak]);

	const getValidToken = useCallback(async (): Promise<string> => {
		if (!keycloak) {
			throw new Error('Keycloak not initialized');
		}
		return getToken();
	}, [keycloak]);

	const refreshToken = useCallback(async (): Promise<string> => {
		if (!keycloak) {
			throw new Error('Keycloak not initialized');
		}
		return updateToken();
	}, [keycloak]);

	const checkLogin = useCallback(async (): Promise<boolean> => {
		if (!keycloak) {
			return false;
		}
		return isLoggedIn();
	}, [keycloak]);

	return {
		authenticated,
		loading,
		error,
		login,
		logout,
		loginWithRedirect,
		logoutWithRedirect,
		updateProfile,
		isReady: !loading,
		getValidToken,
		updateToken: refreshToken,
		isLoggedIn: checkLogin,
	};
}
