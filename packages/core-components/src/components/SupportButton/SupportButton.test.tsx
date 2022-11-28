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
import {
  MockConfigApi,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { act, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { SupportButton } from './SupportButton';

const configApi = new MockConfigApi({
  app: {
    support: {
      url: 'https://github.com',
      items: [
        {
          title: 'Github',
          icon: 'github',
          links: [{ title: 'Github Issues', url: '/issues' }],
        },
      ],
    },
  },
});

const SUPPORT_BUTTON_ID = 'support-button';
const POPOVER_ID = 'support-button-popover';

describe('<SupportButton />', () => {
  it('renders without exploding', async () => {
    await renderInTestApp(<SupportButton />);
    await expect(
      screen.findByTestId(SUPPORT_BUTTON_ID),
    ).resolves.toBeInTheDocument();
  });

  it('supports passing a title', async () => {
    await renderInTestApp(<SupportButton title="Custom title" />);
    fireEvent.click(screen.getByTestId(SUPPORT_BUTTON_ID));
    expect(screen.getByText('Custom title')).toBeInTheDocument();
  });

  it('supports passing link items through props', async () => {
    await renderInTestApp(
      <SupportButton
        items={[
          {
            title: 'Documentation',
            icon: 'description',
            links: [{ title: 'Show docs', url: '/docs' }],
          },
        ]}
      />,
    );

    const supportButton = screen.getByTestId(SUPPORT_BUTTON_ID);
    expect(supportButton).toBeInTheDocument();

    fireEvent.click(supportButton);

    const documentationItem = screen.getByText('Documentation');
    expect(documentationItem).toBeInTheDocument();
  });

  it('shows items from support config', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[configApiRef, configApi]]}>
        <SupportButton />
      </TestApiProvider>,
    );

    const supportButton = screen.getByTestId(SUPPORT_BUTTON_ID);
    expect(supportButton).toBeInTheDocument();

    fireEvent.click(supportButton);

    const defaultGithubSupportConfig = screen.getByText('Github Issues');
    expect(defaultGithubSupportConfig).toBeInTheDocument();
  });

  it('shows popover on click', async () => {
    await renderInTestApp(<SupportButton />);

    await expect(
      screen.findByTestId(SUPPORT_BUTTON_ID),
    ).resolves.toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByTestId(SUPPORT_BUTTON_ID));
    });

    await expect(screen.findByTestId(POPOVER_ID)).resolves.toBeInTheDocument();
  });
});
