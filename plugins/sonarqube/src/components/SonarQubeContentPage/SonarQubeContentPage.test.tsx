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

import { EntityProvider } from '@backstage/plugin-catalog-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import React from 'react';
import {
  SonarQubeApi,
  sonarQubeApiRef,
} from '@backstage/plugin-sonarqube-react/alpha';
import {
  isSonarQubeAvailable,
  SONARQUBE_PROJECT_KEY_ANNOTATION,
} from '@backstage/plugin-sonarqube-react';

const Providers = ({
  annotation,
  children,
}: { annotation: string } & React.PropsWithChildren<any>): JSX.Element => (
  <TestApiProvider apis={[[sonarQubeApiRef, {} as SonarQubeApi]]}>
    <EntityProvider
      entity={{
        metadata: {
          name: 'mock',
          namespace: 'default',
          annotations: {
            [annotation]: 'foo/bar',
          },
        },
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
      }}
    >
      {children}
    </EntityProvider>
  </TestApiProvider>
);

describe('<SonarQubeContentPage />', () => {
  beforeAll(() => {
    jest.mock('@backstage/plugin-sonarqube', () => ({
      __esModule: true,
      isSonarQubeAvailable,
      EntitySonarQubeCard: () => {
        return <div data-testid="entity-sonarqube-card" />;
      },
    }));
  });

  it('renders EntitySonarQubeCard', async () => {
    const { SonarQubeContentPage } = require('./SonarQubeContentPage');

    const rendered = await renderInTestApp(
      <Providers annotation={SONARQUBE_PROJECT_KEY_ANNOTATION}>
        <SonarQubeContentPage />
      </Providers>,
    );
    expect(rendered.getByText('SonarQube Dashboard')).toBeInTheDocument();
    expect(rendered.getByText('No information to display')).toBeInTheDocument();
    expect(
      rendered.getByText("There is no SonarQube project with key 'bar'."),
    ).toBeInTheDocument();
  }, 15000);

  it('renders MissingAnnotationEmptyState if sonar annotation is missing', async () => {
    const { SonarQubeContentPage } = require('./SonarQubeContentPage');

    const rendered = await renderInTestApp(
      <Providers annotation="foo">
        <SonarQubeContentPage />
      </Providers>,
    );
    expect(rendered.getByText('Missing Annotation')).toBeInTheDocument();
    expect(
      rendered.getAllByText(SONARQUBE_PROJECT_KEY_ANNOTATION, { exact: false })
        .length,
    ).toBe(2);
  }, 15000);
});
