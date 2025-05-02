
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Card, Title, Text, Badge, Group, Loader, Divider,
  Container, Image, Anchor, Stack, Box, Paper, Grid,
  Timeline, ThemeIcon, RingProgress, Avatar
} from '@mantine/core';

//declare the types 
type Failure = {
  time: number;
  altitude: number | null;
  reason: string;
};

type Launch = {
  id: string;
  name: string;
  date_utc: string;
  success: boolean;
  details: string;
  rocket: string;
  failures: Failure[];
  fairings: {
    reused: boolean;
    recovery_attempt: boolean;
    recovered: boolean;
    ships: string[];
  };
  links: {
    patch: { large: string | null };
    webcast: string | null;
    article: string | null;
    wikipedia: string | null;
  };
  ships: string[];
  payloads: string[];
  launchpad: string;
  flight_number: number;
  date_local: string;
  cores: {
    core: string;
    reused: boolean;
    landing_success: boolean | null;
    landing_type: string | null;
  }[];
};

type Rocket = {
  name: string;
  height: { meters: number };
  mass: { kg: number };
  description: string;
};

const fetchLaunchById = async (id: string): Promise<Launch> => {
  const res = await fetch(`https://api.spacexdata.com/v4/launches/${id}`);
  if (!res.ok) throw new Error('Failed to fetch launch');
  return res.json();
};

const fetchRocketById = async (id: string): Promise<Rocket> => {
  const res = await fetch(`https://api.spacexdata.com/v4/rockets/${id}`);
  if (!res.ok) throw new Error('Failed to fetch rocket');
  return res.json();
};

const LaunchDetail = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: launch,
    isLoading: loadingLaunch,
    isError: launchError,
  } = useQuery(['launch', id], () => fetchLaunchById(id!), {
    enabled: !!id,
  });

  const {
    data: rocket,
    isLoading: loadingRocket,
    isError: rocketError,
  } = useQuery(['rocket', launch?.rocket], () => fetchRocketById(launch!.rocket), {
    enabled: !!launch?.rocket,
  });

  if (loadingLaunch || loadingRocket) {
    return (
      <Container py="xl" size="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Stack spacing="md" align="center">
            <Loader size="xl" variant="bars" />
            <Text size="lg" weight={500} color="dimmed">🚀 Loading mission data...</Text>
          </Stack>
        </Box>
      </Container>
    );
  }
  
  if (launchError || !launch) {
    return (
      <Container py="xl" size="lg">
        <Paper p="xl" radius="md" withBorder sx={{ backgroundColor: '#fff5f5' }}>
          <Group position="center" spacing="sm">
            <Text size="xl">⚠️</Text>
            <Text size="xl" weight={700} color="red">Failed to load launch data</Text>
          </Group>
          <Text align="center" mt="md">Please try again later or check your connection.</Text>
        </Paper>
      </Container>
    );
  }

  
  const launchDate = new Date(launch.date_utc);
  const formattedDate = launchDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const formattedTime = launchDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  return (
    <Container size="xl" py="xl">
      <Paper 
        shadow="md" 
        radius="lg" 
        p={0} 
        sx={{ 
          overflow: 'hidden',
          background: 'linear-gradient(to right, #1A202C, #2D3748)'
        }}
      >
        {/* Header with patch and title */}
        <Box 
          p="xl" 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            color: 'white',
            textAlign: 'center',
            
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#111827',
            backgroundImage: 'url(https://images.unsplash.com/photo-1517976487492-5750f3195933?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            {launch.links.patch?.large && (
              <Image
                src={launch.links.patch.large}
                alt={`${launch.name} patch`}
                height={180}
                width={180}
                fit="contain"
                sx={{ 
                  filter: 'drop-shadow(0px 0px 10px rgba(255,255,255,0.3))',
                  marginBottom: 20
                }}
              />
            )}

            <Title order={1} sx={{ fontSize: 42, fontWeight: 900, marginBottom: 10 }}>
              {launch.name}
            </Title>

            <Group position="center" spacing="md">
              <Badge 
                size="lg" 
                radius="md" 
                variant="filled"
                color={launch.success ? 'teal' : 'red'}
              >
                {launch.success ? '✅ MISSION SUCCESS' : '❌ MISSION FAILED'}
              </Badge>
            
              <Badge 
                size="lg" 
                radius="md" 
                variant="outline"
              >
                🚀 FLIGHT #{launch.flight_number}
              </Badge>
            </Group>
            
            <Text mt="md" color="gray.3">
              {formattedDate} • {formattedTime}
            </Text>
          </Box>
        </Box>

        {/* Main Content */}
        <Grid p="xl" gutter="xl">
          {/* Left column */}
          <Grid.Col md={7}>
            {/* Mission Details */}
            <Paper p="lg" radius="md" withBorder mb="xl">
              <Group position="apart" mb="md">
                <Group>
                  <Text size="xl">📋</Text>
                  <Title order={3}>Mission Details</Title>
                </Group>
              </Group>
              
              <Text size="md" sx={{ lineHeight: 1.6 }}>
                {launch.details || 'No description available for this mission.'}
              </Text>

              {/* Failures section */}
              {launch.failures.length > 0 && (
                <>
                  <Divider my="lg" />
                  <Title order={4} mb="md">
                    <Group spacing="xs">
                      <Text>⚠️</Text>
                      Failure Analysis
                    </Group>
                  </Title>
                  
                  <Timeline active={launch.failures.length} bulletSize={24} lineWidth={2}>
                    {launch.failures.map((fail, idx) => (
                      <Timeline.Item 
                        key={idx} 
                        bullet={"⚠️"} 
                        title={`T+${fail.time}s`}
                      >
                        <Text color="dimmed" size="sm">
                          Altitude: {fail.altitude ? `${fail.altitude} km` : 'N/A'}
                        </Text>
                        <Text mt={4}>{fail.reason}</Text>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </>
              )}
            </Paper>

            {/* Rocket Info */}
            {rocket && (
              <Paper p="lg" radius="md" withBorder mb="xl">
                <Group position="apart" mb="md">
                  <Group>
                    <Text size="xl">🚀</Text>
                    <Title order={3}>Rocket</Title>
                  </Group>
                  <Text weight={700} size="xl">{rocket.name}</Text>
                </Group>
                
                <Grid gutter="md" mt="md">
                  <Grid.Col span={6}>
                    <Paper withBorder p="md" radius="md">
                      <Group position="apart">
                        <Text color="dimmed" size="sm">Height</Text>
                        <Group spacing="xs">
                          <Text>📏</Text>
                          <Text weight={700} size="lg">{rocket.height.meters} m</Text>
                        </Group>
                      </Group>
                    </Paper>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Paper withBorder p="md" radius="md">
                      <Group position="apart">
                        <Text color="dimmed" size="sm">Mass</Text>
                        <Group spacing="xs">
                          <Text>⚖️</Text>
                          <Text weight={700} size="lg">{rocket.mass.kg.toLocaleString()} kg</Text>
                        </Group>
                      </Group>
                    </Paper>
                  </Grid.Col>
                </Grid>

                <Text mt="lg" sx={{ lineHeight: 1.6 }}>{rocket.description}</Text>
              </Paper>
            )}

            {/* Cores */}
            {launch.cores.length > 0 && (
              <Paper p="lg" radius="md" withBorder>
                <Group mb="md">
                  <Text size="xl">🔋</Text>
                  <Title order={3}>Booster Cores</Title>
                </Group>
                
                <Grid>
                  {launch.cores.map((core, idx) => (
                    <Grid.Col md={launch.cores.length > 1 ? 6 : 12} key={idx}>
                      <Paper withBorder p="md" radius="md" mb="md">
                        <Group position="apart" mb="xs">
                          <Text weight={700}>Core {idx + 1}</Text>
                          <Badge>{core.reused ? 'Reused' : 'New'}</Badge>
                        </Group>
                        <Text size="sm" mb="xs">ID: <Text component="span" weight={500}>{core.core}</Text></Text>
                        
                        <Group position="apart" mt="md">
                          <Text size="sm">Landing</Text>
                          <Badge 
                            color={
                              core.landing_success === true ? 'green' : 
                              core.landing_success === false ? 'red' : 'gray'
                            }
                          >
                            {core.landing_success === true ? 'Successful' : 
                            core.landing_success === false ? 'Failed' : 'No Attempt'}
                          </Badge>
                        </Group>
                        
                        {core.landing_type && (
                          <Text size="sm" mt="xs">Type: <Text component="span" weight={500}>{core.landing_type}</Text></Text>
                        )}
                      </Paper>
                    </Grid.Col>
                  ))}
                </Grid>
              </Paper>
            )}
          </Grid.Col>

          {/* Right column */}
          <Grid.Col md={5}>
            {/* Fairings */}
            <Paper p="lg" radius="md" withBorder mb="xl">
              <Group mb="lg">
                <Text size="xl">📦</Text>
                <Title order={4}>Fairings Recovery</Title>
              </Group>
              
              <Grid>
                <Grid.Col span={4}>
                  <RingProgress
                    size={120}
                    thickness={12}
                    roundCaps
                    sections={[
                      { value: 100, color: launch.fairings.reused ? 'green' : 'gray' }
                    ]}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Text size="xl">♻️</Text>
                      </Box>
                    }
                  />
                  <Text align="center" size="sm" mt="sm" weight={500}>Reused</Text>
                  <Text align="center" color={launch.fairings.reused ? 'green' : 'red'} weight={700}>
                    {launch.fairings.reused ? 'YES ✓' : 'NO ✗'}
                  </Text>
                </Grid.Col>
                
                <Grid.Col span={4}>
                  <RingProgress
                    size={120}
                    thickness={12}
                    roundCaps
                    sections={[
                      { value: 100, color: launch.fairings.recovery_attempt ? 'blue' : 'gray' }
                    ]}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Text size="xl">🔄</Text>
                      </Box>
                    }
                  />
                  <Text align="center" size="sm" mt="sm" weight={500}>Recovery Attempt</Text>
                  <Text align="center" color={launch.fairings.recovery_attempt ? 'blue' : 'gray'} weight={700}>
                    {launch.fairings.recovery_attempt ? 'YES ✓' : 'NO ✗'}
                  </Text>
                </Grid.Col>
                
                <Grid.Col span={4}>
                  <RingProgress
                    size={120}
                    thickness={12}
                    roundCaps
                    sections={[
                      { value: 100, color: launch.fairings.recovered ? 'teal' : 'gray' }
                    ]}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Text size="xl">📥</Text>
                      </Box>
                    }
                  />
                  <Text align="center" size="sm" mt="sm" weight={500}>Recovered</Text>
                  <Text align="center" color={launch.fairings.recovered ? 'teal' : 'red'} weight={700}>
                    {launch.fairings.recovered ? 'YES ✓' : 'NO ✗'}
                  </Text>
                </Grid.Col>
              </Grid>
            </Paper>

            {/* Links */}
            <Paper p="lg" radius="md" withBorder>
              <Group mb="md">
                <Text size="xl">🔗</Text>
                <Title order={3}>Related Links</Title>
              </Group>
              
              <Stack spacing="md" mt="lg">
                {launch.links.webcast && (
                  <Anchor
                    href={launch.links.webcast}
                    target="_blank"
                    sx={{
                      display: 'block',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      backgroundColor: '#f8f9fa',
                      color: '#333',
                      fontWeight: 500,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: '#e9ecef',
                        textDecoration: 'none',
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    <Group position="apart">
                      <Group spacing="sm">
                        <Avatar color="red" radius="xl">🎬</Avatar>
                        <Text>Watch Launch Webcast</Text>
                      </Group>
                      <Text>↗️</Text>
                    </Group>
                  </Anchor>
                )}

                {launch.links.article && (
                  <Anchor 
                    href={launch.links.article} 
                    target="_blank"
                    sx={{
                      display: 'block',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      backgroundColor: '#f8f9fa',
                      color: '#333',
                      fontWeight: 500,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: '#e9ecef',
                        textDecoration: 'none',
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    <Group position="apart">
                      <Group spacing="sm">
                        <Avatar color="blue" radius="xl">📄</Avatar>
                        <Text>Read Mission Article</Text>
                      </Group>
                      <Text>↗️</Text>
                    </Group>
                  </Anchor>
                )}

                {launch.links.wikipedia && (
                  <Anchor 
                    href={launch.links.wikipedia} 
                    target="_blank"
                    sx={{
                      display: 'block',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      backgroundColor: '#f8f9fa',
                      color: '#333',
                      fontWeight: 500,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: '#e9ecef',
                        textDecoration: 'none',
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    <Group position="apart">
                      <Group spacing="sm">
                        <Avatar color="orange" radius="xl">📚</Avatar>
                        <Text>Wikipedia Entry</Text>
                      </Group>
                      <Text>↗️</Text>
                    </Group>
                  </Anchor>
                )}

                {!launch.links.webcast && !launch.links.article && !launch.links.wikipedia && (
                  <Text color="dimmed" align="center" my="lg">No external links available for this mission.</Text>
                )}
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Paper>
    </Container>
  );
};

export default LaunchDetail;