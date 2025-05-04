import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Box, Title, Paper } from '@mantine/core';
import { useAuthStore } from '../../store/app.store';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleLogin = () => {
        if (username === 'admin' && password === 'admin') {
            login('mock-token-123');
            navigate('/launches');
        } else {
            alert('Invalid credentials');
        }
    };

    return (
        <div
            style={{
                height: '100vh',
                width: '100vw',
                backgroundImage: 'url("https://images.unsplash.com/photo-1541185934-01b600ea069c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px'
            }}
        >
            <Paper
                shadow="md"
                p="xl"
                radius="md"
                style={{
                    maxWidth: 400,
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)'
                }}
            >
                <Title order={3} mb="md" align="center">Login</Title>
                <TextInput 
                    label="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    mb="sm"
                    required
                />
                <PasswordInput 
                    label="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    mb="md"
                    required 
                />
                <Button 
                    fullWidth 
                    onClick={handleLogin}
                    size="md"
                >
                    Login
                </Button>
            </Paper>
        </div>
    );
};

export default Login;