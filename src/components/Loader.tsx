
import { Box, Center, Text } from '@mantine/core';
import { useState, useEffect } from 'react';

const RocketLoader = () => {
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationDone(true); 
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Center style={{ minHeight: '100vh' }}>
      <Box style={{ textAlign: 'center' }}>
        <Text size="xl" weight={700} mb="lg">Launching...</Text>

        {/* Rocket Emoji Animation */}
        <div className={`rocket-launch ${animationDone ? 'launched' : ''}`} style={{ fontSize: '3rem' }}>
          🚀
        </div>

        <Text size="lg" mt="md" color="dimmed">Please wait while we prepare the data...</Text>
      </Box>
    </Center>
  );
};

export default RocketLoader;
