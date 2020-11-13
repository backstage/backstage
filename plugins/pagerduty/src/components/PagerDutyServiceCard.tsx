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
import { useApi } from '@backstage/core';
import { Entity } from '@backstage/catalog-model';
import { LinearProgress } from '@material-ui/core';
import { Incidents } from './Incident/Incidents';
import { EscalationPolicy } from './Escalation/EscalationPolicy';
import { TriggerButton } from './TriggerButton';
import { useAsync } from 'react-use';
import { Alert } from '@material-ui/lab';
import { pagerDutyApiRef } from '../api/pagerDutyClient';
import { PagerdutyCard } from './PagerdutyCard';

export const PAGERDUTY_INTEGRATION_KEY = 'pagerduty.com/integration-key';

export const isPluginApplicableToEntity = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[PAGERDUTY_INTEGRATION_KEY]);

type Props = {
  entity: Entity;
};

export const PagerDutyServiceCard = ({ entity }: Props) => {
  const api = useApi(pagerDutyApiRef);

  const { value, loading, error } = useAsync(async () => {
    const integrationKey = entity.metadata.annotations![
      PAGERDUTY_INTEGRATION_KEY
    ];

    const services = await api.getServiceByIntegrationKey(integrationKey);
    // TODO check services length
    const service = services[0];
    const incidents = await api.getIncidentsByServiceId(service.id);
    const oncalls = await api.getOnCallByPolicyId(service.escalation_policy.id);
    const users = oncalls.map(item => item.user);

    return {
      incidents,
      users,
      id: service.id,
      name: service.name,
      homepageUrl: service.html_url,
    };
  });

  if (error) {
    return (
      <div>
        <Alert severity="error">
          Error encountered while fetching information. {error.message}
        </Alert>
      </div>
    );
  }

  if (loading) {
    return <LinearProgress />;
  }

  const pagerdutyLink = {
    title: 'View in PagerDuty',
    href: value!.homepageUrl,
  };

  const triggerAlarm = {
    title: 'Trigger Alarm',
    action: <TriggerButton entity={entity} />,
  };

  return (
    <PagerdutyCard
      title="Pagerduty"
      subheader={{ ViewPagerduty: pagerdutyLink, TriggerAlarm: triggerAlarm }}
      content={
        <>
          <Incidents incidents={value!.incidents} />
          <EscalationPolicy users={value!.users} />
        </>
      }
    />
  );
};
