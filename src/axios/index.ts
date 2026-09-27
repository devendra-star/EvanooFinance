import axios from "axios";
import Config from "react-native-config";
import { Alert } from "react-native";
import DeviceInfo from 'react-native-device-info';
import { store } from "../store";
import { updateTokens, sessionExpired } from "../store/slices/authSlice";

export const axiosPublic = axios.create({
	baseURL: Config.API_URL,
	timeout: 15000,
});

export const axiosPrivate = axios.create({
	baseURL: Config.API_URL,
	timeout: 15000,
});

axiosPublic.interceptors.request.use(
	async (config) => {
		try {
			const deviceId = await DeviceInfo.getUniqueId();
			const deviceName = await DeviceInfo.getDeviceName();
			if (config.headers) {
				config.headers["X-Device-Id"] = deviceId;
				config.headers["X-Device-Name"] = deviceName;
			}
		} catch (e) {
			console.log('Error getting device info', e);
		}
		return config;
	},
	(error) => Promise.reject(error)
);

axiosPublic.interceptors.response.use(
	(response) => response,
	(error) => {
		let errorMsg = "Something went wrong";
		if (error.response?.data?.message) {
			errorMsg = error.response.data.message;
		} else if (error.response?.data?.detail) {
			errorMsg = error.response.data.detail;
		} else if (error.message) {
			errorMsg = error.message;
		}
		const status = error.response?.status ? ` - ${error.response.status}` : '';
		Alert.alert(`Error${status}`, errorMsg);
		return Promise.reject(error);
	}
);

axiosPrivate.interceptors.request.use(
	async (config) => {
		try {
			const state = store.getState();
			const token = state.auth.accessToken;
			const deviceId = await DeviceInfo.getUniqueId();
			const deviceName = await DeviceInfo.getDeviceName();
			
			if (config.headers) {
				if (token) {
					config.headers["Authorization"] = `Bearer ${token}`;
				}
				config.headers["X-Device-Id"] = deviceId;
				config.headers["X-Device-Name"] = deviceName;
			}
		} catch (e) {
			console.log('Error in private request interceptor', e);
		}
		return config;
	},
	(error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});
	failedQueue = [];
};

axiosPrivate.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						originalRequest.headers["Authorization"] = "Bearer " + token;
						return axiosPrivate(originalRequest);
					})
					.catch((err) => {
						return Promise.reject(err);
					});
			}

			originalRequest._retry = true;
			isRefreshing = true;

			const state = store.getState();
			const refreshToken = state.auth.refreshToken;

			if (!refreshToken) {
				store.dispatch(sessionExpired());
				return Promise.reject(error);
			}

			try {
				const { data } = await axiosPublic.post("/auth/refresh", {
					refreshToken: refreshToken
				});

				const responseData = data?.data || data;
				const newAccessToken = responseData?.accessToken;
				const newRefreshToken = responseData?.refreshToken;

				if (!newAccessToken) {
					throw new Error("Invalid token format received");
				}

				store.dispatch(
					updateTokens({
						accessToken: newAccessToken,
						refreshToken: newRefreshToken,
					})
				);

				processQueue(null, newAccessToken);
				originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;

				return axiosPrivate(originalRequest);
			} catch (err) {
				processQueue(err, null);
				store.dispatch(sessionExpired());
				return Promise.reject(err);
			} finally {
				isRefreshing = false;
			}
		} else {
			// Handle non-401 errors globally
			let errorMsg = "Something went wrong";
			if (error.response?.data?.message) {
				errorMsg = error.response.data.message;
			} else if (error.response?.data?.detail) {
				errorMsg = error.response.data.detail;
			} else if (error.message) {
				errorMsg = error.message;
			}
			if (errorMsg && !errorMsg.includes('already configured')) {
				const status = error.response?.status ? ` - ${error.response.status}` : '';
				Alert.alert(`Error${status}`, errorMsg);
			}
		}

		return Promise.reject(error);
	}
);
