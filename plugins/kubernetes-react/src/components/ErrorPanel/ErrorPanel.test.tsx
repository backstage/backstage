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

import React from 'react';
import { screen } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import { ErrorPanel } from './ErrorPanel';

describe('ErrorPanel', () => {
  it('displays path and status code when a cluster has an HTTP error', async () => {
    await renderInTestApp(
      <ErrorPanel
        entityName="THIS_ENTITY"
        clustersWithErrors={[
          {
            cluster: { name: 'THIS_CLUSTER', title: 'This Fine Cluster' },
            resources: [],
            podMetrics: [],
            errors: [
              {
                errorType: 'SYSTEM_ERROR',
                statusCode: 500,
                resourcePath: 'some/resource',
              },
            ],
          },
        ]}
      />,
    );

    // title
    expect(
      screen.getByText(
        'There was a problem retrieving some Kubernetes resources for the entity: THIS_ENTITY. This could mean that the Error Reporting card is not completely accurate.',
      ),
    ).toBeInTheDocument();

    // message
    expect(screen.getByText('Errors:')).toBeInTheDocument();
    expect(screen.getByText('Cluster: This Fine Cluster')).toBeInTheDocument();
    expect(
      screen.getByText(
        "Error fetching Kubernetes resource: 'some/resource', error: SYSTEM_ERROR, status code: 500",
      ),
    ).toBeInTheDocument();
  });

  it('displays message for non-HTTP-status-related fetch errors', async () => {
    await renderInTestApp(
      <ErrorPanel
        entityName="THIS_ENTITY"
        clustersWithErrors={[
          {
            cluster: { name: 'THIS_CLUSTER' },
            resources: [],
            podMetrics: [],
            errors: [
              {
                errorType: 'FETCH_ERROR',
                message: 'description of error',
              },
            ],
          },
        ]}
      />,
    );

    // title
    expect(
      screen.getByText(
        'There was a problem retrieving some Kubernetes resources for the entity: THIS_ENTITY. This could mean that the Error Reporting card is not completely accurate.',
      ),
    ).toBeInTheDocument();

    // message
    expect(screen.getByText('Errors:')).toBeInTheDocument();
    expect(screen.getByText('Cluster: THIS_CLUSTER')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Error communicating with Kubernetes: FETCH_ERROR, message: description of error',
      ),
    ).toBeInTheDocument();
  });

  it('displays error message', async () => {
    await renderInTestApp(
      <ErrorPanel entityName="THIS_ENTITY" errorMessage="SOME_ERROR_MESSAGE" />,
    );

    // title
    expect(
      screen.getByText(
        'There was a problem retrieving some Kubernetes resources for the entity: THIS_ENTITY. This could mean that the Error Reporting card is not completely accurate.',
      ),
    ).toBeInTheDocument();

    // message
    expect(screen.getByText('Errors: SOME_ERROR_MESSAGE')).toBeInTheDocument();
  });
});
