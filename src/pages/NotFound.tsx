
import { Container, Title, Text, Button, Group } from '@mantine/core';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container size="md" style={{ textAlign: 'center', marginTop: '5rem' }}>
      <Title order={1} color="red">404</Title>
      <Text size="xl" mt="md">Oops! Page not found.</Text>
      <Text color="dimmed" mb="lg">
        The page you're looking for doesn't exist or has been moved.
      </Text>
      <Group position="center">
        <Button component={Link} to="/launches" color="teal">
          Back to Launches
        </Button>
        <Button component={Link} to="/login" variant="outline">
          Go to Login
        </Button>
      </Group>
    </Container>
  );
};

export default NotFound;
