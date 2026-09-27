
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppSelector } from '../hook';
import PublicStackNav from './components/PublicStackNav';
import ProtectedStackNav from './components/ProtectedStackNav';
import SemiProtectedStackNav from './components/SemiProtectedStackNav';

const RootNavigator = () => {
    const { isLoggedIn, isLocked } = useAppSelector(state => state.auth);

    return (
        <NavigationContainer>
            {!isLoggedIn ? (
                <PublicStackNav />
            ) : isLocked ? (
                <SemiProtectedStackNav />
            ) : (
                <ProtectedStackNav />
            )}
        </NavigationContainer>
    );
}

export default RootNavigator;