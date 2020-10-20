/*
 * Copyright 2020 Spotify AB
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
import React from 'react';
import {
  InfoCard,
  StatusError,
  StatusWarning,
  StatusOK,
} from '@backstage/core';
import { Entity } from '@backstage/catalog-model';
import {
  List,
  ListSubheader,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Tooltip,
  ListItemText,
  makeStyles,
  IconButton,
} from '@material-ui/core';
import moment from 'moment';
import Pagerduty from './pd.svg';
import UserIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';

const useStyles = makeStyles({
  buttonContainer: {},
  denseListIcon: {
    marginRight: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgButtonImage: {
    height: '1em',
  },
});

type IncidentListProps = {
  incidents: any;
};

const IncidentList = ({ incidents }: IncidentListProps) => {
  const classes = useStyles();
  return incidents.map((incident: any) => (
    <ListItem key={incident.id}>
      <ListItemIcon>
        <Tooltip title={incident.status} placement="top">
          <div className={classes.denseListIcon}>
            {incident.status === 'triggered' ? (
              <StatusError />
            ) : (
              <StatusWarning />
            )}
          </div>
        </Tooltip>
      </ListItemIcon>
      <ListItemText
        primary={incident.title}
        secondary={
          <span style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>
            Created {moment(incident.createdAt).fromNow()}, assigned to{' '}
            {(incident.assignees.length && incident.assignees[0].name) ||
              'nobody'}
          </span>
        }
      />
      <ListItemSecondaryAction>
        <Tooltip title="View in PagerDuty" placement="left">
          <IconButton
            href={incident.homepageUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={Pagerduty}
              alt="View in PagerDuty"
              className={classes.svgButtonImage}
            />
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  ));
};

const IncidentsEmptyState = () => {
  const classes = useStyles();
  return (
    <ListItem>
      <ListItemIcon>
        <div className={classes.denseListIcon}>
          <StatusOK />
        </div>
      </ListItemIcon>
      <ListItemText primary="No incidents" secondary="All clear!" />
    </ListItem>
  );
};

type IncidentsProps = {
  incidents: Array<any>;
};
export const Incidents = ({ incidents }: IncidentsProps) => (
  <List dense subheader={<ListSubheader>Incidents</ListSubheader>}>
    {incidents.length ? (
      <IncidentList incidents={incidents} />
    ) : (
      <IncidentsEmptyState />
    )}
  </List>
);

type EscalationProps = {
  escalation: PagerDutyUserData[];
};

const EscalationUsers = ({ escalation }: EscalationProps) => {
  const classes = useStyles();
  const escalations = escalation.map((user, index) => (
    <ListItem key={user.id + index}>
      <ListItemIcon>
        <UserIcon />
      </ListItemIcon>
      <ListItemText primary={user.name} secondary={user.email} />
      <ListItemSecondaryAction>
        <Tooltip title="Send e-mail to user" placement="left">
          <IconButton href={`mailto:${user.email}`}>
            <EmailIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="View in PagerDuty" placement="left">
          <IconButton
            href={user.homepageUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={Pagerduty}
              alt="View in PagerDuty"
              className={classes.svgButtonImage}
            />
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  ));
  return <div>{escalations}</div>;
};

const EscalationUsersEmptyState = () => {
  const classes = useStyles();
  return (
    <ListItem>
      <ListItemIcon>
        <div className={classes.denseListIcon}>
          <StatusWarning />
        </div>
      </ListItemIcon>
      <ListItemText primary="Empty escalation policy" />
    </ListItem>
  );
};

const EscalationPolicy = ({ escalation }: EscalationProps) => (
  <List dense subheader={<ListSubheader>Escalation Policy</ListSubheader>}>
    {escalation.length ? (
      <EscalationUsers escalation={escalation} />
    ) : (
      <EscalationUsersEmptyState />
    )}
  </List>
);

type CardBodyProps = {
  entity: Entity;
  data: PagerDutyData;
};

const CardBody = ({ entity, data }: CardBodyProps) => {
  const { pagerDutyServices } = data;
  const classes = useStyles();

  if (!pagerDutyServices.length) {
    return (
      <div>
        'The specified PagerDuty integration key does not match any PagerDuty
        service.'
      </div>
    );
  }

  const { activeIncidents, escalationPolicy } = pagerDutyServices[0];

  return (
    <>
      <Incidents key="1" incidents={activeIncidents} />
      <EscalationPolicy key="2" escalation={escalationPolicy} />
      <div key="3" className={classes.buttonContainer}>
        {/* <TriggerButton component={entity} /> */}
      </div>
    </>
  );
};

type PagerDutyIncident = {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  homepageUrl: string;
  assignees: Partial<PagerDutyUserData>[];
};

type PagerDutyUserData = {
  email: string;
  name: string;
  homepageUrl: string;
  id: string;
};

type PagerDutyServicesData = {
  activeIncidents: PagerDutyIncident[];
  escalationPolicy: PagerDutyUserData[];
  id: string;
  name: string;
  homepageUrl: string;
};

type PagerDutyData = {
  pagerDutyServices: PagerDutyServicesData[];
};

type Props = {
  entity: Entity;
};

export const PagerDutyServiceCard = ({ entity }: Props) => {
  // TODO: fetch this data
  const mockData: PagerDutyData = {
    pagerDutyServices: [
      {
        activeIncidents: [
          {
            id: 'id',
            title: 'something happened',
            status: 'triggered',
            createdAt: '2020:01:01',
            homepageUrl: 'url',
            assignees: [
              {
                name: 'name',
              },
            ],
          },
        ],
        escalationPolicy: [
          {
            email: 'user@example.com',
            name: 'Name',
            homepageUrl: 'https://spotify.pagerduty.com/users/FOO',
            id: 'user id',
          },
        ],
        id: 'id',
        name: 'name',
        homepageUrl: 'https://spotify.pagety.com/service-directory/BAR',
      },
    ],
  };

  return (
    <InfoCard title="PagerDuty">
      <CardBody entity={entity} data={mockData} />
    </InfoCard>
  );
};

export const isPluginApplicableToEntity = (entity: Entity) => true;
