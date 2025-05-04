import { useQuery } from '@tanstack/react-query';
import {
  Table, TextInput, Badge, Image, Group, Pagination, Flex, Box,
  Title, Card, Text, SimpleGrid, Container, useMantineTheme,
  MediaQuery, Paper, ActionIcon, Tooltip, BackgroundImage,
  Global, rem,
  AppShell
} from '@mantine/core';
import { fetchLaunches } from '../../api/spacex';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import RocketLoader from '../../components/Loader';
import AppHeader from '../../components/AppHeader';

type Launch = {
  id: string;
  name: string;
  date_utc: string;
  success: boolean;
  links: {
    patch: { small: string | null };
  };
  rocket: {
    name: string;
  };
};

const LaunchesPage = () => {
  const { data, isLoading } = useQuery(['launches'], fetchLaunches);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Launch>('date_utc');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const theme = useMantineTheme();

  const filtered = data?.filter((launch: Launch) =>
    launch.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedData = filtered?.sort((a: any, b: any) => {
    if (sortField === 'date_utc') {
      const dateA = new Date(a.date_utc).getTime();
      const dateB = new Date(b.date_utc).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    if (sortField === 'name') {
      return sortDirection === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    return 0;
  });

  const rowsPerPage = 6;
  const paginatedData = sortedData?.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleSort = (field: keyof Launch) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: keyof Launch) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? '🔼' : '🔽';
  };

  if (isLoading) return <RocketLoader />;

  return (
    <>
    <AppShell 
    header={<AppHeader title='SpaceX Launches Explorer' />}
    styles={{
      main: {
        backgroundColor: '#0f172a',
        width: '100vw',
        padding: 0,
        minHeight: '100vh'
      },
    }}
    padding={0}
    >
    
      <Box
       
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            padding: theme.spacing.md
          }}
        >
          <Paper
            radius="lg"
            p="xl"
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'rgba(13, 19, 33, 0.85)',
              backdropFilter: 'blur(5px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Flex
              direction="row"
              justify="space-between"
              align="center"
              mb="xl"
              wrap="wrap"
              gap="md"
            >
              <Box>
                <Title order={2} color="white" mb="xs">
                  🚀 SpaceX Launches Explorer
                </Title>
                <Text color="gray.3">Discover the fascinating history of space exploration</Text>
              </Box>

              <TextInput
                icon="🔍"
                placeholder="Search missions..."
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                rightSection={
                  search && (
                    <ActionIcon onClick={() => setSearch('')} variant="subtle" color="gray">
                      ❌
                    </ActionIcon>
                  )
                }
                sx={{ maxWidth: 300 }}
              />
            </Flex>

            {/* Table View for Large Screens */}
            <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
              <Box sx={{ flex: 1, overflow: 'auto' }}>
                <Table
                  
                  fontSize="md"
                  sx={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    '& thead tr th': {
                      backgroundColor: 'rgba(26, 27, 37, 0.6)',
                      color: 'white',
                      padding: '16px',
                      borderBottom: '2px solid rgba(82, 120, 228, 0.5)',
                      fontSize: '1rem'
                    },
                    '& tbody tr td': {
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '16px'
                    },
                    
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ cursor: 'pointer', width: '30%' }} onClick={() => handleSort('name')}>
                        <Group spacing="xs">
                          <span>🚀 Mission</span>
                          {getSortIcon('name')}
                        </Group>
                      </th>
                      <th style={{ cursor: 'pointer', width: '20%' }} onClick={() => handleSort('date_utc')}>
                        <Group spacing="xs">
                          <span>📅 Launch Date</span>
                          {getSortIcon('date_utc')}
                        </Group>
                      </th>
                      <th style={{ width: '15%' }}>🛰️ Rocket</th>
                      <th style={{ width: '15%' }}>🚦 Status</th>
                      <th style={{ width: '20%' }}>🏆 Mission Patch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData?.map((launch: Launch) => (
                      <tr key={launch.id}>
                        <td>
                          <Link to={`/launches/${launch.id}`} style={{ textDecoration: 'none' }}>
                            <Text weight={500} color="cyan" size="lg">
                              {launch.name}
                            </Text>
                          </Link>
                        </td>
                        <td>
                          <Group spacing="xs">
                            <Text>📅</Text>
                            <Text>
                              {new Date(launch.date_utc).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </Text>
                          </Group>
                        </td>
                        <td>
                          <Group spacing="xs">
                            <Text>🛰️</Text>
                            <Text>{launch.rocket.name}</Text>
                          </Group>
                        </td>
                        <td>
                          <Badge
                            variant="gradient"
                            gradient={launch.success ?
                              { from: 'teal', to: 'lime', deg: 90 } :
                              { from: 'orange', to: 'red', deg: 90 }
                            }
                            size="lg"
                            sx={{
                              padding: '8px 16px',
                              fontWeight: 600
                            }}
                          >
                            {launch.success ? '✅ Success' : '❌ Failure'}
                          </Badge>
                        </td>
                        <td>
                          {launch.links.patch?.small ? (
                            <Tooltip label={launch.name}>
                              <Box
                                sx={{
                                  background: 'rgba(0, 0, 0, 0.3)',
                                  borderRadius: '50%',
                                  padding: '8px',
                                  display: 'inline-block'
                                }}
                              >
                                <Image
                                  src={launch.links.patch.small}
                                  alt={`${launch.name} mission patch`}
                                  width={60}
                                  height={60}
                                  fit="contain"
                                  imageProps={{ style: { objectFit: 'contain', maxWidth: '100%' } }}
                                />
                              </Box>
                            </Tooltip>
                          ) : (
                            <Text color="dimmed" size="sm">🎭 No patch</Text>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Box>
            </MediaQuery>

            {/* Card View for Mobile/Tablet */}
            <MediaQuery largerThan="md" styles={{ display: 'none' }}>
              <Box sx={{ flex: 1, overflow: 'auto' }}>
                <SimpleGrid
                  cols={1}
                  spacing="lg"
                  breakpoints={[
                    { minWidth: 'xs', cols: 1, spacing: 'md' },
                    { minWidth: 'sm', cols: 2, spacing: 'lg' },
                  ]}
                >
                  {paginatedData?.map((launch: Launch) => (
                    <Card
                      key={launch.id}
                      shadow="lg"
                      p="lg"
                      radius="md"
                      component={Link}
                      to={`/launches/${launch.id}`}
                      sx={{
                        textDecoration: 'none',
                        backgroundColor: 'rgba(26, 27, 37, 0.7)',
                        border: '1px solid rgba(82, 120, 228, 0.3)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 12px 20px rgba(0, 0, 0, 0.4)'
                        }
                      }}
                    >
                      <Card.Section>
                        <Flex
                          align="center"
                          justify="center"
                          bg="rgba(13, 13, 18, 0.8)"
                          p="xl"
                        >
                          {launch.links.patch?.small ? (
                            <Image
                              src={launch.links.patch.small}
                              height={120}
                              width={120}
                              fit="contain"
                              alt={`${launch.name} patch`}
                              imageProps={{ style: { objectFit: 'contain', maxWidth: '100%' } }}
                            />
                          ) : (
                            <Box
                              h={120}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '48px'
                              }}
                            >
                              🚀
                            </Box>
                          )}
                        </Flex>
                      </Card.Section>

                      <Box mt="md" mb="xs">
                        <Text weight={600} size="lg" color="white" lineClamp={1}>
                          {launch.name}
                        </Text>
                      </Box>

                      <Group position="apart" mt="md">
                        <Group spacing="xs">
                          <Text>📅</Text>
                          <Text size="sm" color="gray.3">
                            {new Date(launch.date_utc).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </Text>
                        </Group>

                        <Badge
                          variant="gradient"
                          gradient={launch.success ?
                            { from: 'teal', to: 'lime', deg: 90 } :
                            { from: 'orange', to: 'red', deg: 90 }
                          }
                          size="lg"
                        >
                          {launch.success ? '✅ Success' : '❌ Failure'}
                        </Badge>
                      </Group>

                      <Text size="sm" color="gray.3" mt="md">
                        <Group spacing="xs">
                          <Text>🛰️</Text>
                          <Text>{launch.rocket.name}</Text>
                        </Group>
                      </Text>
                    </Card>
                  ))}
                </SimpleGrid>
              </Box>
            </MediaQuery>

            <Flex justify="center" mt="xl">
              <Pagination
                onChange={setPage}
                total={Math.ceil((filtered?.length || 0) / rowsPerPage)}
                color="cyan"
                size="lg"
                radius="xl"
                withEdges
                classNames={{
                  item: 'custom-pagination-item',
                }}
              />
            </Flex>
          </Paper>
        </Box>
      </Box>
      </AppShell>
    </>
  );
};

export default LaunchesPage;