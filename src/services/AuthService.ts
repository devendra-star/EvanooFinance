import { axiosPublic, axiosPrivate } from '../axios';
import { CONTENT_TYPE_JSON } from '../configs';
import { store } from '../store';

export default class AuthService {
  static requestOtp = async (payload: any) => {
    try {
      const response = await axiosPublic.post('/auth/request-otp', payload, {
        headers: { 'Content-Type': CONTENT_TYPE_JSON },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  static verifyOTP = async (payload: any) => {
    try {
      const response = await axiosPublic.post('/auth/verify-otp', payload, {
        headers: {
          'Content-Type': CONTENT_TYPE_JSON,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  static getRefreshToken = async () => {
    try {
      const state = store.getState();
      const token = state.auth.refreshToken;
      const response = await axiosPublic.get('/auth/refresh', {
        headers: { 'Refresh-Token': `${token}` },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  static setPin = async (payload: { pin: string }) => {
    try {
      const response = await axiosPrivate.post('/auth/mpin/set', { mpin: payload.pin }, {
        headers: { 'Content-Type': CONTENT_TYPE_JSON },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  static verifyPin = async (payload: { pin: string }) => {
    try {
      const response = await axiosPrivate.post('/auth/mpin/verify', { mpin: payload.pin }, {
        headers: { 'Content-Type': CONTENT_TYPE_JSON },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  static forgotPin = async (payload: { identifier: string; otp: string; newMpin: string }) => {
    try {
      const response = await axiosPublic.post('/auth/mpin/forgot', payload, {
        headers: { 'Content-Type': CONTENT_TYPE_JSON },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  static changeMpin = async (payload: { currentMpin: string; newMpin: string }) => {
    try {
      const response = await axiosPrivate.put('/auth/mpin/change', payload, {
        headers: { 'Content-Type': CONTENT_TYPE_JSON },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  static logout = async () => {
    try {
      const response = await axiosPrivate.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  static logoutAll = async () => {
    try {
      const response = await axiosPrivate.post('/auth/logout-all');
      return response.data;
    } catch (error) {
      throw error;
    }
  };
}
