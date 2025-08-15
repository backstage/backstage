import React from 'react';
import { useAsync } from 'react-use';
import {
  Table,
  Progress,
  ResponseErrorPanel,
  StatusOK,
  StatusError,
  StatusWarning,
} from '@backstage/core-components';
import { useApi, discoveryApiRef, fetchApiRef } from '@backstage/core-plugin-api';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    padding: theme.spacing(3),
  },
}));

interface Monitor {
  id: number;
  friendly_name: string;
  url: string;
  type: number;
  status: number;
  interval: number;
}

interface UptimeRobotResponse {
  stat: string;
  monitors: Monitor[];
  pagination?: {
    offset: number;
    limit: number;
    total: number;
  };
}

const getStatusComponent = (status: number) => {
  switch (status) {
    case 2:
      return <StatusOK>Up</StatusOK>;
    case 8:
    case 9:
      return <StatusError>Down</StatusError>;
    case 0:
    case 1:
      return <StatusWarning>Paused/Pending</StatusWarning>;
    default:
      return <StatusWarning>Unknown</StatusWarning>;
  }
};

const getMonitorTypeString = (type: number): string => {
  switch (type) {
    case 1:
      return 'HTTP(s)';
    case 2:
      return 'Keyword';
    case 3:
      return 'Ping';
    case 4:
      return 'Port';
    case 5:
      return 'Heartbeat';
    default:
      return 'Unknown';
  }
};

export const UptimeRobotComponent = () => {
  const classes = useStyles();
  const discoveryApi = useApi(discoveryApiRef);
  const fetchApi = useApi(fetchApiRef);

  const { value, loading, error } = useAsync(async (): Promise<UptimeRobotResponse> => {
    const baseUrl = await discoveryApi.getBaseUrl('proxy');
    const response = await fetchApi.fetch(`${baseUrl}/uptimerobot/monitors`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch monitors: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }, [discoveryApi, fetchApi]);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  if (!value || value.stat !== 'ok') {
    return (
      <div className={classes.container}>
        <Typography color="error">
          Failed to load UptimeRobot data: {value?.stat || 'Unknown error'}
        </Typography>
      </div>
    );
  }

  const columns = [
    {
      title: 'Name',
      field: 'friendly_name',
      type: 'string' as const,
    },
    {
      title: 'URL',
      field: 'url',
      type: 'string' as const,
    },
    {
      title: 'Type',
      field: 'type',
      type: 'string' as const,
      render: (rowData: Monitor) => getMonitorTypeString(rowData.type),
    },
    {
      title: 'Status',
      field: 'status',
      type: 'string' as const,
      render: (rowData: Monitor) => getStatusComponent(rowData.status),
    },
    {
      title: 'Interval',
      field: 'interval',
      type: 'string' as const,
      render: (rowData: Monitor) => `${rowData.interval} seconds`,
    },
  ];

  return (
    <div className={classes.container}>
      <Table
        title="UptimeRobot Monitors"
        options={{
          search: true,
          paging: true,
        }}
        columns={columns}
        data={value.monitors || []}
      />
    </div>
  );
};