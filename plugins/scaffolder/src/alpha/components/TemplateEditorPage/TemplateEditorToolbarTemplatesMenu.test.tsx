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

import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderInTestApp } from '@backstage/test-utils';
import {
  TemplateEditorToolbarTemplatesMenu,
  TemplateOption,
} from './TemplateEditorToolbarTemplatesMenu';

describe('TemplateEditorToolbarTemplatesMenu', () => {
  const options: TemplateOption[] = [
    {
      label: 'Create React App Template',
      value: {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Template',
        metadata: {
          namespace: 'default',
          name: 'create-react-app-template',
          title: 'Create React App Template',
        },
        spec: {
          parameters: [
            {
              title: 'Provide some simple information',
              required: ['component_id', 'owner'],
              properties: {
                component_id: {
                  title: 'Name',
                  type: 'string',
                  description: 'Unique name of the component',
                  'ui:field': 'EntityNamePicker',
                },
                description: {
                  title: 'Description',
                  type: 'string',
                  description:
                    'Help others understand what this website is for.',
                },
                owner: {
                  title: 'Owner',
                  type: 'string',
                  description: 'Owner of the component',
                  'ui:field': 'OwnerPicker',
                  'ui:options': {
                    allowedKinds: ['Group'],
                  },
                },
              },
            },
            {
              title: 'Choose a location',
              required: ['repoUrl'],
              properties: {
                repoUrl: {
                  title: 'Repository Location',
                  type: 'string',
                  'ui:field': 'RepoUrlPicker',
                  'ui:options': {
                    allowedHosts: ['github.com'],
                  },
                },
              },
            },
          ],
          steps: [
            {
              id: 'template',
              name: 'Fetch Skeleton + Template',
              action: 'fetch:template',
              input: {
                url: './skeleton',
                copyWithoutRender: ['.github/workflows/*'],
                values: {
                  component_id: '${{ parameters.component_id }}',
                  description: '${{ parameters.description }}',
                  destination: '${{ parameters.repoUrl | parseRepoUrl }}',
                  owner: '${{ parameters.owner }}',
                },
              },
            },
            {
              id: 'publish',
              name: 'Publish',
              action: 'publish:github',
              input: {
                allowedHosts: ['github.com'],
                description: 'This is ${{ parameters.component_id }}',
                repoUrl: '${{ parameters.repoUrl }}',
              },
            },
            {
              id: 'register',
              name: 'Register',
              action: 'catalog:register',
              input: {
                repoContentsUrl: '${{ steps.publish.output.repoContentsUrl }}',
                catalogInfoPath: '/catalog-info.yaml',
              },
            },
          ],
          output: {
            links: [
              {
                title: 'Repository',
                url: '${{ steps.publish.output.remoteUrl }}',
              },
              {
                title: 'Open in catalog',
                icon: 'catalog',
                entityRef: '${{ steps.register.output.entityRef }}',
              },
            ],
          },
        },
      },
    },
    {
      label: 'React SSR Template',
      value: {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Template',
        metadata: {
          namespace: 'default',
          name: 'react-ssr-template',
          title: 'React SSR Template',
        },
        spec: {
          parameters: [
            {
              title: 'Provide some simple information',
              required: ['component_id', 'owner'],
              properties: {
                component_id: {
                  title: 'Name',
                  type: 'string',
                  description: 'Unique name of the component',
                  'ui:field': 'EntityNamePicker',
                },
                description: {
                  title: 'Description',
                  type: 'string',
                  description:
                    'Help others understand what this website is for.',
                },
                owner: {
                  title: 'Owner',
                  type: 'string',
                  description: 'Owner of the component',
                  'ui:field': 'OwnerPicker',
                  'ui:options': {
                    allowedKinds: ['Group'],
                  },
                },
              },
            },
            {
              title: 'Choose a location',
              required: ['repoUrl'],
              properties: {
                repoUrl: {
                  title: 'Repository Location',
                  type: 'string',
                  'ui:field': 'RepoUrlPicker',
                  'ui:options': {
                    allowedHosts: ['github.com'],
                  },
                },
              },
            },
          ],
          steps: [
            {
              id: 'template',
              name: 'Fetch Skeleton + Template',
              action: 'fetch:template',
              input: {
                url: './skeleton',
                copyWithoutRender: ['.github/workflows/*'],
                values: {
                  component_id: '${{ parameters.component_id }}',
                  description: '${{ parameters.description }}',
                  destination: '${{ parameters.repoUrl | parseRepoUrl }}',
                  owner: '${{ parameters.owner }}',
                },
              },
            },
            {
              id: 'publish',
              name: 'Publish',
              action: 'publish:github',
              input: {
                allowedHosts: ['github.com'],
                description: 'This is ${{ parameters.component_id }}',
                repoUrl: '${{ parameters.repoUrl }}',
              },
            },
            {
              id: 'register',
              name: 'Register',
              action: 'catalog:register',
              input: {
                repoContentsUrl: '${{ steps.publish.output.repoContentsUrl }}',
                catalogInfoPath: '/catalog-info.yaml',
              },
            },
          ],
          output: {
            links: [
              {
                title: 'Repository',
                url: '${{ steps.publish.output.remoteUrl }}',
              },
              {
                title: 'Open in catalog',
                icon: 'catalog',
                entityRef: '${{ steps.register.output.entityRef }}',
              },
            ],
          },
        },
      },
    },
  ];

  const onSelectOption = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render an item for each option', async () => {
    await renderInTestApp(
      <TemplateEditorToolbarTemplatesMenu
        options={options}
        onSelectOption={onSelectOption}
      />,
    );

    for (const option of options) {
      expect(
        screen.queryByRole('menuitem', { name: option.label }),
      ).not.toBeInTheDocument();
    }

    await userEvent.click(screen.getByRole('button', { name: 'Templates' }));

    for (const option of options) {
      expect(
        screen.getByRole('menuitem', { name: option.label }),
      ).toBeInTheDocument();
    }
  });

  it('should call "onSelectOption" when a option is selected', async () => {
    await renderInTestApp(
      <TemplateEditorToolbarTemplatesMenu
        options={options}
        onSelectOption={onSelectOption}
      />,
    );

    for (const option of options) {
      expect(
        screen.queryByRole('menuitem', { name: option.label }),
      ).not.toBeInTheDocument();
    }

    await userEvent.click(screen.getByRole('button', { name: 'Templates' }));

    await userEvent.click(
      screen.getByRole('menuitem', { name: options[0].label }),
    );

    expect(onSelectOption).toHaveBeenCalledTimes(1);
    expect(onSelectOption).toHaveBeenCalledWith(options[0]);
  });

  it('should highlight the passed selected option', async () => {
    const selectedOption = options[0];

    await renderInTestApp(
      <TemplateEditorToolbarTemplatesMenu
        options={options}
        onSelectOption={onSelectOption}
        selectedOption={selectedOption}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Templates' }));

    expect(
      screen.getByRole('menuitem', { name: selectedOption.label }),
    ).toHaveAttribute('aria-selected', 'true');

    for (const option of options.splice(1)) {
      expect(
        screen.getByRole('menuitem', { name: option.label }),
      ).toHaveAttribute('aria-selected', 'false');
    }
  });
});
