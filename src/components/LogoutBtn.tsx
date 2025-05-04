import { ActionIcon, Flex, Tooltip } from '@mantine/core';
import { useAuthStore } from '../store/app.store';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Flex justify="end" mt="md">
      <Tooltip label="Logout" withArrow>
        <ActionIcon
          variant="transparent"
          size="lg"
          color="red"
          radius="xl"
          onClick={handleLogout}
          sx={{
            fontSize: 24,
            transition: 'transform 0.2s ease',
            '&:hover': {
              transform: 'scale(1.15)',
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
            },
          }}
        >
          🔒
        </ActionIcon>
      </Tooltip>
    </Flex>
  );
};

export default LogoutButton;
