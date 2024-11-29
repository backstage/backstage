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
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { OpenApiDefinition } from './OpenApiDefinition';

describe('<OpenApiDefinition />', () => {
  beforeEach(() => {
    window.open = jest.fn();
  });

  it('renders openapi spec', async () => {
    const definition = `
openapi: "3.0.0"
info:
  version: 1.0.0
  title: Artist API
  license:
    name: MIT
servers:
  - url: http://artist.spotify.net/v1
paths:
  /artists:
    get:
      summary: List all artists
      responses:
        "200":
          description: Success
    `;

    const requestInterceptor = (req: any) => req;

    const { getByText } = await renderInTestApp(
      <OpenApiDefinition
        definition={definition}
        requestInterceptor={requestInterceptor}
      />,
    );

    // swagger-ui loads the documentation asynchronously
    await waitFor(() => {
      expect(getByText(/\/artists/i)).toBeInTheDocument();
      expect(getByText(/List all artists/i)).toBeInTheDocument();
    });
  });

  it('renders openapi spec with oauth2', async () => {
    const user = userEvent.setup();

    const definition = `
openapi: "3.0.0"
info:
  version: 1.0.0
  title: Artist API
  license:
    name: MIT
servers:
  - url: http://artist.spotify.net/v1
components:
  securitySchemes:
    oauth:
      type: oauth2
      description: OAuth2 service
      flows:
        authorizationCode:
          authorizationUrl: https://api.example.com/oauth2/authorize
          tokenUrl: https://api.example.com/oauth2/token
          scopes:
            read_pets: read your pets
            write_pets: modify pets in your account
security:
  oauth:
    - [read_pets, write_pets]
paths:
  /artists:
    get:
      summary: List all artists
      responses:
        "200":
          description: Success
    `;

    const requestInterceptor = (req: any) => req;
    const supportedSubmitMethods = ['get', 'post', 'put', 'delete'];

    const { findByRole, getByRole, getByLabelText } = await renderInTestApp(
      <OpenApiDefinition
        definition={definition}
        requestInterceptor={requestInterceptor}
        supportedSubmitMethods={supportedSubmitMethods}
      />,
    );

    const authorizePopup = await findByRole('button', { name: /authorize/i });

    await user.click(authorizePopup);

    const clientId = getByRole('textbox', { name: /client_id:/i });
    const clientSecret = getByLabelText(/client_secret:/i);

    const readPets = getByRole('checkbox', {
      name: /read_pets read your pets/i,
    });

    await user.type(clientId, 'my-client-id');

    expect(clientId).toHaveValue('my-client-id');

    await user.type(clientSecret, 'my-client-secret');

    expect(clientSecret).toHaveValue('my-client-secret');
    await user.click(readPets);

    expect(readPets).toBeChecked();

    const authorizeButton = await findByRole('button', {
      name: /apply given oauth2 credentials/i,
    });

    await user.click(authorizeButton);

    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining(
        'https://api.example.com/oauth2/authorize?response_type=code&client_id=my-client-id&redirect_uri=http%3A%2F%2Flocalhost%2Foauth2-redirect.html&scope=read_pets&state=',
      ),
    );
  });

  it('renders error if definition is missing', async () => {
    const { getByText } = await renderInTestApp(
      <OpenApiDefinition definition="" />,
    );
    expect(getByText(/No API definition provided/i)).toBeInTheDocument();
  });
});
