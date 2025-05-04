import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Card, Title, Text, Badge, Group, Loader, Divider,
  Container, Image, Stack, Box, Paper, Grid,
  Timeline, RingProgress, Button,
   Header, AppShell
} from '@mantine/core';

import AppHeader from '../../components/AppHeader';
import { useAuthStore } from '../../store/app.store';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  const res = await fetch(`${BASE_URL}/launches/${id}`);
  if (!res.ok) throw new Error('Failed to fetch launch');
  return res.json();
};

const fetchRocketById = async (id: string): Promise<Rocket> => {
  const res = await fetch(`${BASE_URL}/rockets/${id}`);
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
 const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

 
  const handleLogout = () => {
    logout();
    navigate('/login');
    
  };

  if (loadingLaunch || loadingRocket) {
    return (
      <AppShell
        header={
          <Header height={70} p="md" sx={{ backgroundColor: '#111827' }}>
            <Group position="apart">
              <Group>
                <Text size="xl" weight={700} color="white">🚀 SpaceX Mission Explorer</Text>
              </Group>
              <Button
                leftIcon="🚪"
                variant="subtle"
                color="gray"
               onClick={handleLogout}
              >
                Logout
              </Button>
            </Group>
          </Header>
        }
        styles={{
          main: {
            backgroundColor: '#f7f9fc',
            width: '100vw',
            padding: 0,
            minHeight: '100vh'
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 70px)' }}>
          <Stack spacing="md" align="center">
            <Loader size="xl" variant="bars" />
            <Text size="lg" weight={500} color="dimmed">🚀 Loading mission data...</Text>
          </Stack>
        </Box>
      </AppShell>
    );
  }

  if (launchError || !launch) {
    return (
      <AppShell
        header={
          <Header height={70} p="md" sx={{ backgroundColor: '#111827' }}>
            <Group position="apart">
              <Group>
                <Text size="xl" weight={700} color="white">🚀 SpaceX Mission Explorer</Text>
              </Group>
              <Button
                leftIcon="🚪"
                variant="subtle"
                color="gray"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Group>
          </Header>
        }
        styles={{
          main: {
            backgroundColor: '#f7f9fc',
            width: '100vw',
            padding: 0,
            minHeight: '100vh'
          },
        }}
      >
        <Container py="xl" size="lg">
          <Paper p="xl" radius="md" withBorder sx={{ backgroundColor: '#fff5f5' }}>
            <Group position="center" spacing="sm">
              <Text size="xl">⚠️</Text>
              <Text size="xl" weight={700} color="red">Failed to load launch data</Text>
            </Group>
            <Text align="center" mt="md">Please try again later or check your connection.</Text>
          </Paper>
        </Container>
      </AppShell>
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
    <AppShell
      padding={0}
      header={
        <AppHeader />
      }
      styles={{
        main: {
          backgroundColor: '#0f172a',
          width: '100vw',
          padding: 0,
          minHeight: '100vh'
        },
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '60vh',
          width: '100%',
          backgroundImage: 'url(https://images.unsplash.com/photo-1517976487492-5750f3195933?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
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
        <Container size="xl" sx={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: 'white'
        }}>
          <Box sx={{ maxWidth: 180, marginBottom: 30 }}>
            {launch.links.patch?.large && (
              <Image
                src={launch.links.patch.large}
                alt={`${launch.name} patch`}
                height={180}
                width={180}
                fit="contain"
                sx={{
                  filter: 'drop-shadow(0px 0px 15px rgba(255,255,255,0.4))',
                }}
              />
            )}
          </Box>

          <Title order={1} sx={{
            fontSize: '3.5rem',
            fontWeight: 900,
            marginBottom: 20,
            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}>
            {launch.name}
          </Title>

          <Group position="center" spacing="md" mb="lg">
            <Badge
              size="xl"
              radius="md"
              variant="filled"
              color={launch.success ? 'teal' : 'red'}
              sx={{ padding: '12px 24px', fontSize: '1rem' }}
            >
              {launch.success ? '✅ MISSION SUCCESS' : '❌ MISSION FAILED'}
            </Badge>

            <Badge
              size="xl"
              radius="md"
              variant="outline"
              sx={{ padding: '12px 24px', fontSize: '1rem', color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
            >
              🚀 FLIGHT #{launch.flight_number}
            </Badge>
          </Group>

          <Text mt="md" color="gray.3" size="lg">
            {formattedDate} • {formattedTime}
          </Text>
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{ backgroundColor: '#f7f9fc', minHeight: '40vh', padding: '40px 0' }}>
        <Container size="xl">
          <Grid gutter="xl">
            {/* Left column */}
            <Grid.Col md={7}>
              {/* Mission Details */}
              <Paper p="xl" radius="lg" withBorder mb="xl" shadow="md">
                <Group position="apart" mb="md">
                  <Group>
                    <Text size="xl">📋</Text>
                    <Title order={3}>Mission Details</Title>
                  </Group>
                </Group>

                <Text size="md" sx={{ lineHeight: 1.7 }}>
                  {launch.details || 'No description available for this mission.'}
                </Text>

                {/* Failures section */}
                {launch.failures.length > 0 && (
                  <>
                    <Divider my="xl" />
                    <Group spacing="xs" mb="md">
                      <Text size="xl">⚠️</Text>
                      <Title order={4}>Failure Analysis</Title>
                    </Group>

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
                <Paper p="xl" radius="lg" withBorder mb="xl" shadow="md">
                  <Group position="apart" mb="xl">
                    <Group>
                      <Text size="xl">🚀</Text>
                      <Title order={3}>Rocket</Title>
                    </Group>
                    <Text weight={700} size="xl">{rocket.name}</Text>
                  </Group>

                  <Grid gutter="xl" mb="xl">
                    <Grid.Col span={6}>
                      <Paper withBorder p="lg" radius="md" sx={{ height: '100%' }}>
                        <Group position="apart">
                          <Text color="dimmed" size="sm">Height</Text>
                          <Group spacing="xs">
                            <Text>📏</Text>
                            <Text weight={700} size="xl">{rocket.height.meters} m</Text>
                          </Group>
                        </Group>
                      </Paper>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Paper withBorder p="lg" radius="md" sx={{ height: '100%' }}>
                        <Group position="apart">
                          <Text color="dimmed" size="sm">Mass</Text>
                          <Group spacing="xs">
                            <Text>⚖️</Text>
                            <Text weight={700} size="xl">{rocket.mass.kg.toLocaleString()} kg</Text>
                          </Group>
                        </Group>
                      </Paper>
                    </Grid.Col>
                  </Grid>

                  <Text sx={{ lineHeight: 1.7 }}>{rocket.description}</Text>
                </Paper>
              )}

              {/* Cores */}
              {launch.cores.length > 0 && (
                <Paper p="xl" radius="lg" withBorder shadow="md">
                  <Group mb="xl">
                    <Text size="xl">🔋</Text>
                    <Title order={3}>Booster Cores</Title>
                  </Group>

                  <Grid>
                    {launch.cores.map((core, idx) => (
                      <Grid.Col md={launch.cores.length > 1 ? 6 : 12} key={idx}>
                        <Paper
                          withBorder
                          p="lg"
                          radius="md"
                          mb="md"
                          sx={{
                            borderLeft: `4px solid ${core.landing_success === true ? '#2F9E44' :
                              core.landing_success === false ? '#E03131' : '#868E96'
                              }`
                          }}
                        >
                          <Group position="apart" mb="md">
                            <Text weight={700} size="lg">Core {idx + 1}</Text>
                            <Badge size="lg">{core.reused !== null ? 'Reused' : 'New'}</Badge>
                          </Group>
                          <Text size="sm" mb="md">ID: <Text component="span" weight={500}>{core.core}</Text></Text>

                          <Group position="apart" mt="lg">
                            <Text size="sm">Landing</Text>
                            <Badge
                              size="lg"
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
                            <Text size="sm" mt="md">Type: <Text component="span" weight={500}>{core.landing_type}</Text></Text>
                          )}
                        </Paper>
                      </Grid.Col>
                    ))}
                  </Grid>
                </Paper>
              )}
            </Grid.Col>

            {/* Right column */}
            {launch.fairings ? (
              <Paper p="xl" radius="lg" withBorder mb="xl" shadow="md">
                <Group mb="xl">
                  <Text size="xl">📦</Text>
                  <Title order={4}>Fairings Recovery</Title>
                </Group>

                <Grid>
                  <Grid.Col span={4}>
                    <RingProgress
                      size={140}
                      thickness={14}
                      roundCaps
                      sections={[
                        { value: 100, color: launch.fairings.reused ? '#40C057' : '#CED4DA' }
                      ]}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Text size="xl">♻️</Text>
                        </Box>
                      }
                    />
                    <Text align="center" size="md" mt="md" weight={500}>Reused</Text>
                    <Text align="center" color={launch.fairings.reused ? 'green' : 'red'} weight={700} size="lg">
                      {launch.fairings.reused ? 'YES ✓' : 'NO ✗'}
                    </Text>
                  </Grid.Col>

                  <Grid.Col span={4}>
                    <RingProgress
                      size={140}
                      thickness={14}
                      roundCaps
                      sections={[
                        { value: 100, color: launch.fairings.recovery_attempt ? '#228BE6' : '#CED4DA' }
                      ]}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Text size="xl">🔄</Text>
                        </Box>
                      }
                    />
                    <Text align="center" size="md" mt="md" weight={500}>Recovery Attempt</Text>
                    <Text align="center" color={launch.fairings.recovery_attempt ? 'blue' : 'gray'} weight={700} size="lg">
                      {launch.fairings.recovery_attempt ? 'YES ✓' : 'NO ✗'}
                    </Text>
                  </Grid.Col>

                  <Grid.Col span={4}>
                    <RingProgress
                      size={140}
                      thickness={14}
                      roundCaps
                      sections={[
                        { value: 100, color: launch.fairings.recovered ? '#12B886' : '#CED4DA' }
                      ]}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Text size="xl">📥</Text>
                        </Box>
                      }
                    />
                    <Text align="center" size="md" mt="md" weight={500}>Recovered</Text>
                    <Text align="center" color={launch.fairings.recovered ? 'teal' : 'red'} weight={700} size="lg">
                      {launch.fairings.recovered ? 'YES ✓' : 'NO ✗'}
                    </Text>
                  </Grid.Col>
                </Grid>
              </Paper>
            ) : (
              <Paper p="xl" radius="lg" withBorder mb="xl" shadow="md">
                <Group mb="xl">
                  <Text size="xl">📦</Text>
                  <Title order={4}>Fairings Recovery</Title>
                </Group>
                <Text color="dimmed" align="center">No fairings data available for this mission.</Text>
              </Paper>
            )}

          </Grid>
        </Container>
      </Box>
    </AppShell>
  );
};

export default LaunchDetail;