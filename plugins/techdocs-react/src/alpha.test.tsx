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
import {
  createExtensionTester,
  renderInTestApp,
} from '@backstage/frontend-test-utils';
import {
  TechDocsReaderLayoutBlueprint,
  TechDocsReaderLayoutProps,
} from './alpha';

describe('TechDocsReaderLayoutBlueprint', () => {
  it('should create an extension with sensible defaults', () => {
    expect(
      TechDocsReaderLayoutBlueprint.make({
        params: { loader: async () => () => <div /> },
      }),
    ).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionDefinition",
        "T": undefined,
        "attachTo": {
          "id": "page:techdocs/reader",
          "input": "layout",
        },
        "configSchema": {
          "parse": [Function],
          "schema": {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "additionalProperties": false,
            "properties": {
              "withHeader": {
                "type": "boolean",
              },
              "withSearch": {
                "type": "boolean",
              },
            },
            "type": "object",
          },
        },
        "disabled": false,
        "factory": [Function],
        "inputs": {},
        "kind": "techdocs-reader-layout",
        "name": undefined,
        "output": [
          [Function],
        ],
        "override": [Function],
        "toString": [Function],
        "version": "v2",
      }
    `);
  });

  it('should render the layout component', async () => {
    const MockLayout = () => <div data-testid="mock-layout">Mock Layout</div>;

    const extension = TechDocsReaderLayoutBlueprint.make({
      params: { loader: async () => MockLayout },
    });

    const tester = createExtensionTester(extension);

    renderInTestApp(tester.reactElement());

    await waitFor(() => {
      expect(screen.getByTestId('mock-layout')).toBeInTheDocument();
      expect(screen.getByText('Mock Layout')).toBeInTheDocument();
    });
  });

  it('should pass withHeader config to the layout component', async () => {
    const MockLayout = ({ withHeader }: TechDocsReaderLayoutProps) => (
      <div data-testid="mock-layout">
        {withHeader ? 'Header Enabled' : 'Header Disabled'}
      </div>
    );

    const extension = TechDocsReaderLayoutBlueprint.make({
      params: { loader: async () => MockLayout },
    });

    const tester = createExtensionTester(extension, {
      config: { withHeader: false },
    });

    renderInTestApp(tester.reactElement());

    await waitFor(() => {
      expect(screen.getByText('Header Disabled')).toBeInTheDocument();
    });
  });

  it('should pass withSearch config to the layout component', async () => {
    const MockLayout = ({ withSearch }: TechDocsReaderLayoutProps) => (
      <div data-testid="mock-layout">
        {withSearch ? 'Search Enabled' : 'Search Disabled'}
      </div>
    );

    const extension = TechDocsReaderLayoutBlueprint.make({
      params: { loader: async () => MockLayout },
    });

    const tester = createExtensionTester(extension, {
      config: { withSearch: false },
    });

    renderInTestApp(tester.reactElement());

    await waitFor(() => {
      expect(screen.getByText('Search Disabled')).toBeInTheDocument();
    });
  });

  it('should pass all config options to the layout component', async () => {
    const MockLayout = ({
      withHeader,
      withSearch,
    }: TechDocsReaderLayoutProps) => (
      <div data-testid="mock-layout">
        <span data-testid="header-status">
          {withHeader === false ? 'no-header' : 'with-header'}
        </span>
        <span data-testid="search-status">
          {withSearch === false ? 'no-search' : 'with-search'}
        </span>
      </div>
    );

    const extension = TechDocsReaderLayoutBlueprint.make({
      params: { loader: async () => MockLayout },
    });

    const tester = createExtensionTester(extension, {
      config: { withHeader: false, withSearch: false },
    });

    renderInTestApp(tester.reactElement());

    await waitFor(() => {
      expect(screen.getByTestId('header-status')).toHaveTextContent(
        'no-header',
      );
      expect(screen.getByTestId('search-status')).toHaveTextContent(
        'no-search',
      );
    });
  });

  it('should allow naming the extension', () => {
    const extension = TechDocsReaderLayoutBlueprint.make({
      name: 'custom-layout',
      params: { loader: async () => () => <div /> },
    });

    expect(extension.toString()).toContain('techdocs-reader-layout');
    expect(extension.toString()).toContain('custom-layout');
  });
});
