import { useQuery } from '@tanstack/react-query';
import { Table, TextInput, Badge, Image, Group, Pagination, Flex, Box, Loader, Title } from '@mantine/core';
import { fetchLaunches } from '../../api/spacex';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import RocketLoader from '../../components/Loader';


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

const Landing = () => {
  const { data, isLoading } = useQuery(['launches'], fetchLaunches);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Launch>('date_utc');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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

  const rowsPerPage = 5;
  const paginatedData = sortedData?.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  if (isLoading) return <RocketLoader />;

  return (
    <Box p="lg">
      <Flex justify="space-between" align="center" mb="md" wrap="wrap">
        <Title order={2}>Launches</Title>
        <TextInput
          placeholder="Search launches"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          style={{ maxWidth: 300 }}
        />
      </Flex>

      <Table highlightOnHover>
        <thead>
          <tr>
            <th>
              <Group>
                <span>Name</span>
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setSortField('name');
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  {sortField === 'name' && (sortDirection === 'asc' ? '🔼' : '🔽')}
                </span>
              </Group>
            </th>
            <th>
              <Group>
                <span>Date</span>
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setSortField('date_utc');
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  {sortField === 'date_utc' && (sortDirection === 'asc' ? '🔼' : '🔽')}
                </span>
              </Group>
            </th>
            <th>Rocket</th>
            <th>Status</th>
            <th>Mission Patch</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData?.map((launch: Launch) => (
            <tr key={launch.id}>
              <td>
                <Link to={`/launches/${launch.id}`}>
                  <Group>
                    {launch.links.patch?.small && (
                      <Image
                        src={launch.links.patch.small}
                        alt={`${launch.name} patch`}
                        width={30}
                        height={30}
                        fit="contain"
                      />
                    )}
                    {launch.name}
                  </Group>
                </Link>
              </td>
              <td>{new Date(launch.date_utc).toLocaleDateString()}</td>
              <td>{launch.rocket.name}</td>
              <td>
                <Badge color={launch.success ? 'green' : 'red'}>
                  {launch.success ? 'Success' : 'Failure'}
                </Badge>
              </td>
              <td>
                {launch.links.patch?.small && (
                  <Image
                    src={launch.links.patch.small}
                    alt={`${launch.name} mission patch`}
                    width={50}
                    height={50}
                    fit="contain"
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Flex justify="center" mt="lg">
        <Pagination
          onChange={setPage}
          total={Math.ceil((filtered?.length || 0) / rowsPerPage)}
          color="teal"
        />
      </Flex>
    </Box>
  );
};

export default Landing;
