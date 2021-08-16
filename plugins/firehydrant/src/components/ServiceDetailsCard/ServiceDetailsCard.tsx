/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { ServiceAnalytics } from '../ServiceAnalytics/ServiceAnalytics';
import {
  Box,
  Button as MaterialButton,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import NotesIcon from '@material-ui/icons/Notes';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import WarningIcon from '@material-ui/icons/Warning';
import AddIcon from '@material-ui/icons/Add';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Incident } from '../types';
import { ServiceIncidentsResponse } from '../../api/types';
import { useServiceDetails } from '../serviceDetails';
import { useServiceAnalytics } from '../serviceAnalytics';
import {
  InfoCard,
  Link,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

const useStyles = makeStyles(theme => ({
  button: {
    color: '#3b2492',
    display: 'grid',
    gridGap: '4px',
    textAlign: 'center',
    justifyItems: 'center',
    width: '105px',
    backgroundColor: theme.palette.type === 'dark' ? '#f1edff' : '',
    '&:hover, &:focus': {
      backgroundColor: '#f1edff',
      color: '#614ab6',
    },
    '&:active': {
      color: '#3b2492',
      backgroundColor: '#b2a6e3',
      boxShadow:
        'rgb(59, 36, 146) 0px 0px 0px 1px inset, rgb(141, 134, 188) 3px 3px 0px 0px inset;',
    },
    border: '1px solid #3b2492',
    borderRadius: '5px',
    padding: '8px 10px',
    textTransform: 'none',
  },
  buttonLink: {
    backgroundColor: '#3b2492',
    color: '#FFF',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#614ab6',
    },
  },
  buttonContainer: {
    display: 'grid',
    gridGap: '24px',
    gridAutoFlow: 'column',
    gridAutoColumns: 'min-content',
  },
  icon: {
    color: '#f1642d',
  },
  link: {
    textDecoration: 'underline',
    fontSize: '16px',
    lineHeight: '27px',
    color: '#3b2492',
    '&:hover, &:focus': {
      fontWeight: '500',
    },
  },
  linksContainer: {
    borderBottom: '1px solid #d5d5d5',
    padding: '10px 0px 10px 20px',
    backgroundColor: '#f1edff',
    marginBottom: '20px',
  },
  table: {
    width: '100%',
  },
  warning: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    background: '#f1edff',
    color: '#3b2492',
  },
}));

const ServiceAnalyticsView = ({
  serviceId,
  startDate,
  endDate,
}: {
  serviceId: string;
  startDate: DateTime;
  endDate: DateTime;
}) => {
  const {
    loading: analyticsLoading,
    value: analyticsValue = {},
    error: analyticsError,
  } = useServiceAnalytics({
    serviceId,
    startDate: startDate.toFormat('YYYY-MM-DD'),
    endDate: endDate.toFormat('YYYY-MM-DD'),
  });

  return (
    <ServiceAnalytics
      loading={analyticsLoading}
      value={analyticsValue}
      error={analyticsError}
    />
  );
};

export const ServiceDetailsCard = () => {
  const { entity } = useEntity();
  const classes = useStyles();
  const [showServiceDetails, setShowServiceDetails] = useState(false);
  const configApi = useApi(configApiRef);

  const BASE_URL =
    configApi.getOptionalString('firehydrant.baseUrl') ||
    'https://app.firehydrant.io';

  const startDate = DateTime.now().minus({ days: 30 }).toUTC();
  const endDate = DateTime.now().toUTC();

  // The Backstage service name in FireHydrant is a unique formatted string
  // that requires the entity's kind, name, and namespace.
  const fireHydrantServiceName = `${entity?.kind}:${
    entity?.metadata?.namespace ?? 'default'
  }/${entity?.metadata?.name}`;

  const { loading, value, error } = useServiceDetails({
    serviceName: fireHydrantServiceName,
  });

  const activeIncidents: string[] = value?.service?.active_incidents ?? [];
  const incidents: ServiceIncidentsResponse = value?.incidents ?? [];
  const serviceId: string = value?.service?.id!;

  useEffect(() => {
    if (value?.service && Object.keys(value?.service).length > 0) {
      setShowServiceDetails(true);
    }
  }, [value]);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  const headerText: string = showServiceDetails
    ? `There ${activeIncidents?.length === 1 ? 'is' : 'are'} ${
        activeIncidents?.length
      } active incident${activeIncidents?.length === 1 ? '' : 's'}.`
    : '';

  const serviceIncidentsLink: string = `${BASE_URL}/incidents?search={"services":[{"label":${JSON.stringify(
    value?.service?.name,
  )},"value":${JSON.stringify(value?.service?.id)}}]}`;

  return (
    <InfoCard>
      {!showServiceDetails && !loading && (
        <div className={classes.warning}>
          <WarningIcon />
          &nbsp;&nbsp;<span>This service does not exist in FireHydrant.</span>
        </div>
      )}
      {showServiceDetails && (
        <Box
          alignItems="center"
          display="flex"
          justifyContent="space-between"
          borderBottom="1px solid #d5d5d5"
        >
          <Box>
            <h2>{headerText}</h2>
          </Box>
          <Box>
            <MaterialButton
              className={classes.buttonLink}
              color="default"
              href={serviceIncidentsLink}
              startIcon={<ExitToAppIcon />}
              target="_blank"
              variant="outlined"
            >
              View service incidents
            </MaterialButton>
          </Box>
        </Box>
      )}
      {activeIncidents && activeIncidents?.length > 0 && (
        <Box className={classes.linksContainer}>
          {incidents &&
            incidents?.slice(0, 5).map((incident: Incident, index: number) => (
              <div key={index}>
                <Link
                  className={classes.link}
                  to={incident.incident_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {incident.name}
                </Link>
              </div>
            ))}
        </Box>
      )}
      <Box paddingLeft="16px" marginTop="10px">
        <Typography variant="subtitle1">View in FireHydrant </Typography>
        <Box className={classes.buttonContainer} marginTop="10px">
          <MaterialButton
            component={Link}
            target="_blank"
            rel="noopener"
            className={classes.button}
            to={`${BASE_URL}/incidents/new`}
          >
            <Box flexDirection="column">
              <Box>
                <AddIcon className={classes.icon} />
              </Box>
              <Box>
                <span>Declare an incident</span>
              </Box>
            </Box>
          </MaterialButton>
          <MaterialButton
            component={Link}
            target="_blank"
            rel="noopener"
            className={classes.button}
            to={`${BASE_URL}/incidents`}
          >
            <Box flexDirection="column">
              <Box>
                <WhatshotIcon className={classes.icon} />
              </Box>
              <Box>
                <span>View all incidents</span>
              </Box>
            </Box>
          </MaterialButton>
          {showServiceDetails && (
            <MaterialButton
              component={Link}
              target="_blank"
              rel="noopener"
              className={classes.button}
              to={`${BASE_URL}/services/${value?.service?.id}`}
            >
              <Box flexDirection="column">
                <Box>
                  <NotesIcon className={classes.icon} />
                </Box>
                <Box>
                  <span>View Service Details</span>
                </Box>
              </Box>
            </MaterialButton>
          )}
        </Box>
      </Box>
      {showServiceDetails && (
        <Box>
          <ServiceAnalyticsView
            serviceId={serviceId}
            startDate={startDate}
            endDate={endDate}
          />
        </Box>
      )}
    </InfoCard>
  );
};
