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
import { render, cleanup } from '@testing-library/react';
import RegisterComponentPage from './RegisterComponentPage';
import { ThemeProvider } from '@material-ui/core';
import { lightTheme } from '@backstage/theme';
import { errorApiRef, ApiProvider, ApiRegistry } from '@backstage/core';
import { catalogApiRef } from '@backstage/plugin-catalog';
import { MemoryRouter } from 'react-router-dom';

const errorApi = { post: () => {} };
const catalogApi: jest.Mocked<typeof catalogApiRef.T> = {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  addLocation: jest.fn((_a, _b) => new Promise(() => {})),
  getEntities: jest.fn(),
  getEntityByName: jest.fn(),
  getLocationByEntity: jest.fn(),
  getLocationById: jest.fn(),
  getEntitiesByLocationId: jest.fn(),
};

const setup = () => ({
  rendered: render(
    <MemoryRouter>
      <ApiProvider
        apis={ApiRegistry.from([
          [errorApiRef, errorApi],
          [catalogApiRef, catalogApi],
        ])}
      >
        <ThemeProvider theme={lightTheme}>
          <RegisterComponentPage />
        </ThemeProvider>
      </ApiProvider>
    </MemoryRouter>,
  ),
});
describe('RegisterComponentPage', () => {
  afterEach(() => cleanup());

  it('should render', () => {
    const { rendered } = setup();
    expect(
      rendered.getByText('Register existing component'),
    ).toBeInTheDocument();
  });
});
