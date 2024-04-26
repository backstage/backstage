/*
 * Copyright 2020 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';
import { ApiProvider, ConfigReader } from '@backstage/core-app-api';
import {
  alertApiRef,
  ConfigApi,
  configApiRef,
} from '@backstage/core-plugin-api';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { TestApiRegistry, renderInTestApp } from '@backstage/test-utils';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import {
  splunkOnCallApiRef,
  SplunkOnCallClient,
  UnauthorizedError,
} from '../api';
import {
  ESCALATION_POLICIES,
  MOCKED_ON_CALL,
  MOCKED_USER,
  MOCK_INCIDENT,
  MOCK_ROUTING_KEY,
  MOCK_TEAM,
  MOCK_TEAM_NO_INCIDENTS,
} from '../api/mocks';
import { EntitySplunkOnCallCard } from './EntitySplunkOnCallCard';
import { expectTriggeredIncident } from './TriggerDialog/testUtils';

const mockSplunkOnCallApi: Partial<SplunkOnCallClient> = {
  getUsers: async () => [],
  getIncidents: async () => [MOCK_INCIDENT],
  getOnCallUsers: async () => MOCKED_ON_CALL,
  getTeams: async () => [MOCK_TEAM],
  getRoutingKeys: async () => [MOCK_ROUTING_KEY],
  getEscalationPolicies: async () => ESCALATION_POLICIES,
};

const configApi: ConfigApi = new ConfigReader({
  splunkOnCall: {
    eventsRestEndpoint: 'EXAMPLE_REST_ENDPOINT',
  },
});

const apis = TestApiRegistry.from(
  [splunkOnCallApiRef, mockSplunkOnCallApi],
  [configApiRef, configApi],
  [alertApiRef, {}],
);

const mockEntity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'splunkoncall-test',
    annotations: {
      'splunk.com/on-call-team': 'test',
    },
  },
} as Entity;

const mockEntityWithRoutingKeyAnnotation = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'splunkoncall-test',
    annotations: {
      'splunk.com/on-call-routing-key': MOCK_ROUTING_KEY.routingKey,
    },
  },
} as Entity;

const mockEntityNoAnnotation = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'splunkoncall-test',
    annotations: {},
  },
} as Entity;

const mockEntityNoIncidents = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'splunkoncall-test',
    annotations: {
      'splunk.com/on-call-team': 'test-noincidents',
    },
  },
} as Entity;

describe('SplunkOnCallCard', () => {
  it('Render splunkoncall', async () => {
    mockSplunkOnCallApi.getUsers = jest
      .fn()
      .mockImplementationOnce(async () => [MOCKED_USER]);
    mockSplunkOnCallApi.getTeams = jest
      .fn()
      .mockImplementation(async () => [MOCK_TEAM_NO_INCIDENTS]);

    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={mockEntityNoIncidents}>
          <EntitySplunkOnCallCard />
        </EntityProvider>
      </ApiProvider>,
    );
    await waitFor(() => !screen.queryByTestId('progress'));
    expect(screen.getByText('Create Incident')).toBeInTheDocument();
    await waitFor(
      () =>
        expect(
          screen.getByText('Nice! No incidents found!'),
        ).toBeInTheDocument(),
      { timeout: 2000 },
    );
    expect(screen.getByText('Empty escalation policy')).toBeInTheDocument();
  });

  it('does not render a "Create incident" link in read only mode', async () => {
    mockSplunkOnCallApi.getUsers = jest
      .fn()
      .mockImplementationOnce(async () => [MOCKED_USER]);
    mockSplunkOnCallApi.getTeams = jest
      .fn()
      .mockImplementation(async () => [MOCK_TEAM_NO_INCIDENTS]);

    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={mockEntityNoIncidents}>
          <EntitySplunkOnCallCard readOnly />
        </EntityProvider>
      </ApiProvider>,
    );
    await waitFor(() => !screen.queryByTestId('progress'));
    expect(() => screen.getByText('Create Incident')).toThrow();
    await waitFor(
      () =>
        expect(
          screen.getByText('Nice! No incidents found!'),
        ).toBeInTheDocument(),
      { timeout: 2000 },
    );
    expect(screen.getByText('Empty escalation policy')).toBeInTheDocument();
  });

  it('handles a "splunk.com/on-call-routing-key" annotation', async () => {
    mockSplunkOnCallApi.getUsers = jest
      .fn()
      .mockImplementationOnce(async () => [MOCKED_USER]);
    mockSplunkOnCallApi.getRoutingKeys = jest
      .fn()
      .mockImplementationOnce(async () => [MOCK_ROUTING_KEY]);
    mockSplunkOnCallApi.getTeams = jest
      .fn()
      .mockImplementation(async () => [MOCK_TEAM]);
    const mockTriggerAlarmFn = jest.fn();
    mockSplunkOnCallApi.incidentAction = mockTriggerAlarmFn;

    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={mockEntityWithRoutingKeyAnnotation}>
          <EntitySplunkOnCallCard />
        </EntityProvider>
      </ApiProvider>,
    );
    await waitFor(() => !screen.queryByTestId('progress'));
    expect(screen.getByText(`Team: ${MOCK_TEAM.name}`)).toBeInTheDocument();
    expect(screen.getByText('Create Incident')).toBeInTheDocument();
    await waitFor(
      () => expect(screen.getByText('test-incident')).toBeInTheDocument(),
      { timeout: 2000 },
    );

    const createIncidentButton = screen.getByText('Create Incident');
    await act(async () => {
      fireEvent.click(createIncidentButton);
    });
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await expectTriggeredIncident(
      'test-routing-key',
      screen.getByTestId,
      mockTriggerAlarmFn,
    );
  });

  it('Handles custom error for missing token', async () => {
    mockSplunkOnCallApi.getUsers = jest
      .fn()
      .mockRejectedValueOnce(new UnauthorizedError());

    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={mockEntity}>
          <EntitySplunkOnCallCard />
        </EntityProvider>
      </ApiProvider>,
    );
    await waitFor(() => !screen.queryByTestId('progress'));
    expect(
      screen.getByText(
        'Missing or invalid Splunk On-Call API key and/or API id',
      ),
    ).toBeInTheDocument();
  });

  it('handles general error', async () => {
    mockSplunkOnCallApi.getUsers = jest
      .fn()
      .mockRejectedValueOnce(new Error('An error occurred'));
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={mockEntity}>
          <EntitySplunkOnCallCard />
        </EntityProvider>
      </ApiProvider>,
    );
    await waitFor(() => !screen.queryByTestId('progress'));

    expect(
      screen.getByText(
        'Error encountered while fetching information. An error occurred',
      ),
    ).toBeInTheDocument();
  });

  it('handles warning for missing required annotations', async () => {
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={mockEntityNoAnnotation}>
          <EntitySplunkOnCallCard />
        </EntityProvider>
      </ApiProvider>,
    );
    await waitFor(() => !screen.queryByTestId('progress'));
    expect(screen.getAllByText('Missing Annotation').length).toEqual(1);
  });

  it('handles warning for incorrect team annotation', async () => {
    mockSplunkOnCallApi.getUsers = jest
      .fn()
      .mockImplementationOnce(async () => [MOCKED_USER]);
    mockSplunkOnCallApi.getTeams = jest
      .fn()
      .mockImplementationOnce(async () => []);

    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={mockEntity}>
          <EntitySplunkOnCallCard />
        </EntityProvider>
      </ApiProvider>,
    );
    await waitFor(() => !screen.queryByTestId('progress'));
    expect(
      screen.getByText(
        'Splunk On-Call API returned no record of teams associated with the "test" team name',
      ),
    ).toBeInTheDocument();
  });

  it('handles warning for incorrect routing key annotation', async () => {
    mockSplunkOnCallApi.getUsers = jest
      .fn()
      .mockImplementationOnce(async () => [MOCKED_USER]);
    mockSplunkOnCallApi.getRoutingKeys = jest
      .fn()
      .mockImplementationOnce(async () => [MOCK_ROUTING_KEY]);
    mockSplunkOnCallApi.getTeams = jest
      .fn()
      .mockImplementationOnce(async () => []);

    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={mockEntityWithRoutingKeyAnnotation}>
          <EntitySplunkOnCallCard />
        </EntityProvider>
      </ApiProvider>,
    );
    await waitFor(() => !screen.queryByTestId('progress'));
    expect(
      screen.getByText(
        `Splunk On-Call API returned no record of teams associated with the "${MOCK_ROUTING_KEY.routingKey}" routing key`,
      ),
    ).toBeInTheDocument();
  });

  it('opens the dialog when trigger button is clicked', async () => {
    mockSplunkOnCallApi.getUsers = jest
      .fn()
      .mockImplementationOnce(async () => [MOCKED_USER]);
    mockSplunkOnCallApi.getTeams = jest
      .fn()
      .mockImplementationOnce(async () => [MOCK_TEAM]);

    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={mockEntity}>
          <EntitySplunkOnCallCard />
        </EntityProvider>
      </ApiProvider>,
    );
    await waitFor(() => !screen.queryByTestId('progress'));
    expect(screen.getByText('Create Incident')).toBeInTheDocument();
    const triggerButton = screen.getByText('Create Incident');
    await act(async () => {
      fireEvent.click(triggerButton);
    });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
