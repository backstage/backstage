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
import React from 'react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { BuildDetails, withRequest } from './BuildDetails';
import { xcmetricsApiRef } from '../../api';

jest.mock('../../api/XcmetricsClient');
const client = require('../../api/XcmetricsClient');

jest.mock('../Accordion', () => ({
  Accordion: ({ heading }: { heading: string }) => (
    <div>accordion-{heading}</div>
  ),
}));

jest.mock('../BuildTimeline', () => ({
  BuildTimeline: () => 'BuildTimeline',
}));

describe('BuildDetails', () => {
  it('should render', async () => {
    const rendered = await renderInTestApp(
      <TestApiProvider apis={[[xcmetricsApiRef, client.XcmetricsClient]]}>
        <BuildDetails buildData={client.mockBuildResponse} />
      </TestApiProvider>,
    );

    expect(rendered.getByText('accordion-Host')).toBeInTheDocument();
    expect(rendered.getByText('accordion-Errors')).toBeInTheDocument();
    expect(rendered.getByText('accordion-Warnings')).toBeInTheDocument();
    expect(rendered.getByText('accordion-Metadata')).toBeInTheDocument();
    expect(rendered.getByText('accordion-Timeline')).toBeInTheDocument();

    expect(rendered.getByText(client.mockBuild.id)).toBeInTheDocument();
    expect(
      rendered.getByText(client.mockBuild.projectName),
    ).toBeInTheDocument();
    expect(rendered.getByText(client.mockBuild.schema)).toBeInTheDocument();
  });

  it('should render if xcode data is not present', async () => {
    const rendered = await renderInTestApp(
      <TestApiProvider apis={[[xcmetricsApiRef, client.XcmetricsClient]]}>
        <BuildDetails
          buildData={{ ...client.mockBuildResponse, xcode: undefined }}
        />
      </TestApiProvider>,
    );

    expect(
      rendered.getByText('Xcode').parentNode?.childNodes[1].textContent,
    ).toEqual('Unknown');
  });
});

describe('BuildDetails with request', () => {
  const BuildDetailsWithRequest = withRequest(BuildDetails);

  it('should fetch the build and render', async () => {
    const rendered = await renderInTestApp(
      <TestApiProvider apis={[[xcmetricsApiRef, client.XcmetricsClient]]}>
        <BuildDetailsWithRequest buildId={client.mockBuild.id} />
      </TestApiProvider>,
    );

    expect(rendered.getByText(client.mockBuild.id)).toBeInTheDocument();
  });

  it('should show an error when API not responding', async () => {
    const errorMessage = 'MockErrorMessage';
    client.XcmetricsClient.getBuild = jest
      .fn()
      .mockRejectedValue({ message: errorMessage });

    const rendered = await renderInTestApp(
      <TestApiProvider apis={[[xcmetricsApiRef, client.XcmetricsClient]]}>
        <BuildDetailsWithRequest buildId={client.mockBuild.id} />
      </TestApiProvider>,
    );

    expect(rendered.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should show a message when no build is returned from the API', async () => {
    client.XcmetricsClient.getBuild = jest.fn().mockReturnValue(undefined);

    const rendered = await renderInTestApp(
      <TestApiProvider apis={[[xcmetricsApiRef, client.XcmetricsClient]]}>
        <BuildDetailsWithRequest buildId={client.mockBuild.id} />
      </TestApiProvider>,
    );

    expect(
      rendered.getByText(`Could not load build ${client.mockBuild.id}`),
    ).toBeInTheDocument();
  });
});
