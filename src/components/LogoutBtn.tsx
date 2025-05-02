import { Button, Flex } from '@mantine/core';
import { useAuthStore } from '../store/app.store';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    return (
        <Flex justify={'end'}>
        <Button variant="outline" color="red" onClick={() => { logout(); navigate('/login'); }}>
            Logout
        </Button>
        </Flex>
    );
};

export default LogoutButton;
