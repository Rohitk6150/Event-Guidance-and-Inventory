import React from 'react';
import { Button } from '@mui/material';
import { FcGoogle } from 'react-icons/fc';

const GoogleLoginButton = () => {
    const handleGoogleLogin = () => {
        window.location.href = '/api/auth/google';
    };

    return (
        <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={handleGoogleLogin}
            startIcon={<FcGoogle />}
        >
            Login with Google
        </Button>
    );
};

export default GoogleLoginButton;