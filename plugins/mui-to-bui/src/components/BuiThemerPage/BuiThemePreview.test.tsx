/*
 * Copyright 2025 The Backstage Authors
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

import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderInTestApp } from '@backstage/test-utils';
import { BuiThemePreview } from './BuiThemePreview';

describe('BuiThemePreview', () => {
  it('renders headings and sample components', async () => {
    const { container } = await renderInTestApp(
      <BuiThemePreview
        mode="light"
        styleObject={{
          '--bui-bg-neutral-2': '#ffffff',
          '--bui-border-2': '#cccccc',
          '--bui-radius-2': '4px',
          '--bui-space-3': '12px',
          '--bui-fg-secondary': '#777777',
          '--bui-bg-solid': '#000000',
          '--bui-fg-solid': '#ffffff',
          '--bui-fg-primary': '#111111',
          '--bui-bg-neutral-1': '#f5f5f5',
        }}
      />,
    );

    expect(container.firstChild).toHaveAttribute('data-theme-mode', 'light');
    expect(await screen.findByText('Button Variants')).toBeInTheDocument();
    expect(screen.getByText('Button Variants')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Primary' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Secondary' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Tertiary' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Form Inputs')).toBeInTheDocument();
    expect(screen.getByText('Tag Variants')).toBeInTheDocument();
    expect(screen.getByText('Text Variants')).toBeInTheDocument();
  });
});
