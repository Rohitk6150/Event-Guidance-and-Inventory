import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/AuthService';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        
        // Validate email format
        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            setLoading(false);
            return;
        }

        // Validate password length
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }
        
        try {
            const response = await authService.register({ 
                username, 
                email, 
                password 
            });
            
            if (response) {
                setSuccess('Registration successful! Please login with your credentials.');
                // Clear form
                setUsername('');
                setEmail('');
                setPassword('');
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            console.error('Registration error:', err);
            if (err.message.includes('User already exists')) {
                setError('An account with this email already exists. Please try logging in instead.');
            } else {
                setError(err.message || 'Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box mt={8} display="flex" flexDirection="column" alignItems="center">
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                    {error && (
                        <Alert severity="error" sx={{ mt: 1, mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" sx={{ mt: 1, mb: 2 }}>
                            {success}
                        </Alert>
                    )}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
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
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={password !== '' && password.length < 6}
                        helperText={password !== '' && password.length < 6 ? 'Password must be at least 6 characters long' : ''}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3 }}
                        disabled={loading}
                    >
                        Register
                        {loading && <span className="loading-indicator"></span>}
                    </Button>
                    <Box mt={2}>
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            <Typography variant="body2" align="center">
                                Already have an account? Login here.
                            </Typography>
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default Register;