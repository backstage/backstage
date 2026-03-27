/*
 * Copyright 2023 The Backstage Authors
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

// Polyfill ResizeObserver for JSDOM — required by cmdk's Command component
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof globalThis.ResizeObserver;
}
// Polyfill scrollIntoView for JSDOM — required by cmdk
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function () {};
}

import { waitFor } from '@testing-library/react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { MyGroupsPicker } from './MyGroupsPicker';
import {
  renderInTestApp,
  TestApiProvider,
  mockApis,
} from '@backstage/test-utils';
import {
  catalogApiRef,
  entityPresentationApiRef,
} from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';
import {
  ErrorApi,
  errorApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import userEvent from '@testing-library/user-event';
import { ScaffolderRJSFFieldProps as FieldProps } from '@backstage/plugin-scaffolder-react';
import { DefaultEntityPresentationApi } from '@backstage/plugin-catalog';
import { ComponentType, PropsWithChildren, ReactNode } from 'react';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { scaffolderTranslationRef } from '../../../translation';
import { TooltipProvider } from '@backstage/core-components';

const mockIdentityApi = mockApis.identity({
  userEntityRef: 'user:default/bob',
});

describe('<MyGroupsPicker />', () => {
  let entities: Entity[];
  const onChange = jest.fn();
  const schema = {};
  const required = false;

  const catalogApi = catalogApiMock.mock({
    getEntities: jest.fn(async () => ({ items: entities })),
  });

  const mockErrorApi: jest.Mocked<ErrorApi> = {
    post: jest.fn(),
    error$: jest.fn(),
  };

  beforeEach(() => {
    entities = [
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: { name: 'group1' },
        spec: { members: ['Bob'] },
      },
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: { name: 'group2' },
        spec: { members: ['Bob'] },
      },
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: { name: 'group3' },
        spec: { members: ['Alice'] },
      },
    ];

    onChange.mockClear();
    catalogApi.getEntities.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should only return the groups a user is part of and not the groups a user is not part of', async () => {
    const userGroups = entities.filter(
      entity =>
        entity.spec &&
        Array.isArray(entity.spec.members) &&
        entity.spec.members.includes('Bob'),
    );

    catalogApi.getEntities.mockResolvedValue({ items: userGroups });

    const props = {
      onChange,
      schema,
      required,
      uiSchema: {},
    } as unknown as FieldProps<string>;

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [identityApiRef, mockIdentityApi],
          [catalogApiRef, catalogApi],
          [errorApiRef, mockErrorApi],
          [
            entityPresentationApiRef,
            DefaultEntityPresentationApi.create({ catalogApi }),
          ],
        ]}
      >
        <TooltipProvider>
          <MyGroupsPicker {...props} />
        </TooltipProvider>
      </TestApiProvider>,
    );

    await waitFor(() =>
      expect(catalogApi.getEntities).toHaveBeenCalledTimes(1),
    );

    expect(catalogApi.getEntities).toHaveBeenCalledWith({
      filter: {
        kind: 'Group',
        'relations.hasMember': ['user:default/bob'],
      },
    });

    // Check that getEntities was set up to return the correct data
    await expect(catalogApi.getEntities.mock.results[0].value).resolves.toEqual(
      {
        items: [
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Group',
            metadata: { name: 'group1' },
            spec: { members: ['Bob'] },
          },
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Group',
            metadata: { name: 'group2' },
            spec: { members: ['Bob'] },
          },
        ],
      },
    );

    await expect(
      catalogApi.getEntities.mock.results[0].value,
    ).resolves.not.toEqual(
      expect.objectContaining({
        items: expect.arrayContaining([
          expect.objectContaining({
            metadata: { name: 'group3' },
          }),
        ]),
      }),
    );
  });

  it('should display the groups a user is part of and not display the groups a user is not part of', async () => {
    const userGroups = entities.filter(
      entity =>
        entity.spec &&
        Array.isArray(entity.spec.members) &&
        entity.spec.members.includes('Bob'),
    );

    catalogApi.getEntities.mockResolvedValue({ items: userGroups });

    const props = {
      onChange,
      schema,
      required,
      uiSchema: {},
    } as unknown as FieldProps<string>;

    const { queryByText, getByRole } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [identityApiRef, mockIdentityApi],
          [catalogApiRef, catalogApi],
          [errorApiRef, mockErrorApi],
          [
            entityPresentationApiRef,
            DefaultEntityPresentationApi.create({ catalogApi }),
          ],
        ]}
      >
        <TooltipProvider>
          <MyGroupsPicker {...props} />
        </TooltipProvider>
      </TestApiProvider>,
    );

    await waitFor(() =>
      expect(catalogApi.getEntities).toHaveBeenCalledTimes(1),
    );

    // Open the combobox popover by clicking the trigger button
    const comboboxButton = getByRole('combobox');
    await userEvent.click(comboboxButton);

    // Type into the Command search input inside the popover
    const searchInput = document.querySelector(
      '[cmdk-input]',
    ) as HTMLInputElement;
    expect(searchInput).toBeTruthy();
    await userEvent.type(searchInput, 'group');

    // Wait for the dropdown elements to appear
    await waitFor(() => {
      const group1Element = queryByText('group1');
      const group2Element = queryByText('group2');
      expect(group1Element).toBeInTheDocument();
      expect(group2Element).toBeInTheDocument();
    });

    // Assert that 'group3' is not rendered in the component
    expect(queryByText('group3')).not.toBeInTheDocument();
  });

  it('should call the onChange handler with the correct entityRef and and use a nice display name', async () => {
    const userGroups = [
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: { name: 'group1', title: 'My First Group' },
        spec: { members: ['Bob'] },
      },
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: { name: 'group2', title: 'My Second Group' },
        spec: { members: ['Bob'] },
      },
    ];

    catalogApi.getEntities.mockResolvedValue({ items: userGroups });

    const props = {
      onChange,
      schema,
      required,
      uiSchema: {},
    } as unknown as FieldProps<string>;

    const { getByRole } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [identityApiRef, mockIdentityApi],
          [catalogApiRef, catalogApi],
          [errorApiRef, mockErrorApi],
          [
            entityPresentationApiRef,
            DefaultEntityPresentationApi.create({ catalogApi }),
          ],
        ]}
      >
        <TooltipProvider>
          <MyGroupsPicker {...props} />
        </TooltipProvider>
      </TestApiProvider>,
    );

    await waitFor(() =>
      expect(catalogApi.getEntities).toHaveBeenCalledTimes(1),
    );

    // Open the combobox popover by clicking the trigger button
    const comboboxButton = getByRole('combobox');
    await userEvent.click(comboboxButton);

    // Type into the Command search input inside the popover
    const searchInput = document.querySelector(
      '[cmdk-input]',
    ) as HTMLInputElement;
    expect(searchInput).toBeTruthy();
    await userEvent.type(searchInput, 'group');

    await waitFor(() => {
      expect(
        getByRole('option', { name: 'My First Group' }),
      ).toBeInTheDocument();
    });

    const option = getByRole('option', { name: 'My First Group' });
    await userEvent.click(option);

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('group:default/group1');
    });
  });

  it('should use the pre-existed formdata value if set with the form', async () => {
    const userGroups = [
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: { name: 'group1', title: 'My First Group' },
        spec: { members: ['Bob'] },
      },
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: { name: 'group2', title: 'My Second Group' },
        spec: { members: ['Bob'] },
      },
    ];

    catalogApi.getEntities.mockResolvedValue({ items: userGroups });

    const props = {
      onChange,
      schema,
      required,
      uiSchema: {},
      formData: 'group:default/group1',
    } as unknown as FieldProps<string>;

    const { getByRole } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [identityApiRef, mockIdentityApi],
          [catalogApiRef, catalogApi],
          [errorApiRef, mockErrorApi],
          [
            entityPresentationApiRef,
            DefaultEntityPresentationApi.create({ catalogApi }),
          ],
        ]}
      >
        <TooltipProvider>
          <MyGroupsPicker {...props} />
        </TooltipProvider>
      </TestApiProvider>,
    );

    await waitFor(() =>
      expect(catalogApi.getEntities).toHaveBeenCalledTimes(1),
    );

    // The combobox trigger button displays the selected entity's presentation title
    const comboboxButton = getByRole('combobox');
    await waitFor(() => {
      expect(comboboxButton).toHaveTextContent(userGroups[0].metadata.title!);
    });
  });

  describe('MyGroupsPicker description', () => {
    const description = {
      fromSchema: 'MyGroupsPicker description from schema',
      fromUiSchema: 'MyGroupsPicker description from uiSchema',
    } as { fromSchema: string; fromUiSchema: string; default?: string };

    let Wrapper: ComponentType<PropsWithChildren<{}>>;

    beforeEach(() => {
      Wrapper = ({ children }: { children?: ReactNode }) => {
        const { t } = useTranslationRef(scaffolderTranslationRef);
        description.default = t('fields.myGroupsPicker.description');
        return (
          <TestApiProvider
            apis={[
              [identityApiRef, mockIdentityApi],
              [catalogApiRef, catalogApi],
              [errorApiRef, mockErrorApi],
              [
                entityPresentationApiRef,
                DefaultEntityPresentationApi.create({ catalogApi }),
              ],
            ]}
          >
            <TooltipProvider>{children}</TooltipProvider>
          </TestApiProvider>
        );
      };
    });
    it('presents default description', async () => {
      const props = {
        onChange,
        schema,
        required: true,
        uiSchema: {},
        formData: 'group:default/group1',
      } as unknown as FieldProps<string>;

      const { getByText, queryByText } = await renderInTestApp(
        <Wrapper>
          <MyGroupsPicker {...props} />
        </Wrapper>,
      );
      expect(getByText(description.default!)).toBeInTheDocument();
      expect(queryByText(description.fromSchema)).toBe(null);
      expect(queryByText(description.fromUiSchema)).toBe(null);
    });

    it('presents schema description', async () => {
      const props = {
        onChange,
        schema: {
          ...schema,
          description: description.fromSchema,
        },
        required: true,
        uiSchema: {},
        formData: 'group:default/group1',
      } as unknown as FieldProps<string>;

      const { getByText, queryByText } = await renderInTestApp(
        <Wrapper>
          <MyGroupsPicker {...props} />
        </Wrapper>,
      );
      expect(queryByText(description.default!)).toBe(null);
      expect(getByText(description.fromSchema)).toBeInTheDocument();
      expect(queryByText(description.fromUiSchema)).toBe(null);
    });

    it('presents uiSchema description', async () => {
      const props = {
        onChange,
        schema: {
          ...schema,
          description: description.fromSchema,
        },
        required: true,
        uiSchema: {
          'ui:description': description.fromUiSchema,
        },
        formData: 'group:default/group1',
      } as unknown as FieldProps<string>;

      const { getByText, queryByText } = await renderInTestApp(
        <Wrapper>
          <MyGroupsPicker {...props} />
        </Wrapper>,
      );
      expect(queryByText(description.default!)).toBe(null);
      expect(queryByText(description.fromSchema)).toBe(null);
      expect(getByText(description.fromUiSchema)).toBeInTheDocument();
    });
  });
});
