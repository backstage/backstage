/*
 * Copyright 2024 The Backstage Authors
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

import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { SignInPageBlueprint } from '@backstage/plugin-app-react';
import { render, screen, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import { appModulePublicSignIn } from './appModulePublicSignIn';
import { mockApis } from '@backstage/test-utils';
import { createApp } from '@backstage/frontend-defaults';

describe('appModulePublicSignIn', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render a sign-in page', async () => {
    const app = createApp({
      advanced: {
        configLoader: async () => ({ config: mockApis.config() }),
      },
      features: [
        appModulePublicSignIn,
        createFrontendModule({
          pluginId: 'app',
          extensions: [
            SignInPageBlueprint.make({
              params: {
                loader: async () => () => <div>Sign in page</div>,
              },
            }),
          ],
        }),
      ],
    });

    render(app.createRoot());

    await expect(
      screen.findByText('Sign in page'),
    ).resolves.toBeInTheDocument();
  });

  it('should render the form redirect on sign-in', async () => {
    const submitSpy = jest
      .spyOn(HTMLFormElement.prototype, 'submit')
      .mockReturnValue();

    const app = createApp({
      advanced: {
        configLoader: async () => ({ config: mockApis.config() }),
      },
      features: [
        appModulePublicSignIn,
        createFrontendModule({
          pluginId: 'app',
          extensions: [
            SignInPageBlueprint.make({
              params: {
                loader:
                  async () =>
                  ({ onSignInSuccess }) => {
                    useEffect(() => {
                      onSignInSuccess(
                        mockApis.identity({ token: 'mock-token' }),
                      );
                    }, [onSignInSuccess]);
                    return <div />;
                  },
              },
            }),
          ],
        }),
      ],
    });

    const { baseElement } = render(app.createRoot());

    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalled();
    });

    expect(baseElement).toMatchInlineSnapshot(`
      <body
        data-theme-mode="light"
        data-theme-name="backstage"
        data-unified-theme-stack="[{"mode":"light","name":"backstage"}]"
      >
        <div>
          <form
            action="http://localhost/"
            method="POST"
            style="visibility: hidden;"
          >
            <input
              name="type"
              type="hidden"
              value="sign-in"
            />
            <input
              name="token"
              type="hidden"
              value="mock-token"
            />
            <input
              type="submit"
              value="Continue"
            />
          </form>
        </div>
      </body>
    `);
  });
});
