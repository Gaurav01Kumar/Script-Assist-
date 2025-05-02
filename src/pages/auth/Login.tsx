// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Box, Title } from '@mantine/core';
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
        <Box maw={400} mx="auto" mt="xl">
            <Title order={3} mb="md">Login</Title>
            <TextInput label="Username" value={username} onChange={(e) => setUsername(e.target.value)} mb="sm" />
            <PasswordInput label="Password" value={password} onChange={(e) => setPassword(e.target.value)} mb="sm" />
            <Button fullWidth onClick={handleLogin}>Login</Button>
        </Box>
    );
};

export default Login;
