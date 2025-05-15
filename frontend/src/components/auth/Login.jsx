import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/AuthService';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import GoogleLoginButton from './GoogleLoginButton';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        // Validate email format
        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            setLoading(false);
            return;
        }

        // Validate password
        if (!password) {
            setError('Please enter your password');
            setLoading(false);
            return;
        }
        
        try {
            const response = await authService.login({ 
                email,
                password 
            });
            
            if (response && response.token) {
                login(response.token);
                navigate('/events');
            } else {
                setError('Login successful but no token received');
            }
        } catch (err) {
            console.error('Login error:', err);
            if (err.message.includes('Invalid email or password')) {
                setError('Invalid email or password. Please try again.');
            } else {
                setError(err.message || 'Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box mt={8} display="flex" flexDirection="column" alignItems="center">
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                    {error && (
                        <Typography color="error" sx={{ mt: 1, mb: 2 }}>
                            {error}
                        </Typography>
                    )}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={email !== '' && !validateEmail(email)}
                        helperText={email !== '' && !validateEmail(email) ? 'Please enter a valid email address' : ''}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3 }}
                        disabled={loading}
                    >
                        Login
                        {loading && <span className="loading-indicator"></span>}
                    </Button>
                    <GoogleLoginButton />
                    <Box mt={2}>
                        <Link to="/register" style={{ textDecoration: 'none' }}>
                            <Typography variant="body2" align="center">
                                Don't have an account? Register here.
                            </Typography>
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;