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

import { lightTheme } from '@backstage/theme';
import { ThemeProvider } from '@material-ui/core';
import { cleanup, render } from '@testing-library/react';
import React, { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { RegisterComponentResultDialog } from './RegisterComponentResultDialog';

const setup = (
  props?: Partial<ComponentProps<typeof RegisterComponentResultDialog>>,
) => ({
  rendered: render(
    <MemoryRouter>
      <ThemeProvider theme={lightTheme}>
        <RegisterComponentResultDialog
          onClose={() => {}}
          entities={[]}
          {...props}
        />
      </ThemeProvider>
    </MemoryRouter>,
  ),
});
describe('RegisterComponentResultDialog', () => {
  afterEach(() => cleanup());

  it('should render', () => {
    const { rendered } = setup();
    expect(
      rendered.getByText('Component Registration Result'),
    ).toBeInTheDocument();
  });
});

it('should show a list of components if success', async () => {
  const { rendered } = setup({
    entities: [
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'Component1',
        },
        spec: {
          type: 'website',
        },
      },
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'Component2',
        },
        spec: {
          type: 'service',
        },
      },
    ],
  });

  expect(
    rendered.getByText(
      'The following components have been succefully created:',
    ),
  ).toBeInTheDocument();
  expect(rendered.getByText('Component1')).toBeInTheDocument();
  expect(rendered.getByText('Component2')).toBeInTheDocument();
});
