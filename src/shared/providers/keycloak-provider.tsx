import type { KeycloakInstance } from 'keycloak-js';
import Keycloak from 'keycloak-js';
import type { PropsWithChildren } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

import { KeycloakContext, type KeycloakContextType } from '@/shared/hooks';

export function KeycloakProvider({ children }: PropsWithChildren) {
	const [keycloak, setKeycloak] = useState<KeycloakInstance | null>(null);
	const [authenticated, setAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);
	const [token, setToken] = useState<string | null>(null);
	const [socket, setSocket] = useState<Socket | null>(null);
	const [socketConnected, setSocketConnected] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const initializingRef = useRef(false);
	const redirectingRef = useRef(false);

	useEffect(() => {
		if (initializingRef.current) {
			return;
		}
		initializingRef.current = true;
		initializeKeycloak();
	}, []);

	const initializeKeycloak = async () => {
		try {
			const serverHost = import.meta.env.VITE_APP_CCID_SERVER_HOST;
			const realm = import.meta.env.VITE_APP_CCID_REALM;
			const clientId = import.meta.env.VITE_APP_CCID_CLIENT_ID;
			const socketHost = import.meta.env.VITE_APP_SERVER_HOST;

			if (!serverHost || !realm || !clientId || !socketHost) {
				throw new Error('Missing environment variables');
			}

			const keycloakInstance = new Keycloak({
				url: serverHost,
				realm: realm,
				clientId: clientId,
			});

			const initResult = await keycloakInstance.init({
				checkLoginIframe: false,
				flow: 'standard',
				onLoad: 'login-required',
			});

			setKeycloak(keycloakInstance);
			setupKeycloakEvents(keycloakInstance, socketHost);

			if (initResult && keycloakInstance.token) {
				await handleSuccessfulAuth(keycloakInstance, socketHost);
			} else {
				setLoading(false);
				setTimeout(() => startAutoLogin(keycloakInstance), 500);
			}
		} catch (error) {
			const errorMessage = `Initialization failed: ${error}`;
			setError(errorMessage);
			setLoading(false);
		}
	};

	const startAutoLogin = (keycloakInstance: KeycloakInstance) => {
		if (redirectingRef.current) {
			return;
		}

		redirectingRef.current = true;

		try {
			const redirectUri = window.location.origin + window.location.pathname;
			keycloakInstance.login({ redirectUri });
		} catch {
			setError('Failed to redirect to login');
			setLoading(false);
			redirectingRef.current = false;
		}
	};

	const handleSuccessfulAuth = async (
		keycloakInstance: KeycloakInstance,
		socketHost: string,
	) => {
		setAuthenticated(true);
		setToken(keycloakInstance.token!);
		setError(null);

		cleanUrl();
		await initializeSocket(keycloakInstance.token!, socketHost);
		setLoading(false);
	};

	const cleanUrl = () => {
		const url = new URL(window.location.href);
		let hasChanges = false;

		const paramsToRemove = ['code', 'state', 'session_state', 'iss'];
		paramsToRemove.forEach((param) => {
			if (url.searchParams.has(param)) {
				url.searchParams.delete(param);
				hasChanges = true;
			}
		});

		if (hasChanges) {
			const cleanUrl = `${url.origin}${url.pathname}${url.search}`;
			window.history.replaceState({}, '', cleanUrl);
		}
	};

	const setupKeycloakEvents = (
		keycloakInstance: KeycloakInstance,
		socketHost: string,
	) => {
		keycloakInstance.onTokenExpired = async () => {
			try {
				const refreshed = await keycloakInstance.updateToken(30);
				if (refreshed && keycloakInstance.token) {
					setToken(keycloakInstance.token);
				}
			} catch {
				setError('Session expired');
				setAuthenticated(false);
				setToken(null);
			}
		};

		keycloakInstance.onAuthSuccess = () => {
			if (keycloakInstance.token) {
				handleSuccessfulAuth(keycloakInstance, socketHost);
			}
		};

		keycloakInstance.onAuthError = () => {
			setError('Authentication failed');
			setAuthenticated(false);
			setToken(null);
			setLoading(false);
		};

		keycloakInstance.onAuthLogout = () => {
			setAuthenticated(false);
			setToken(null);
			setError(null);
			if (socket) {
				socket.disconnect();
				setSocket(null);
				setSocketConnected(false);
			}
		};

		keycloakInstance.onAuthRefreshSuccess = () => {};

		keycloakInstance.onAuthRefreshError = () => {};
	};

	const initializeSocket = async (authToken: string, socketHost: string) => {
		try {
			if (socket) {
				socket.disconnect();
				setSocket(null);
				setSocketConnected(false);
			}

			const socketInstance = io(socketHost, {
				path: '/user-socket/',
				auth: { jwt: `Bearer ${authToken}` },
				transports: ['websocket'],
				autoConnect: true,
			});

			socketInstance.on('connect', () => {
				setSocketConnected(true);
			});

			socketInstance.on('disconnect', () => {
				setSocketConnected(false);
			});

			socketInstance.on('connect_error', () => {
				setSocketConnected(false);
			});

			socketInstance.on('reconnect', () => {
				setSocketConnected(true);
			});

			socketInstance.on('reconnect_attempt', () => {});

			socketInstance.on('reconnect_error', () => {});

			socketInstance.on('reconnect_failed', () => {});

			setSocket(socketInstance);
		} catch {
			setSocketConnected(false);
		}
	};

	const login = () => {
		if (keycloak && !redirectingRef.current) {
			startAutoLogin(keycloak);
		}
	};

	const logout = () => {
		if (keycloak) {
			const redirectUri = window.location.origin + window.location.pathname;
			keycloak.logout({ redirectUri });
		}
	};

	useEffect(() => {
		return () => {
			if (socket) {
				socket.disconnect();
			}
		};
	}, [socket]);

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	const value: KeycloakContextType = {
		keycloak,
		authenticated,
		loading,
		token,
		socket,
		socketConnected,
		error,
		login,
		logout,
	};

	return (
		<KeycloakContext.Provider value={value}>
			{children}
		</KeycloakContext.Provider>
	);
}
