import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

let isRefreshing = false;
let failedQueue: Array<{
	resolve: (value: string) => void;
	reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach(({ resolve, reject }) => {
		if (error) {
			reject(error);
		} else {
			resolve(token!);
		}
	});

	failedQueue = [];
};

axios.interceptors.request.use(
	async (config: InternalAxiosRequestConfig) => {
		try {
			const token = 'token';
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		} catch (error) {
			console.error('Failed to get token for request:', error);
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

axios.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as InternalAxiosRequestConfig & {
			_retry?: boolean;
		};

		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						originalRequest.headers.Authorization = `Bearer ${token}`;
						return axios(originalRequest);
					})
					.catch((err) => {
						return Promise.reject(err);
					});
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const newToken = 'new token';
				processQueue(null, newToken);
				originalRequest.headers.Authorization = `Bearer ${newToken}`;
				return axios(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError, null);
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	},
);

axios.defaults.baseURL = import.meta.env.SERVER_URL || 'http://localhost:8000';

export default axios;
