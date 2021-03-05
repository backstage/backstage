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
import { wrapInTestApp } from '@backstage/test-utils';
import { OwnedContent } from './OwnedContent';

jest.mock('../hooks', () => ({
  useOwnUser: () => {
    return {
      value: {
        apiVersion: 'version',
        kind: 'User',
        metadata: {
          name: 'owned',
          namespace: 'default',
        },
        relations: [
          {
            target: {
              kind: 'TestKind',
              name: 'testName',
            },
            type: 'ownerOf',
          },
        ],
      },
    };
  },
}));

describe('TechDocs Owned Content', () => {
  it('should render TechDocs Owned Documents', async () => {
    const { findByText, queryByText } = render(
      wrapInTestApp(
        <OwnedContent
          entities={[
            {
              apiVersion: 'version',
              kind: 'TestKind',
              metadata: {
                name: 'testName',
              },
              spec: {
                owner: 'user:owned',
              },
              relations: [
                {
                  target: {
                    kind: 'user',
                    namespace: 'default',
                    name: 'owned',
                  },
                  type: 'ownedBy',
                },
              ],
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
              relations: [
                {
                  target: {
                    kind: 'user',
                    namespace: 'default',
                    name: 'not-owned',
                  },
                  type: 'ownedBy',
                },
              ],
            },
          ]}
        />,
      ),
    );

    expect(await findByText('Owned documents')).toBeInTheDocument();
    expect(await findByText(/Access your documentation./i)).toBeInTheDocument();
    expect(await findByText('testName')).toBeInTheDocument();
    expect(await queryByText('testName2')).not.toBeInTheDocument();
  });

  it('should render empty state if no owned documents exist', async () => {
    const { findByText } = render(
      wrapInTestApp(<OwnedContent entities={[]} />),
    );

    expect(await findByText('No documents to show')).toBeInTheDocument();
  });
});
