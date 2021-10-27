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

import { configApiRef } from '@backstage/core-plugin-api';
import { renderInTestApp } from '@backstage/test-utils';
import React from 'react';
import { AsyncApiDefinitionWidget } from './AsyncApiDefinitionWidget';

const response = {
  type: 'record',
  name: 'User',
  namespace: 'com.example.avro',
  doc:
    'Extract of the demo schema from [Avrodoc](https://github.com/ept/avrodoc)!',
  fields: [
    {
      name: 'id',
      doc: 'System-assigned numeric user ID. Cannot be changed by the user.',
      type: 'int',
    },
    {
      name: 'username',
      doc: 'The username chosen by the user. Can be changed by the user.',
      type: 'string',
    },
    {
      name: 'passwordHash',
      doc:
        "The user's password, hashed using [scrypt](http://www.tarsnap.com/scrypt.html).",
      type: 'string',
    },
  ],
};

const fetckMock = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(response),
    text: () => Promise.resolve(response),
  }),
) as jest.Mock;
global.fetch = fetckMock;

// Hacky way to mock a specific config value.
const getOptionalMock = jest.fn((key: string) => {
  if (key === 'apiDocs.asyncApi.fetcherConfig') {
    return {
      order: 199,
      canReadValue: '^https?://[^\\s$.?#].[^\\s]*$',
      fetchOptions: {
        headers: {
          EXAMPLE: 'my-value',
        },
      },
    };
  }
  return {};
});

jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: (apiRef: any) => {
    const actualUseApi = jest.requireActual('@backstage/core-plugin-api')
      .useApi;
    const actualApi = actualUseApi(apiRef);
    if (apiRef === configApiRef) {
      const configReader = actualApi;
      configReader.getOptional = getOptionalMock;
      return configReader;
    }

    return actualApi;
  },
}));

describe('<AsyncApiDefinitionWidget />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
      <AsyncApiDefinitionWidget definition={definition} />,
    );

    expect(getByText(/Account Service/i)).toBeInTheDocument();
    expect(getByText(/user\/signedup/i)).toBeInTheDocument();
    expect(getByText(/UserSignedUp/i)).toBeInTheDocument();
    expect(getAllByText(/displayName/i)).toHaveLength(4);
  });

  it('renders error if definition is missing', async () => {
    const { getByText } = await renderInTestApp(
      <AsyncApiDefinitionWidget definition="" />,
    );
    expect(getByText(/Error/i)).toBeInTheDocument();
    expect(getByText(/Document can't be null or falsey/i)).toBeInTheDocument();
  });

  it('renders asyncapi spec with external schema', async () => {
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
      schemaFormat: "application/vnd.apache.avro;version=1.9.0"
      contentType: avro
      payload:
        - $ref: "https://raw.githubusercontent.com/ept/avrodoc/master/schemata/example.avsc"
    `;

    const { getAllByText } = await renderInTestApp(
      <AsyncApiDefinitionWidget definition={definition} />,
    );

    expect(fetckMock.mock.calls[0][0]).toBe(
      'https://raw.githubusercontent.com/ept/avrodoc/master/schemata/example.avsc',
    );
    expect(fetckMock.mock.calls[0][1]).toHaveProperty('headers');
    expect(fetckMock.mock.calls[0][1].headers).toHaveProperty('EXAMPLE');
    expect(getAllByText(/username/i)).toHaveLength(6);
  });
});
