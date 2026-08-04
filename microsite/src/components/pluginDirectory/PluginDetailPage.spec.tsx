/*
 * Copyright 2026 The Backstage Authors
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
import type { PluginData } from '../../pluginDirectory/manifest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PluginDetailPage from './PluginDetailPage';

const plugin: PluginData = {
  title: 'Example Plugin',
  author: 'Example Maintainers',
  authorUrl: 'https://example.com',
  category: 'Tooling',
  description: 'Adds example features to Backstage.',
  documentation: 'https://example.com/docs',
  npmPackageName: '@example/plugin-example',
  addedDate: '2026-01-20',
  status: 'active',
  slug: 'example-plugin',
  isNew: false,
  setup: {
    config: {
      schema: {
        type: 'object',
        properties: {
          endpoint: { type: 'string', 'x-ui': { label: 'Endpoint' } },
        },
        required: ['endpoint'],
      },
    },
  },
};

describe('PluginDetailPage', () => {
  it('renders the header and all three tabs', () => {
    render(<PluginDetailPage plugin={plugin} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Example Plugin',
    );
    expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Install' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Configure' })).toBeInTheDocument();
  });

  it('keeps configuration form values after switching tabs away and back', async () => {
    const user = userEvent.setup();
    render(<PluginDetailPage plugin={plugin} />);

    await user.click(screen.getByRole('tab', { name: 'Configure' }));
    await user.type(screen.getByLabelText('Endpoint'), 'https://api.example.com');

    await user.click(screen.getByRole('tab', { name: 'Overview' }));
    await user.click(screen.getByRole('tab', { name: 'Configure' }));

    expect(screen.getByLabelText('Endpoint')).toHaveValue(
      'https://api.example.com',
    );
  });
});
