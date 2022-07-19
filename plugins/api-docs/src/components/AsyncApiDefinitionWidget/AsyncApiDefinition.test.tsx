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

import { renderInTestApp } from '@backstage/test-utils';
import React from 'react';
import { AsyncApiDefinition } from './AsyncApiDefinition';

jest.mock('use-resize-observer', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })),
}));

describe('<AsyncApiDefinition />', () => {
  it('renders asyncapi spec', async () => {
    const definition = `
asyncapi: 2.0.0
info:
  title: Account Service
  version: 1.0.0
channels:
  user/signedup:
    subscribe:
      message:
        $ref: '#/components/messages/UserSignedUp'
components:
  messages:
    UserSignedUp:
      payload:
        type: object
        properties:
          displayName:
            type: string
    `;
    const { getByText, getAllByText } = await renderInTestApp(
      <AsyncApiDefinition definition={definition} />,
    );

    expect(getByText(/Account Service/i)).toBeInTheDocument();
    expect(getByText(/user\/signedup/i)).toBeInTheDocument();
    expect(getAllByText(/UserSignedUp/i)).toHaveLength(2);
    expect(getAllByText(/displayName/i)).toHaveLength(3);
  });
});
