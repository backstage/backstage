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

import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { type CatalogApi } from '@backstage/catalog-client';
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
import { useScaffolderTheme } from '@backstage/plugin-scaffolder-react/alpha';

jest.mock('@backstage/plugin-scaffolder-react/alpha', () => ({
  ...jest.requireActual('@backstage/plugin-scaffolder-react/alpha'),
  useScaffolderTheme: jest.fn(),
}));

const mockUseScaffolderTheme = jest.mocked(useScaffolderTheme);

type SpiedCatalogApi = CatalogApi &
  Pick<jest.Mocked<CatalogApi>, 'getEntitiesByRefs' | 'queryEntities'>;

const mockIdentityApi = mockApis.identity({
  userEntityRef: 'user:default/bob',
});

describe('<MyGroupsPicker />', () => {
  let entities: Entity[];
  const onChange = jest.fn();
  const schema = {};
  const required = false;

  let catalogApi: SpiedCatalogApi;

  const mockErrorApi: jest.Mocked<ErrorApi> = {
    post: jest.fn(),
    error$: jest.fn(),
  };

  beforeEach(() => {
    mockUseScaffolderTheme.mockReturnValue('mui');
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

    const api = catalogApiMock({ entities });
    catalogApi = Object.assign(api, {
      queryEntities: jest.spyOn(api, 'queryEntities'),
      getEntitiesByRefs: jest.spyOn(api, 'getEntitiesByRefs'),
    });

    onChange.mockClear();
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

    catalogApi.queryEntities.mockResolvedValue({
      items: userGroups,
      totalItems: 0,
      pageInfo: {},
    });
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
        <MyGroupsPicker {...props} />
      </TestApiProvider>,
    );

    await waitFor(() =>
      expect(catalogApi.queryEntities).toHaveBeenCalledTimes(1),
    );

    expect(catalogApi.queryEntities).toHaveBeenCalledWith({
      filter: {
        kind: 'Group',
        'relations.hasMember': ['user:default/bob'],
      },
      limit: 20,
      orderFields: [{ field: 'metadata.name', order: 'asc' }],
      totalItems: 'exclude',
    });
  });

  it('should display the groups a user is part of and not display the groups a user is not part of', async () => {
    const userGroups = entities.filter(
      entity =>
        entity.spec &&
        Array.isArray(entity.spec.members) &&
        entity.spec.members.includes('Bob'),
    );

    catalogApi.queryEntities.mockResolvedValue({
      items: userGroups,
      totalItems: 0,
      pageInfo: {},
    });

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
        <MyGroupsPicker {...props} />
      </TestApiProvider>,
    );

    await waitFor(() =>
      expect(catalogApi.queryEntities).toHaveBeenCalledTimes(1),
    );

    // Simulate user input
    const inputField = getByRole('combobox');
    await userEvent.click(inputField);
    await userEvent.type(inputField, 'group');

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

  it.each(['bui', 'mui'] as const)(
    'keeps %s search input when the selected group moves outside the results',
    async theme => {
      mockUseScaffolderTheme.mockReturnValue(theme);
      const userGroups = entities.slice(0, 2);
      catalogApi.getEntitiesByRefs.mockResolvedValue({
        items: [{ ...userGroups[1] }],
      });
      let resolveFilteredResults = () => {};
      catalogApi.queryEntities
        .mockResolvedValueOnce({
          items: userGroups,
          totalItems: 0,
          pageInfo: {},
        })
        .mockReturnValueOnce(
          new Promise(resolve => {
            resolveFilteredResults = () =>
              resolve({ items: [userGroups[0]], totalItems: 0, pageInfo: {} });
          }),
        );
      const props = {
        onChange,
        schema,
        required,
        uiSchema: {},
        formData: 'group:default/group2',
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
          <MyGroupsPicker {...props} />
        </TestApiProvider>,
      );
      const input = screen.getByRole(theme === 'bui' ? 'combobox' : 'textbox');

      fireEvent.change(input, { target: { value: 'group' } });
      await waitFor(() =>
        expect(catalogApi.queryEntities).toHaveBeenCalledTimes(2),
      );
      await act(async () => resolveFilteredResults());

      expect(input).toHaveValue('group');
    },
  );

  it.each(['bui', 'mui'] as const)(
    'keeps %s search input when a selected group presentation arrives late',
    async theme => {
      mockUseScaffolderTheme.mockReturnValue(theme);
      const selectedGroup: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: { name: 'off-page', title: 'Off Page Group' },
      };
      let resolveSelectedGroup = () => {};
      catalogApi.getEntitiesByRefs.mockReturnValueOnce(
        new Promise(resolve => {
          resolveSelectedGroup = () => resolve({ items: [selectedGroup] });
        }),
      );
      const props = {
        onChange,
        schema,
        required,
        uiSchema: {},
        formData: 'group:default/off-page',
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
          <MyGroupsPicker {...props} />
        </TestApiProvider>,
      );
      const input = screen.getByRole(theme === 'bui' ? 'combobox' : 'textbox');

      fireEvent.change(input, { target: { value: 'replacement' } });
      await act(async () => {
        resolveSelectedGroup();
        await Promise.resolve();
        await Promise.resolve();
      });

      expect(input).toHaveValue('replacement');
    },
  );

  it('does not clear a BUI group outside the current page on blur', async () => {
    mockUseScaffolderTheme.mockReturnValue('bui');
    const selectedGroup: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: { name: 'off-page' },
      spec: { members: ['Bob'] },
    };
    catalogApi.getEntitiesByRefs.mockResolvedValueOnce({
      items: [selectedGroup],
    });
    const props = {
      onChange,
      schema,
      required,
      uiSchema: {},
      formData: 'group:default/off-page',
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
        <MyGroupsPicker {...props} />
      </TestApiProvider>,
    );
    const input = screen.getByRole('combobox');
    await waitFor(() => expect(input).toHaveValue('off-page'));

    fireEvent.focus(input);
    fireEvent.blur(input);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not clear a BUI group while its entity is loading', async () => {
    mockUseScaffolderTheme.mockReturnValue('bui');
    catalogApi.getEntitiesByRefs.mockReturnValueOnce(new Promise(() => {}));
    const props = {
      onChange,
      schema,
      required,
      uiSchema: {},
      formData: 'group:default/off-page',
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
        <MyGroupsPicker {...props} />
      </TestApiProvider>,
    );
    const input = screen.getByRole('combobox');

    fireEvent.focus(input);
    fireEvent.blur(input);

    expect(onChange).not.toHaveBeenCalled();
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

    catalogApi.queryEntities.mockResolvedValue({
      items: userGroups,
      totalItems: 0,
      pageInfo: {},
    });

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
        <MyGroupsPicker {...props} />
      </TestApiProvider>,
    );

    await waitFor(() =>
      expect(catalogApi.queryEntities).toHaveBeenCalledTimes(1),
    );

    const inputField = getByRole('combobox');
    await userEvent.click(inputField);
    await userEvent.type(inputField, 'group');

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

    catalogApi.queryEntities.mockResolvedValue({
      items: userGroups,
      totalItems: 0,
      pageInfo: {},
    });
    catalogApi.getEntitiesByRefs.mockResolvedValue({ items: [userGroups[0]] });

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
        <MyGroupsPicker {...props} />
      </TestApiProvider>,
    );

    await waitFor(() =>
      expect(catalogApi.queryEntities).toHaveBeenCalledTimes(1),
    );

    const inputField = getByRole('combobox');
    const inputFieldValue = inputField?.querySelector('input')?.value;

    expect(inputFieldValue).toEqual(userGroups[0].metadata.title);
  });

  it('accepts a selected group that is not on the current page', async () => {
    const selectedGroup: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: { name: 'off-page' },
    };
    catalogApi.queryEntities.mockResolvedValue({
      items: entities.slice(0, 2),
      totalItems: 0,
      pageInfo: {},
    });
    catalogApi.getEntitiesByRefs.mockResolvedValue({
      items: [selectedGroup],
    });
    const props = {
      onChange,
      schema,
      required,
      uiSchema: {},
      formData: 'group:default/off-page',
    } as unknown as FieldProps<string>;
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

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
        <MyGroupsPicker {...props} />
      </TestApiProvider>,
    );
    await waitFor(() =>
      expect(screen.getByRole('combobox').querySelector('input')).toHaveValue(
        'off-page',
      ),
    );

    expect(warn).not.toHaveBeenCalledWith(
      expect.stringContaining('value provided to Autocomplete is invalid'),
    );
    warn.mockRestore();
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
            {children}
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
