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

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fireEvent, screen, within } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import {
  AppRootElementBlueprint,
  PageBlueprint,
  SubPageBlueprint,
  appLanguageApiRef,
  createTranslationRef,
  createTranslationResource,
  createFrontendModule,
  createFrontendPlugin,
  createRouteRef,
  useApi,
  useBreadcrumbEntries,
} from '@backstage/frontend-plugin-api';
import {
  TranslationBlueprint,
  NavContentBlueprint,
} from '@backstage/plugin-app-react';

it('updates page, tab, breadcrumb, and sorted custom nav titles without remounting content', async () => {
  const titleRef = createTranslationRef({
    id: 'example.titles',
    messages: {
      page: 'APIs',
      overview: 'Overview',
      other: 'Zoo',
      configuredPage: 'Default page title',
      configuredTab: 'Default tab title',
      disabled: 'Disabled',
    },
  });
  const mount = jest.fn();
  const unmount = jest.fn();
  function Content() {
    useEffect(() => {
      mount();
      return unmount;
    }, []);
    const { items } = useBreadcrumbEntries();
    return (
      <div>
        <input aria-label="Page state" defaultValue="preserved" />
        <output aria-label="Breadcrumb labels">
          {items.map(item => item.label).join(' / ')}
        </output>
      </div>
    );
  }
  function Controls() {
    const languageApi = useApi(appLanguageApiRef);
    return (
      <div>
        <button onClick={() => languageApi.setLanguage('sv')}>Swedish</button>
        <button onClick={() => languageApi.setLanguage('en')}>English</button>
        <button onClick={() => languageApi.setLanguage('de')}>
          Empty title
        </button>
      </div>
    );
  }
  const disabledLoader = jest.fn(async () => <div>Disabled content</div>);
  const plugin = createFrontendPlugin({
    pluginId: 'example',
    extensions: [
      PageBlueprint.make({
        params: {
          path: '/example',
          title: titleRef('page'),
          icon: <span />,
          routeRef: createRouteRef(),
        },
      }),
      SubPageBlueprint.make({
        name: 'overview',
        params: {
          path: 'overview',
          title: titleRef('overview'),
          loader: async () => <Content />,
        },
      }),
      SubPageBlueprint.make({
        name: 'configured',
        params: {
          path: 'configured',
          title: titleRef('configuredTab'),
          loader: async () => <div>Configured content</div>,
        },
      }),
      PageBlueprint.make({
        name: 'other',
        params: {
          path: '/other',
          title: titleRef('other'),
          loader: async () => (
            <>
              <div>Other page content</div>
              <Content />
            </>
          ),
          icon: <span />,
          routeRef: createRouteRef(),
        },
      }),
      PageBlueprint.make({
        name: 'configured',
        params: {
          path: '/configured',
          title: titleRef('configuredPage'),
          icon: <span />,
          routeRef: createRouteRef(),
        },
      }),
      PageBlueprint.make({
        name: 'plain',
        params: {
          path: '/plain',
          title: 'Plugin plain page',
          icon: <span />,
          routeRef: createRouteRef(),
        },
      }),
      PageBlueprint.make({
        name: 'disabled',
        disabled: true,
        params: {
          path: '/disabled',
          title: titleRef('disabled'),
          icon: <span />,
          routeRef: createRouteRef(),
          loader: disabledLoader,
        },
      }),
    ],
  });
  renderTestApp({
    features: [
      plugin,
      createFrontendModule({
        pluginId: 'app',
        extensions: [
          AppRootElementBlueprint.make({
            name: 'controls',
            params: { element: <Controls /> },
          }),
          TranslationBlueprint.make({
            name: 'sv',
            params: {
              resource: createTranslationResource({
                ref: titleRef,
                translations: {
                  de: async () => ({
                    default: {
                      page: '',
                      overview: null,
                      other: null,
                      configuredPage: null,
                      configuredTab: null,
                      disabled: null,
                    },
                  }),
                  sv: async () => ({
                    default: {
                      page: 'API-dokumentation',
                      overview: 'Översikt',
                      other: 'AAA',
                      configuredPage: 'Translated page',
                      configuredTab: 'Translated tab',
                      disabled: 'Translated disabled',
                    },
                  }),
                },
              }),
            },
          }),
          NavContentBlueprint.make({
            params: {
              component: ({ navItems }) => (
                <nav aria-label="Custom navigation">
                  {navItems
                    .withComponent(item => (
                      <Link to={item.href}>{item.title}</Link>
                    ))
                    .rest({ sortBy: 'title' })}
                </nav>
              ),
            },
          }),
        ],
      }),
    ],
    initialRouteEntries: ['/example/overview'],
    config: {
      app: {
        baseUrl: 'http://localhost:3000',
        extensions: [
          {
            'api:app/app-language': {
              config: { availableLanguages: ['en', 'sv', 'de'] },
            },
          },
          {
            'page:example/plain': {
              config: { title: 'Configured plain page' },
            },
          },
          {
            'page:example/configured': { config: { title: 'Configured page' } },
          },
          {
            'sub-page:example/configured': {
              config: { title: 'Configured tab' },
            },
          },
        ],
      },
      backend: { baseUrl: 'http://localhost:7007' },
    },
  });
  const nav = await screen.findByRole('navigation', {
    name: 'Custom navigation',
  });
  expect(await screen.findByLabelText('Page state')).toHaveValue('preserved');
  expect(
    within(nav)
      .getAllByRole('link')
      .map(link => link.textContent),
  ).toEqual(['APIs', 'Configured plain page', 'Default page title', 'Zoo']);
  fireEvent.change(screen.getByLabelText('Page state'), {
    target: { value: 'kept across languages' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Swedish' }));
  expect(
    await screen.findByRole('heading', { name: 'API-dokumentation' }),
  ).toBeInTheDocument();
  expect(
    await screen.findByRole('tab', { name: 'Översikt' }),
  ).toBeInTheDocument();
  expect(
    await screen.findByText('API-dokumentation / Översikt'),
  ).toBeInTheDocument();
  expect(
    within(nav)
      .getAllByRole('link')
      .map(link => link.textContent),
  ).toEqual([
    'AAA',
    'API-dokumentation',
    'Configured plain page',
    'Translated page',
  ]);
  expect(
    screen.getByRole('tab', { name: 'Translated tab' }),
  ).toBeInTheDocument();
  expect(screen.queryByText('Translated disabled')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Empty title' }));
  expect(
    await screen.findByText('Overview', { selector: 'output' }),
  ).toBeInTheDocument();
  expect(screen.getByLabelText('Page state')).toHaveValue(
    'kept across languages',
  );
  expect(mount).toHaveBeenCalledTimes(1);
  expect(unmount).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'English' }));
  expect(await screen.findByText('APIs / Overview')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'APIs' })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument();
  expect(
    screen.getByRole('tab', { name: 'Default tab title' }),
  ).toBeInTheDocument();
  expect(screen.getByLabelText('Page state')).toHaveValue(
    'kept across languages',
  );
  expect(mount).toHaveBeenCalledTimes(1);
  expect(unmount).not.toHaveBeenCalled();
  expect(disabledLoader).not.toHaveBeenCalled();
  fireEvent.click(within(nav).getByRole('link', { name: 'Zoo' }));
  expect(await screen.findByText('Other page content')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Page state'), {
    target: { value: 'loader page state' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Swedish' }));
  expect(
    await screen.findByRole('heading', { name: 'AAA' }),
  ).toBeInTheDocument();
  expect(screen.getByLabelText('Page state')).toHaveValue('loader page state');
  expect(mount).toHaveBeenCalledTimes(2);
  expect(unmount).toHaveBeenCalledTimes(1);
  fireEvent.click(within(nav).getByRole('link', { name: 'Translated page' }));
  expect(
    await screen.findByRole('heading', { name: 'Translated page' }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'English' }));
  expect(
    await screen.findByRole('heading', { name: 'Default page title' }),
  ).toBeInTheDocument();
});
