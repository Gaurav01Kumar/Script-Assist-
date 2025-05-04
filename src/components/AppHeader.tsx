import { Header, Group, Text, MediaQuery, Burger } from '@mantine/core';
import LogoutButton from './LogoutBtn';

interface AppHeaderProps {
    title?: string;
}

const AppHeader = ({ title }: AppHeaderProps) => {
    return (
        <Header height={70} p="md" sx={{ backgroundColor: '#111827' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
                <Group>
                    <Text size="md" weight={700} color="white">
                        🚀 {title ?? "SpaceX Explorer"} 
                    </Text>
                </Group>


                <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                    <div>
                        <LogoutButton />
                    </div>
                </MediaQuery>


                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                    <div>
                        <LogoutButton />
                    </div>
                </MediaQuery>
            </div>
        </Header>
    );
};

export default AppHeader;
