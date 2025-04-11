import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

export const useAuth = () => {
    return useContext(AuthContext);
};
 // This is where you export the useAuth hook