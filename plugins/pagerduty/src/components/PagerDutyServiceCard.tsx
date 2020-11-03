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
import { InfoCard, useApi, configApiRef } from '@backstage/core';
import { Entity } from '@backstage/catalog-model';
import { Grid, LinearProgress } from '@material-ui/core';
import { Incidents } from './Incidents';
import { EscalationPolicy } from './Escalation';
import { TriggerButton } from './TriggerButton';
import { useAsync } from 'react-use';
import {
  getServiceByIntegrationKey,
  getIncidentsByServiceId,
  getOncallByPolicyId,
} from '../api/pagerDutyClient';

export const PAGERDUTY_INTEGRATION_KEY = 'pagerduty.com/integration-key';

export const isPluginApplicableToEntity = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[PAGERDUTY_INTEGRATION_KEY]);

type Props = {
  entity: Entity;
};

export const PagerDutyServiceCard = ({ entity }: Props) => {
  const configApi = useApi(configApiRef);

  // TODO: handle missing token
  const token = configApi.getOptionalString('pagerduty.api.token') ?? undefined;
  console.log({ token });

  const { value, loading, error } = useAsync(async () => {
    const integrationKey = entity.metadata.annotations![
      PAGERDUTY_INTEGRATION_KEY
    ];

    const service = await getServiceByIntegrationKey(integrationKey, token);
    const incidents = await getIncidentsByServiceId(
      (service as any).id /*// TODO: fix type */,
      token,
    );
    const oncalls = await getOncallByPolicyId(
      (service as any).escalation_policy.id, // TODO: fix type
      token,
    );

    return {
      pagerDutyServices: [
        {
          activeIncidents: incidents,
          escalationPolicy: oncalls,
          id: service.id,
          name: service.name,
          homepageUrl: service.html_url,
        },
      ],
    };
  });

  if (error) {
    // TODO: use the errorApi
    console.log(error);
    throw new Error(`Error in getting data: ${error.message}`);
  }

  if (loading) {
    return <LinearProgress />;
  }

  const {
    activeIncidents,
    escalationPolicy,
    homepageUrl,
  } = value!.pagerDutyServices[0]!;

  const link = {
    title: 'View in PagerDuty',
    link: homepageUrl,
  };

  return (
    <InfoCard title="PagerDuty" deepLink={link}>
      <Incidents incidents={activeIncidents.incidents} />
      <EscalationPolicy escalation={escalationPolicy.oncalls} />
      <Grid container item xs={12} justify="flex-end">
        <TriggerButton entity={entity} />
      </Grid>
      {/* todo show something when we dont have token */}
    </InfoCard>
  );
};
