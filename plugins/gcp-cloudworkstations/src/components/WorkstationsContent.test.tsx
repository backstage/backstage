/*
 * Copyright 2024 The Backstage Authors
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

import { alertApiRef, googleAuthApiRef } from '@backstage/core-plugin-api';
import { TestApiProvider, renderInTestApp } from '@backstage/test-utils';
import React from 'react';
import { Workstation, WorkstationState, cloudWorkstationsApiRef } from '../api';
import { WorkstationsContent } from './WorkstationsContent';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import userEvent from '@testing-library/user-event';
import { WorkstationConfig } from './types';

describe('WorkstationsContent', () => {
  const workstationsConfigString =
    'projects/analog-foundry-410617/locations/us-west1/workstationClusters/cluster-lr6umul5/workstationConfigs/config-lr6unih7';

  const workstationsConfigDetailsSample: WorkstationConfig = {
    name: 'config-name',
    container: {
      image: 'test-container/image',
    },
    host: {
      gceInstance: {
        machineType: 'small-vm-instance',
      },
    },
    persistentDirectories: [
      {
        gcePd: {
          diskType: 'standard',
          fsType: 'ext4',
          sizeGb: 200,
        },
      },
    ],
  };

  const workstationsSample: Workstation[] = [
    {
      name: 'workstation-1',
      uid: 'workstation-1',
      host: 'workstation-lr6w8c3q.cluster-qttyg5he7nfaaw7m7zxlqico7q.cloudworkstations.dev',
      state: 'STATE_RUNNING',
    },
  ];

  const cloudWorkstationsApi = {
    validWorkstationsConfigString: jest.fn(() => true),
    getWorkstations: jest.fn(() => Promise.resolve(workstationsSample)),
    getWorkstationConfigDetails: jest.fn(() =>
      Promise.resolve(workstationsConfigDetailsSample),
    ),
    getWorkstationsIAmPermissions: jest.fn(),
    startWorkstation: jest.fn(),
    stopWorkstation: jest.fn(),
    createWorkstation: jest.fn(),
  };

  const renderTestWorkstationsContentComponent = () => {
    const googleAuthApi = {
      getProfile: jest.fn(() =>
        Promise.resolve({
          email: 'backstaget@google.com',
          name: 'backstage test',
        }),
      ),
      getAccessToken: jest.fn(() => Promise.resolve('token')),
    };

    const alertApi = {
      post: jest.fn(),
    };

    return renderInTestApp(
      <TestApiProvider
        apis={[
          [googleAuthApiRef, googleAuthApi],
          [alertApiRef, alertApi],
          [cloudWorkstationsApiRef, cloudWorkstationsApi],
        ]}
      >
        <EntityProvider
          entity={{
            apiVersion: 'v1',
            kind: 'Component',
            metadata: {
              name: 'SampleComponent',
              annotations: {
                'google.com/cloudworkstations-config': workstationsConfigString,
              },
            },
          }}
        >
          <WorkstationsContent />
        </EntityProvider>
      </TestApiProvider>,
    );
  };

  it('renders workstations config details correctly', async () => {
    const renderResult = await renderTestWorkstationsContentComponent();
    expect(
      renderResult.getByText(workstationsConfigDetailsSample.container.image),
    ).toBeInTheDocument();
    expect(
      renderResult.getByText(
        workstationsConfigDetailsSample.host.gceInstance.machineType,
      ),
    ).toBeInTheDocument();
    workstationsConfigDetailsSample.persistentDirectories.forEach(directory => {
      expect(
        renderResult.getByText(
          `${directory.gcePd.diskType} ${directory.gcePd.sizeGb} GB ${directory.gcePd.fsType}`,
        ),
      ).toBeInTheDocument();
    });
  });

  it('renders workstations info on list correctly', async () => {
    const renderResult = await renderTestWorkstationsContentComponent();
    expect(
      renderResult.getByText(workstationsSample[0].name),
    ).toBeInTheDocument();
    expect(
      renderResult.getByText(WorkstationState[workstationsSample[0].state]),
    ).toBeInTheDocument();
  });

  it('shows launch/stop workstations action buttons when displaying a running workstation', async () => {
    expect(workstationsSample.length).toBe(1);

    window.open = jest.fn();

    const renderResult = await renderTestWorkstationsContentComponent();

    const launchWorkstationButton = renderResult.getByText('Launch');

    await userEvent.click(launchWorkstationButton);

    expect(window.open).toHaveBeenNthCalledWith(
      1,
      `https://80-${workstationsSample[0].host}`,
      '_blank',
      'popup,width=800,height=600',
    );

    (window.open as jest.Mock).mockRestore();

    const stopWorkstationButton = renderResult.getByText('Stop');

    await userEvent.click(stopWorkstationButton);

    expect(cloudWorkstationsApi.stopWorkstation).toHaveBeenNthCalledWith(
      1,
      workstationsConfigString,
      workstationsSample[0].name,
    );
  });

  it('shows start workstation action button when displaying a stopped workstation', async () => {
    const workstations: Workstation[] = [
      {
        name: 'workstation-0',
        uid: 'workstation-0',
        host: 'workstation0-lr6w8c3q.cluster-qttyg5he7nfaaw7m7zxlqico7q.cloudworkstations.dev',
        state: 'STATE_STOPPED',
      },
    ];

    expect(workstations.length).toBe(1);

    cloudWorkstationsApi.getWorkstations.mockImplementationOnce(() =>
      Promise.resolve(workstations),
    );

    const renderResult = await renderTestWorkstationsContentComponent();

    const startWorkstationButton = renderResult.getByText('Start');

    await userEvent.click(startWorkstationButton);

    expect(cloudWorkstationsApi.startWorkstation).toHaveBeenNthCalledWith(
      1,
      workstationsConfigString,
      workstations[0].name,
    );
  });

  it('calls the workstations API create method when create workstation button is clicked', async () => {
    const renderResult = await renderTestWorkstationsContentComponent();
    const createWorkstationButton =
      renderResult.getByText('Create Workstation');
    expect(createWorkstationButton).toBeInTheDocument();
    await userEvent.click(createWorkstationButton);
    expect(cloudWorkstationsApi.createWorkstation).toHaveBeenNthCalledWith(
      1,
      workstationsConfigString,
    );
  });
});
