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

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { RegisterComponentForm } from './RegisterComponentForm';
import {
  githubAuthApiRef,
  ApiProvider,
  ApiRegistry,
  errorApiRef,
} from '@backstage/core';
import { MemoryRouter } from 'react-router-dom';
import { lightTheme } from '@backstage/theme';
import { ThemeProvider } from '@material-ui/core';

const githubApi: jest.Mocked<typeof githubAuthApiRef.T> = {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  getAccessToken: jest.fn(_a => new Promise(() => {})),
  getBackstageIdentity: jest.fn(),
  getProfile: jest.fn(),
  sessionState$: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
};

const errorApi: jest.Mocked<typeof errorApiRef.T> = {
  post: jest.fn(),
  error$: jest.fn(),
};

const Wrapper = ({ children }: { children?: React.ReactNode }) => (
  <MemoryRouter>
    <ApiProvider
      apis={ApiRegistry.with(errorApiRef, errorApi).with(
        githubAuthApiRef,
        githubApi,
      )}
    >
      <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
    </ApiProvider>
  </MemoryRouter>
);

describe('RegisterComponentForm', () => {
  it('should initially render disabled buttons', async () => {
    render(<RegisterComponentForm onSubmit={jest.fn()} />, {
      wrapper: Wrapper,
    });

    expect(
      await screen.findByText(/Enter the full path to the catalog-info.yaml/),
    ).toBeInTheDocument();

    expect(screen.getByText('Validate').closest('button')).toBeDisabled();
    expect(screen.getByText('Register').closest('button')).toBeDisabled();
  });

  it('should enable the submit buttons when the target url is set', async () => {
    render(<RegisterComponentForm onSubmit={jest.fn()} />, {
      wrapper: Wrapper,
    });

    await act(async () => {
      await userEvent.type(
        await screen.findByLabelText('Entity file URL', { exact: false }),
        'https://example.com/blob/master/component.yaml',
      );
    });

    expect(screen.getByText('Validate').closest('button')).not.toBeDisabled();
    expect(screen.getByText('Register').closest('button')).not.toBeDisabled();
  });

  it('should show spinner while submitting', async () => {
    render(<RegisterComponentForm onSubmit={jest.fn()} submitting />, {
      wrapper: Wrapper,
    });

    expect(screen.getByTestId('loading-progress')).toBeInTheDocument();
  });
});
