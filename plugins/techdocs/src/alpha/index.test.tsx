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

import { screen, waitFor } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import {
  TechDocsReaderLayoutBlueprint,
  TechDocsReaderLayoutProps,
} from '@backstage/plugin-techdocs-react/alpha';
import techdocsPlugin from './index';

// Mock the TechDocs components to avoid complex setup requirements
jest.mock('../Router', () => ({
  TechDocsReaderRouter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="techdocs-reader-router">{children}</div>
  ),
}));

jest.mock('@backstage/plugin-techdocs-react', () => ({
  ...jest.requireActual('@backstage/plugin-techdocs-react'),
  TechDocsAddons: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="techdocs-addons">{children}</div>
  ),
}));

describe('TechDocs Plugin Alpha - Custom Layout Support', () => {
  it('should render custom layout when provided via TechDocsReaderLayoutBlueprint', async () => {
    const CustomLayout = ({
      withHeader,
      withSearch,
    }: TechDocsReaderLayoutProps) => (
      <div data-testid="custom-layout">
        <span data-testid="header-config">{String(withHeader)}</span>
        <span data-testid="search-config">{String(withSearch)}</span>
        Custom TechDocs Layout
      </div>
    );

    const customLayoutExtension = TechDocsReaderLayoutBlueprint.make({
      name: 'custom',
      params: {
        loader: async () => CustomLayout,
      },
    });

    renderTestApp({
      features: [techdocsPlugin],
      extensions: [customLayoutExtension],
      config: {
        app: {
          extensions: [
            {
              'techdocs-reader-layout:test/custom': {
                config: { withHeader: true, withSearch: false },
              },
            },
          ],
        },
      },
      initialRouteEntries: ['/docs/default/component/test'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('custom-layout')).toBeInTheDocument();
    });

    expect(screen.getByText('Custom TechDocs Layout')).toBeInTheDocument();
    expect(screen.getByTestId('header-config')).toHaveTextContent('true');
    expect(screen.getByTestId('search-config')).toHaveTextContent('false');
  });

  it('should pass config options through to the custom layout', async () => {
    const CustomLayout = ({
      withHeader,
      withSearch,
    }: TechDocsReaderLayoutProps) => (
      <div data-testid="custom-layout">
        <div data-testid="header-status">
          {withHeader === false ? 'Header Hidden' : 'Header Shown'}
        </div>
        <div data-testid="search-status">
          {withSearch === false ? 'Search Hidden' : 'Search Shown'}
        </div>
      </div>
    );

    const customLayoutExtension = TechDocsReaderLayoutBlueprint.make({
      name: 'configurable',
      params: {
        loader: async () => CustomLayout,
      },
    });

    renderTestApp({
      features: [techdocsPlugin],
      extensions: [customLayoutExtension],
      config: {
        app: {
          extensions: [
            {
              'techdocs-reader-layout:test/configurable': {
                config: { withHeader: false, withSearch: false },
              },
            },
          ],
        },
      },
      initialRouteEntries: ['/docs/default/component/test'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('custom-layout')).toBeInTheDocument();
    });

    expect(screen.getByTestId('header-status')).toHaveTextContent(
      'Header Hidden',
    );
    expect(screen.getByTestId('search-status')).toHaveTextContent(
      'Search Hidden',
    );
  });
});
