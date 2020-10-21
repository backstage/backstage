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
import { InfoCard, MissingAnnotationEmptyState } from '@backstage/core';
import { Entity } from '@backstage/catalog-model';
import { Grid } from '@material-ui/core';
import { Incidents } from './Incidents';
import { EscalationPolicy } from './Escalation';
import { PagerDutyData } from './types';
import { TriggerButton } from './TriggerButton';

export const PAGERDUTY_INTEGRATION_KEY = 'pagerduty.com/integration-key';

export const isPluginApplicableToEntity = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[PAGERDUTY_INTEGRATION_KEY]);

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

  const {
    activeIncidents,
    escalationPolicy,
    homepageUrl,
  } = mockData.pagerDutyServices[0];

  const link = {
    title: 'View in PagerDuty',
    link: homepageUrl,
  };

  return !isPluginApplicableToEntity(entity) ? (
    <MissingAnnotationEmptyState annotation={PAGERDUTY_INTEGRATION_KEY} />
  ) : (
    <InfoCard title="PagerDuty" deepLink={link}>
      <Incidents incidents={activeIncidents} />
      <EscalationPolicy escalation={escalationPolicy} />
      <Grid container item xs={12} justify="flex-end">
        <TriggerButton entity={entity} />
      </Grid>
    </InfoCard>
  );
};
