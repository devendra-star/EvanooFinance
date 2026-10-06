import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import AuthService from '../../services/AuthService';
import SecurityService from '../../services/SecurityService';

export interface AuthState {
  isLoggedIn: boolean;
  isOtpVerified: boolean;
  mobileNumber: string | null;
  userId: number | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLocked: boolean;
  lastBackgroundTime: number | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  isBiometricSupported: boolean;
  isBiometricEnabled: boolean;
  isPinSet: boolean;
}

const initialState: AuthState = {
  isLoggedIn: false,
  isOtpVerified: false,
  mobileNumber: null,
  userId: null,
  accessToken: null,
  refreshToken: null,
  isLocked: false,
  lastBackgroundTime: null,
  status: 'idle',
  error: null,
  isBiometricSupported: false,
  isBiometricEnabled: false,
  isPinSet: false,
};

export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (mobileNumber: string, { rejectWithValue }) => {
    try {
      const payload = { identifier: mobileNumber };
      const response = await AuthService.requestOtp(payload);
      return { mobileNumber, data: response?.data || response };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  },
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ mobileNumber, otp }: { mobileNumber: string; otp: string }, { rejectWithValue }) => {
    try {
      const payload = { identifier: mobileNumber, otp };
      const data = await AuthService.verifyOTP(payload);
      const tokenObj = data?.data || data?.tokens || data;
      return {
        accessToken: tokenObj?.accessToken || tokenObj?.token,
        refreshToken: tokenObj?.refreshToken || tokenObj?.refresh_token,
        mobileNumber,
        userId: tokenObj?.userId || tokenObj?.id || null,
        isMpinSet: tokenObj?.isMpinSet ?? tokenObj?.isPinSet ?? tokenObj?.mpinSet ?? tokenObj?.pinSet ?? false,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'OTP verify failed');
    }
  },
);

// New Security Thunks
export const checkBiometricSupport = createAsyncThunk(
  'auth/checkBiometricSupport',
  async () => {
    const isSupported = await SecurityService.checkBiometricSupport();
    return isSupported;
  }
);

export const setupSecurityPin = createAsyncThunk(
  'auth/setupSecurityPin',
  async ({ pin }: { pin: string }, { rejectWithValue }) => {
    try {
      await AuthService.setPin({ pin });
      return { isPinSet: true, isBiometricEnabled: false };
    } catch (error: any) {
      let errorMsg = error.message || 'Failed to setup PIN';
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      return rejectWithValue(errorMsg);
    }
  }
);


export const unlockWithPin = createAsyncThunk(
  'auth/unlockWithPin',
  async (pin: string) => {
    const data = await AuthService.verifyPin({ pin });
    return data;
  }
);

export const forgotSecurityPin = createAsyncThunk(
  'auth/forgotSecurityPin',
  async (
    payload: { mobileNumber: string; otp: string; newMpin: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await AuthService.forgotPin({
        identifier: payload.mobileNumber,
        otp: payload.otp,
        newMpin: payload.newMpin,
      });
      return response;
    } catch (error: any) {
      let errorMsg = error.message || 'Failed to reset PIN';
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      return rejectWithValue(errorMsg);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isLoggedIn = false;
      state.isOtpVerified = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.mobileNumber = null;
      state.userId = null;
      state.isLocked = false;
      state.lastBackgroundTime = null;
      state.isBiometricEnabled = false;
      state.isPinSet = false;
    },
    completeLogin(state) {
      state.isLoggedIn = true;
      state.isOtpVerified = false;
    },
    markPinAsSet(state) {
      state.isPinSet = true;
    },
    sessionExpired(state) {
      state.isLoggedIn = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.isLocked = false;
      state.lastBackgroundTime = null;
      state.error = 'Session expired. Please login again.';
      state.isBiometricEnabled = false;
      state.isPinSet = false;
      state.isOtpVerified = false;
    },
    updateTokens(
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>,
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    setLastBackgroundTime(state, action: PayloadAction<number | null>) {
      state.lastBackgroundTime = action.payload;
    },
    lockApp(state) {
      state.isLocked = true;
    },
    unlockApp(state) {
      state.isLocked = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(REHYDRATE, (state, action: any) => {
        if (action.payload && action.payload.auth) {
          const auth = action.payload.auth;
          state.isLoggedIn = auth.isLoggedIn;
          state.isOtpVerified = auth.isOtpVerified;
          state.mobileNumber = auth.mobileNumber;
          state.userId = auth.userId;
          state.accessToken = auth.accessToken;
          state.refreshToken = auth.refreshToken;
          state.lastBackgroundTime = auth.lastBackgroundTime;
          state.isBiometricSupported = auth.isBiometricSupported ?? false;
          state.isBiometricEnabled = auth.isBiometricEnabled ?? false;
          state.isPinSet = auth.isPinSet ?? false;

          if (auth.isLoggedIn) {
            state.isLocked = true;
          } else {
            state.isLocked = auth.isLocked;
          }
        }
      })
      .addCase(sendOtp.pending, (state) => {
        state.isOtpVerified = false;
        state.isPinSet = false;
      })
      .addCase(
        sendOtp.fulfilled,
        (state, action: PayloadAction<{ mobileNumber: string }>) => {
          state.mobileNumber = action.payload.mobileNumber;
          state.isOtpVerified = false;
          state.isPinSet = false;
        },
      )
      .addCase(verifyOtp.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.status = 'idle';
        state.isOtpVerified = true;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.mobileNumber = action.payload.mobileNumber;
        state.userId = action.payload.userId;
        state.isPinSet = action.payload.isMpinSet;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'OTP verify failed';
      })
      .addCase(checkBiometricSupport.fulfilled, (state, action) => {
        state.isBiometricSupported = action.payload;
      })
      .addCase(setupSecurityPin.fulfilled, (state, action) => {
        state.isPinSet = action.payload.isPinSet;
        state.isBiometricEnabled = action.payload.isBiometricEnabled;
      })

      .addCase(unlockWithPin.fulfilled, (state) => {
        state.isLocked = false;
        state.error = null;
      })
      .addCase(unlockWithPin.rejected, (state, action) => {
        state.error = action.error.message ?? 'Invalid PIN';
      });
  },
});

export const {
  logout,
  completeLogin,
  sessionExpired,
  updateTokens,
  setLastBackgroundTime,
  lockApp,
  unlockApp,
  markPinAsSet,
} = authSlice.actions;

export { SecurityService };
export default authSlice.reducer;
