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
import { screen } from '@testing-library/react';
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
    await renderInTestApp(<AsyncApiDefinition definition={definition} />);

    expect(await screen.findByText(/Account Service/i)).toBeInTheDocument();
    expect(await screen.findByText(/user\/signedup/i)).toBeInTheDocument();
    expect(await screen.findAllByText(/UserSignedUp/i)).toHaveLength(2);
    expect(await screen.findAllByText(/displayName/i)).toHaveLength(1);
  });

  it('renders an AsyncAPI 3.1 spec', async () => {
    const definition = `
asyncapi: 3.1.0
info:
  title: Account Service
  version: 1.0.0
  description: This service is in charge of processing user signups
channels:
  userSignedup:
    address: user/signedup
    messages:
      UserSignedUp:
        $ref: '#/components/messages/UserSignedUp'
operations:
  sendUserSignedup:
    action: send
    channel:
      $ref: '#/channels/userSignedup'
    messages:
      - $ref: '#/channels/userSignedup/messages/UserSignedUp'
components:
  messages:
    UserSignedUp:
      payload:
        type: object
        properties:
          displayName:
            type: string
            description: Name of the user
          email:
            type: string
            format: email
            description: Email of the user
    `;

    await renderInTestApp(<AsyncApiDefinition definition={definition} />);

    expect(await screen.findByText(/Account Service/i)).toBeInTheDocument();
    expect(await screen.findAllByText('user/signedup')).not.toHaveLength(0);
    expect(await screen.findByText(/sendUserSignedup/i)).toBeInTheDocument();
    expect(await screen.findAllByText(/displayName/i)).not.toHaveLength(0);
  });

  it('does not resolve external references by default', async () => {
    const fetchMock = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve('type: object'),
      } as any),
    );
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock);

    const definition = `
asyncapi: 2.0.0
info:
  title: Account Service
  version: 1.0.0
channels:
  user/signedup:
    subscribe:
      message:
        $ref: 'https://example.com/messages/UserSignedUp'
`;

    const { findByText, queryByText } = await renderInTestApp(
      <AsyncApiDefinition definition={definition} />,
    );

    // The definition still renders, but the external reference is not
    // resolved: no fetch is made, and the unresolved spot is visible as a
    // placeholder naming the reference that was not loaded.
    expect(await findByText(/Account Service/i)).toBeInTheDocument();
    expect(document.body.textContent).toContain(
      'External reference not resolved: https://example.com/messages/UserSignedUp',
    );
    expect(
      queryByText(/There are errors in your Asyncapi document/i),
    ).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('does not resolve external references with fragments either', async () => {
    const fetchMock = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve('{}'),
      } as any),
    );
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock);

    const definition = `
asyncapi: 2.0.0
info:
  title: Account Service
  version: 1.0.0
channels:
  user/signedup:
    subscribe:
      message:
        payload:
          $ref: 'https://example.com/schemas/User.json#/definitions/User'
`;

    const { findByText } = await renderInTestApp(
      <AsyncApiDefinition definition={definition} />,
    );

    // References into an external document cannot be covered by the
    // placeholder, since the parser resolves the document as a whole and then
    // walks the fragment, which does not exist in the placeholder document.
    // They fail to render with an error naming the reference, but crucially
    // no fetch is made.
    expect(
      await findByText(/There are errors in your Asyncapi document/i),
    ).toBeInTheDocument();
    expect(document.body.textContent).toContain(
      'https://example.com/schemas/User.json',
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('resolves external references using the provided resolvers', async () => {
    const definition = `
asyncapi: 2.0.0
info:
  title: Account Service
  version: 1.0.0
channels:
  user/signedup:
    subscribe:
      message:
        $ref: 'https://example.com/messages/UserSignedUp'
`;

    const read = jest.fn(async () =>
      [
        'payload:',
        '  type: object',
        '  properties:',
        '    displayName:',
        '      type: string',
      ].join('\n'),
    );

    const { getByText, getAllByText, findByText } = await renderInTestApp(
      <AsyncApiDefinition
        definition={definition}
        resolvers={[
          {
            schema: 'https',
            order: 1,
            canRead: true,
            read,
          },
        ]}
      />,
    );

    expect(read).toHaveBeenCalled();
    expect(await findByText(/Account Service/i)).toBeInTheDocument();
    expect(getByText(/user\/signedup/i)).toBeInTheDocument();
    expect(getAllByText(/displayName/i).length).toBeGreaterThan(0);
  });
});
