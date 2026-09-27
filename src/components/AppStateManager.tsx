import React, { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setLastBackgroundTime, lockApp, sessionExpired } from '../store/slices/authSlice';

interface AppStateManagerProps {
    children: React.ReactNode;
}

const FIVE_MINUTES_MS = 5 * 60 * 1000;
const THIRTY_MINUTES_MS = 30 * 60 * 1000;

export const AppStateManager: React.FC<AppStateManagerProps> = ({ children }) => {
    const dispatch = useDispatch();
    const appState = useRef(AppState.currentState);
    
    const { isLoggedIn, lastBackgroundTime, isLocked } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
            if (!isLoggedIn) {
                return;
            }

            if (appState.current?.match(/inactive|background/) && nextAppState === 'active') {
                // App has come to the foreground
                if (lastBackgroundTime) {
                    const elapsedTime = Date.now() - lastBackgroundTime;
                    
                    if (elapsedTime > THIRTY_MINUTES_MS) {
                        // Session expired due to inactivity
                        dispatch(sessionExpired());
                    } else if (elapsedTime > FIVE_MINUTES_MS && !isLocked) {
                        // App was in background for > 5 mins, lock it
                        dispatch(lockApp());
                    }
                }
            } else if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
                // App has gone to the background
                dispatch(setLastBackgroundTime(Date.now()));
            }

            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, [isLoggedIn, lastBackgroundTime, isLocked, dispatch]);

    return <>{children}</>;
};
