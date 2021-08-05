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
import moment from 'moment';
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
import { InfoCard, Progress } from '@backstage/core-components';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

const useStyles = makeStyles(theme => ({
  infoCard: {
    height: '342px',
  },
  button: {
    color: '#3b2492',
    display: 'grid',
    gridGap: '4px',
    textAlign: 'center',
    justifyItems: 'center',
    width: '102px',
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
    padding: '10px',
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
    color: theme.palette.type === 'dark' ? '#3b2492' : '#fff',
  },
}));

const ServiceWarning = ({ text }: { text: string }) => {
  const classes = useStyles();
  return (
    <div className={classes.warning}>
      <WarningIcon />
      &nbsp;&nbsp;<span>{text}</span>
    </div>
  );
};

const ServiceAnalyticsView = ({
  serviceId,
  startDate,
  endDate,
}: {
  serviceId: string;
  startDate: moment.Moment;
  endDate: moment.Moment;
}) => {
  const {
    loading: analyticsLoading,
    value: analyticsValue = {},
    error: analyticsError,
  } = useServiceAnalytics({
    serviceId,
    startDate: startDate.format('YYYY-MM-DD'),
    endDate: endDate.format('YYYY-MM-DD'),
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

  const startDate = moment().subtract(30, 'days').utc();
  const endDate = moment().utc();

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
    return (
      <ServiceWarning text="There was an issue connecting to FireHydrant." />
    );
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
    <InfoCard className="infoCard">
      {!showServiceDetails && !loading && (
        <ServiceWarning text="This service does not exist in FireHydrant." />
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
              target="_blank"
              variant="outlined"
            >
              View service incidents&nbsp;&nbsp;
              <ExitToAppIcon />
            </MaterialButton>
          </Box>
        </Box>
      )}
      {activeIncidents && activeIncidents?.length > 0 && (
        <Box className={classes.linksContainer}>
          {incidents &&
            incidents?.slice(0, 5).map((incident: Incident, index: number) => (
              <div key={index}>
                <a className={classes.link} href={incident.incident_url}>
                  {incident.name}
                </a>
              </div>
            ))}
        </Box>
      )}
      <Box paddingLeft="16px" marginTop="10px">
        <Typography variant="subtitle1">View in FireHydrant </Typography>
        <Box className={classes.buttonContainer} marginTop="10px">
          <a
            target="_blank"
            rel="noopener"
            className={classes.button}
            href={`${BASE_URL}/incidents/new`}
          >
            <AddIcon className={classes.icon} />
            <span>Declare an incident</span>
          </a>
          <a
            target="_blank"
            rel="noopener"
            className={classes.button}
            href={`${BASE_URL}/incidents`}
          >
            <WhatshotIcon className={classes.icon} />
            <span>View all incidents</span>
          </a>
          {showServiceDetails && (
            <a
              target="_blank"
              rel="noopener"
              className={classes.button}
              href={`${BASE_URL}/services/${value?.service?.id}`}
            >
              <NotesIcon className={classes.icon} />
              <span>View Service Details</span>
            </a>
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
