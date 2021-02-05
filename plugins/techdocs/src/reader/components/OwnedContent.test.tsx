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
import { render } from '@testing-library/react';

import { ApiProvider, ApiRegistry, identityApiRef } from '@backstage/core';
import { wrapInTestApp } from '@backstage/test-utils';

import { OwnedContent } from './OwnedContent';

describe('TechDocs Owned Content', () => {
  it('should render TechDocs Owned Documents', async () => {
    const identityApi = {
      getUserId: () => 'techdocs@example.com',
    };

    const { findByText, queryByText } = render(
      wrapInTestApp(
        <ApiProvider apis={ApiRegistry.from([[identityApiRef, identityApi]])}>
          <OwnedContent
            value={[
              {
                apiVersion: 'version',
                kind: 'TestKind',
                metadata: {
                  name: 'testName',
                },
                spec: {
                  owner: 'techdocs@example.com',
                },
              },
              {
                apiVersion: 'version',
                kind: 'TestKind2',
                metadata: {
                  name: 'testName2',
                },
                spec: {
                  owner: 'not-owned@example.com',
                },
              },
            ]}
          />
          ,
        </ApiProvider>,
      ),
    );

    expect(await findByText('Owned documents')).toBeInTheDocument();
    expect(await findByText(/Access your documentation./i)).toBeInTheDocument();
    expect(await findByText('testName')).toBeInTheDocument();
    expect(await queryByText('testName2')).not.toBeInTheDocument();
  });

  it('should render empty state if no owned documents exist', async () => {
    const identityApi = {
      getUserId: () => 'techdocs@example.com',
    };

    const { findByText } = render(
      wrapInTestApp(
        <ApiProvider apis={ApiRegistry.from([[identityApiRef, identityApi]])}>
          <OwnedContent value={[]} />,
        </ApiProvider>,
      ),
    );

    expect(await findByText('No documents to show')).toBeInTheDocument();
  });
});
