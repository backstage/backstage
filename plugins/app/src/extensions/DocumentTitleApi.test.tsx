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

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderTestApp } from '@backstage/frontend-test-utils';
import {
  PageBlueprint,
  SubPageBlueprint,
  createFrontendPlugin,
} from '@backstage/frontend-plugin-api';
import { usePageTitle } from '@backstage/frontend-plugin-api/alpha';
import { ConfigReader } from '@backstage/config';
import { useState } from 'react';
import { DefaultDocumentTitleApi } from '../apis/DefaultDocumentTitleApi';

function ItemDetails() {
  const [name, setName] = useState('first-item');
  usePageTitle(name);
  return (
    <button type="button" onClick={() => setName('second-item')}>
      Rename
    </button>
  );
}

const plugin = createFrontendPlugin({
  pluginId: 'things',
  title: 'Things',
  extensions: [
    PageBlueprint.make({ params: { path: '/things' } }),
    SubPageBlueprint.make({
      name: 'details',
      params: {
        path: 'details',
        title: 'Details',
        loader: async () => <ItemDetails />,
      },
    }),
    SubPageBlueprint.make({
      name: 'other',
      params: {
        path: 'other',
        title: 'Other',
        loader: async () => <div>Other content</div>,
      },
    }),
  ],
});

describe('DocumentTitleApi', () => {
  afterEach(() => {
    document.title = '';
  });

  it('formats segments using the template', () => {
    const api = new DefaultDocumentTitleApi({
      configApi: new ConfigReader({ app: { title: 'My Portal' } }),
      template: '{page} | {app}',
      separator: ' | ',
      order: 'innermost-first',
    });
    expect(api.format([])).toBe('My Portal');
    expect(api.format(['Catalog', 'Overview'])).toBe(
      'Overview | Catalog | My Portal',
    );

    const outermostFirst = new DefaultDocumentTitleApi({
      configApi: new ConfigReader({}),
      template: '{app}: {page}',
      separator: ' / ',
      order: 'outermost-first',
    });
    expect(outermostFirst.format(['Catalog', 'Overview'])).toBe(
      'Backstage: Catalog / Overview',
    );

    // Titles are inserted literally
    const literal = new DefaultDocumentTitleApi({
      configApi: new ConfigReader({ app: { title: 'Portal $$' } }),
      template: '{page} | {app}',
      separator: ' | ',
      order: 'innermost-first',
    });
    expect(literal.format(['Cost $&', 'About {app}'])).toBe(
      'About {app} | Cost $& | Portal $$',
    );
  });

  it('follows changes to the app title, and only writes changed titles', () => {
    let appTitle = 'First Portal';
    let onChange: () => void = () => {};
    const configApi = Object.assign(new ConfigReader({}), {
      getOptionalString: () => appTitle,
      subscribe(listener: () => void) {
        onChange = listener;
        return { unsubscribe: () => {} };
      },
    });
    const titleSetter = jest.spyOn(document, 'title', 'set');
    const api = new DefaultDocumentTitleApi({
      configApi,
      template: '{page} | {app}',
      separator: ' | ',
      order: 'innermost-first',
    });

    // Nothing is written until the first title is set
    appTitle = 'Second Portal';
    onChange();
    expect(titleSetter).not.toHaveBeenCalled();

    api.setTitle({ segments: ['Catalog'] });
    api.setTitle({ segments: ['Catalog'] });
    expect(titleSetter).toHaveBeenCalledTimes(1);
    expect(document.title).toBe('Catalog | Second Portal');

    onChange();
    expect(titleSetter).toHaveBeenCalledTimes(1);

    appTitle = 'Third Portal';
    onChange();
    expect(titleSetter).toHaveBeenCalledTimes(2);
    expect(document.title).toBe('Catalog | Third Portal');

    titleSetter.mockRestore();
  });

  it('sets the document title from pages and sub-pages, with custom titles replacing defaults', async () => {
    renderTestApp({
      features: [plugin],
      config: { app: { title: 'My Portal' } },
      initialRouteEntries: ['/things/details'],
    });

    const titleSetter = jest.spyOn(document, 'title', 'set');
    const rename = await screen.findByRole('button', { name: 'Rename' });
    await waitFor(() =>
      expect(document.title).toBe('first-item | Things | My Portal'),
    );
    // The title is written once the content has loaded, not for every
    // intermediate registration
    const writesAfterLoad = titleSetter.mock.calls.length;
    expect(new Set(titleSetter.mock.calls.map(([t]) => t)).size).toBe(
      writesAfterLoad,
    );

    await userEvent.click(rename);
    await waitFor(() =>
      expect(document.title).toBe('second-item | Things | My Portal'),
    );
    expect(titleSetter).toHaveBeenCalledTimes(writesAfterLoad + 1);

    // Re-rendering with an unchanged title writes nothing
    await userEvent.click(rename);
    expect(titleSetter).toHaveBeenCalledTimes(writesAfterLoad + 1);

    await userEvent.click(screen.getByRole('tab', { name: 'Other' }));
    await screen.findByText('Other content');
    await waitFor(() =>
      expect(document.title).toBe('Other | Things | My Portal'),
    );
    expect(titleSetter).toHaveBeenCalledTimes(writesAfterLoad + 2);
    titleSetter.mockRestore();
  });

  it('can be configured through extension config', async () => {
    renderTestApp({
      features: [plugin],
      config: {
        app: {
          title: 'My Portal',
          extensions: [
            {
              'api:app/document-title': {
                config: {
                  template: '{app} - {page}',
                  order: 'outermost-first',
                },
              },
            },
          ],
        },
      },
      initialRouteEntries: ['/things/other'],
    });

    await screen.findByText('Other content');
    await waitFor(() =>
      expect(document.title).toBe('My Portal - Things | Other'),
    );
  });
});
