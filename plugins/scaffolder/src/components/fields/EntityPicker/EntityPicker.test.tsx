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

import {
  type CatalogApi,
  CATALOG_FILTER_EXISTS,
} from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import {
  catalogApiRef,
  entityPresentationApiRef,
} from '@backstage/plugin-catalog-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { PropsWithChildren, ComponentType, ReactNode } from 'react';
import { EntityPicker } from './EntityPicker';
import { EntityPickerProps } from './schema';
import { ScaffolderRJSFFieldProps as FieldProps } from '@backstage/plugin-scaffolder-react';
import { DefaultEntityPresentationApi } from '@backstage/plugin-catalog';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
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

const makeEntity = (kind: string, namespace: string, name: string): Entity => ({
  apiVersion: 'scaffolder.backstage.io/v1beta3',
  kind,
  metadata: { namespace, name },
});

describe('<EntityPicker />', () => {
  const entities: Entity[] = [
    makeEntity('Group', 'default', 'team-a'),
    makeEntity('Group', 'default', 'squad-b'),
  ];
  const onChange = jest.fn();
  const schema = {};
  const required = false;
  let uiSchema: EntityPickerProps['uiSchema'];
  const rawErrors: string[] = [];
  const formData = undefined;

  let props: FieldProps<string>;

  let catalogApi: SpiedCatalogApi;

  let Wrapper: ComponentType<PropsWithChildren<{}>>;

  beforeEach(() => {
    mockUseScaffolderTheme.mockReturnValue('mui');
    const api = catalogApiMock({ entities });
    catalogApi = Object.assign(api, {
      queryEntities: jest.spyOn(api, 'queryEntities'),
      getEntitiesByRefs: jest.spyOn(api, 'getEntitiesByRefs'),
    });
    Wrapper = ({ children }: { children?: ReactNode }) => (
      <TestApiProvider
        apis={[
          [catalogApiRef, catalogApi],
          [
            entityPresentationApiRef,
            DefaultEntityPresentationApi.create({ catalogApi }),
          ],
        ]}
      >
        {children}
      </TestApiProvider>
    );
  });

  afterEach(() => jest.resetAllMocks());

  describe('without allowedKinds and catalogFilter', () => {
    beforeEach(() => {
      uiSchema = { 'ui:options': {} };
      props = {
        onChange,
        schema,
        required,
        uiSchema,
        rawErrors,
        formData,
      } as unknown as FieldProps;
    });

    it('searches for all entities', async () => {
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      expect(catalogApi.queryEntities).toHaveBeenCalledWith({
        limit: 20,
        orderFields: [{ field: 'metadata.name', order: 'asc' }],
        totalItems: 'exclude',
      });
    });

    it('filters entities through the catalog as the user types', async () => {
      const { getByRole } = await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      fireEvent.change(getByRole('textbox'), { target: { value: 'team' } });

      await waitFor(() =>
        expect(catalogApi.queryEntities).toHaveBeenLastCalledWith(
          expect.objectContaining({
            fullTextFilter: expect.objectContaining({ term: 'team' }),
          }),
        ),
      );
    });

    it('keeps BUI search input while filtered results arrive', async () => {
      mockUseScaffolderTheme.mockReturnValue('bui');
      const filteredEntity = makeEntity('Group', 'default', 'filtered-result');
      let resolveFilteredResults = () => {};
      catalogApi.queryEntities
        .mockResolvedValueOnce({
          items: entities,
          totalItems: 0,
          pageInfo: {},
        })
        .mockReturnValueOnce(
          new Promise(resolve => {
            resolveFilteredResults = () =>
              resolve({ items: [filteredEntity], totalItems: 0, pageInfo: {} });
          }),
        );
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );
      const input = screen.getByRole('combobox');

      fireEvent.change(input, { target: { value: 'team' } });
      await waitFor(() =>
        expect(catalogApi.queryEntities).toHaveBeenCalledTimes(2),
      );
      await act(async () => resolveFilteredResults());

      expect(input).toHaveValue('team');
    });

    it('keeps BUI search input when a selected presentation arrives late', async () => {
      mockUseScaffolderTheme.mockReturnValue('bui');
      const selectedEntity = {
        ...makeEntity('Group', 'default', 'off-page'),
        metadata: {
          namespace: 'default',
          name: 'off-page',
          title: 'Off Page Group',
        },
      };
      let resolveSelectedEntity = () => {};
      catalogApi.getEntitiesByRefs.mockReturnValueOnce(
        new Promise(resolve => {
          resolveSelectedEntity = () => resolve({ items: [selectedEntity] });
        }),
      );
      props = {
        ...props,
        formData: 'group:default/off-page',
        uiSchema: {
          'ui:options': { allowArbitraryValues: false },
        },
      } as unknown as FieldProps<any>;
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );
      const input = screen.getByRole('combobox');

      fireEvent.change(input, { target: { value: 'replacement' } });
      await act(async () => {
        resolveSelectedEntity();
        await Promise.resolve();
        await Promise.resolve();
      });

      expect(input).toHaveValue('replacement');
    });

    it('does not clear a BUI selection outside the current page on blur', async () => {
      mockUseScaffolderTheme.mockReturnValue('bui');
      const selectedEntity = makeEntity('Group', 'default', 'off-page');
      catalogApi.getEntitiesByRefs.mockResolvedValueOnce({
        items: [selectedEntity],
      });
      props = {
        ...props,
        formData: 'group:default/off-page',
        uiSchema: {
          'ui:options': { allowArbitraryValues: false },
        },
      } as unknown as FieldProps<any>;
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );
      const input = screen.getByRole('combobox');
      await waitFor(() => expect(input).toHaveValue('off-page'));

      fireEvent.focus(input);
      fireEvent.blur(input);

      expect(onChange).not.toHaveBeenCalled();
    });

    it('does not clear a BUI selection while its entity is loading', async () => {
      mockUseScaffolderTheme.mockReturnValue('bui');
      catalogApi.getEntitiesByRefs.mockReturnValueOnce(new Promise(() => {}));
      props = {
        ...props,
        formData: 'group:default/off-page',
        uiSchema: {
          'ui:options': { allowArbitraryValues: false },
        },
      } as unknown as FieldProps<any>;
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );
      const input = screen.getByRole('combobox');

      fireEvent.focus(input);
      fireEvent.blur(input);

      expect(onChange).not.toHaveBeenCalled();
    });

    it.each(['missing', 'failed'] as const)(
      'does not clear a BUI selection when its entity lookup is %s',
      async outcome => {
        mockUseScaffolderTheme.mockReturnValue('bui');
        if (outcome === 'missing') {
          catalogApi.getEntitiesByRefs.mockResolvedValueOnce({
            items: [undefined],
          });
        } else {
          catalogApi.getEntitiesByRefs.mockRejectedValueOnce(
            new Error('catalog unavailable'),
          );
        }
        props = {
          ...props,
          formData: 'group:default/off-page',
          uiSchema: {
            'ui:options': { allowArbitraryValues: false },
          },
        } as unknown as FieldProps<any>;
        await renderInTestApp(
          <Wrapper>
            <EntityPicker {...props} />
          </Wrapper>,
        );
        const input = screen.getByRole('combobox');
        await waitFor(() =>
          expect(catalogApi.getEntitiesByRefs).toHaveBeenCalled(),
        );

        fireEvent.focus(input);
        fireEvent.blur(input);

        expect(onChange).not.toHaveBeenCalled();
      },
    );

    it('does not commit a BUI presentation title as an arbitrary value on blur', async () => {
      mockUseScaffolderTheme.mockReturnValue('bui');
      const selectedEntity = {
        ...makeEntity('Group', 'default', 'off-page'),
        metadata: {
          namespace: 'default',
          name: 'off-page',
          title: 'Off Page Group',
        },
      };
      catalogApi.getEntitiesByRefs.mockResolvedValueOnce({
        items: [selectedEntity],
      });
      props = {
        ...props,
        formData: 'group:default/off-page',
      } as unknown as FieldProps<any>;
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );
      const input = screen.getByRole('combobox');
      await waitFor(() => expect(input).toHaveValue('Off Page Group'));

      fireEvent.focus(input);
      fireEvent.blur(input);

      expect(onChange).not.toHaveBeenCalled();
    });

    it('updates even if there is not an exact match', async () => {
      const { getByRole } = await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'squ' } });
      fireEvent.blur(input);

      expect(onChange).toHaveBeenCalledWith('squ');
    });

    it('does not look up an arbitrary value as an entity ref', async () => {
      props = {
        ...props,
        formData: 'arbitrary-value',
      } as unknown as FieldProps<any>;

      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );
      await waitFor(() =>
        expect(catalogApi.queryEntities).toHaveBeenCalledTimes(1),
      );

      expect(catalogApi.getEntitiesByRefs).not.toHaveBeenCalled();
    });
  });

  describe('with allowedKinds', () => {
    beforeEach(() => {
      uiSchema = { 'ui:options': { allowedKinds: ['User'] } };
      props = {
        onChange,
        schema,
        required,
        uiSchema,
        rawErrors,
        formData,
      } as unknown as FieldProps<any>;
    });

    it('searches for users and groups', async () => {
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      expect(catalogApi.queryEntities).toHaveBeenCalledWith(
        expect.objectContaining({
          filter: { kind: ['User'] },
        }),
      );
    });
  });

  describe('with catalogFilter', () => {
    beforeEach(() => {
      uiSchema = {
        'ui:options': {
          catalogFilter: [
            {
              kind: ['Group'],
              'metadata.name': 'test-entity',
            },
            {
              kind: ['User'],
              'metadata.name': 'test-entity',
            },
          ],
        },
      };
      props = {
        onChange,
        schema,
        required,
        uiSchema,
        rawErrors,
        formData,
      } as unknown as FieldProps<any>;
    });

    it('searches for a specific group entity', async () => {
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      expect(catalogApi.queryEntities).toHaveBeenCalledWith(
        expect.objectContaining({
          filter: [
            {
              kind: ['Group'],
              'metadata.name': 'test-entity',
            },
            {
              kind: ['User'],
              'metadata.name': 'test-entity',
            },
          ],
        }),
      );
    });
    it('allow single top level filter', async () => {
      uiSchema = {
        'ui:options': {
          catalogFilter: {
            kind: ['Group'],
            'metadata.name': 'test-entity',
          },
        },
      };

      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} uiSchema={uiSchema} />
        </Wrapper>,
      );

      expect(catalogApi.queryEntities).toHaveBeenCalledWith(
        expect.objectContaining({
          filter: {
            kind: ['Group'],
            'metadata.name': 'test-entity',
          },
        }),
      );
    });

    it('search for entities containing a specific key', async () => {
      const uiSchemaWithBoolean = {
        'ui:options': {
          catalogFilter: [
            {
              kind: ['User'],
              'metadata.annotation.some/anotation': { exists: true },
            },
          ],
        },
      };

      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} uiSchema={uiSchemaWithBoolean} />
        </Wrapper>,
      );

      expect(catalogApi.queryEntities).toHaveBeenCalledWith(
        expect.objectContaining({
          filter: [
            {
              kind: ['User'],
              'metadata.annotation.some/anotation': CATALOG_FILTER_EXISTS,
            },
          ],
        }),
      );
    });
  });

  describe('ui:disabled EntityPicker', () => {
    beforeEach(() => {
      uiSchema = {
        'ui:options': {
          catalogFilter: [
            {
              kind: ['Group'],
              'metadata.name': 'test-entity',
            },
            {
              kind: ['User'],
              'metadata.name': 'test-entity',
            },
          ],
        },
      };
      props = {
        onChange,
        schema,
        required: true,
        uiSchema,
        rawErrors,
        formData,
      } as unknown as FieldProps<any>;
    });
    it('Prevents user from modifying input when ui:disabled is true', async () => {
      props.uiSchema = { 'ui:disabled': true };
      props.formData = 'component:default/myentity';

      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      const input = screen.getByRole('textbox');

      // Expect input to be disabled
      expect(input).toBeDisabled();
      expect(input).toHaveValue('component:default/myentity');
    });

    it('Allows user to edit when ui:disabled is false', async () => {
      props.uiSchema = { 'ui:disabled': false };
      props.formData = 'component:default/myentity';

      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      const input = screen.getByRole('textbox');
      expect(input).not.toBeDisabled();

      fireEvent.change(input, {
        target: { value: 'component:default/mynewentity' },
      });
      fireEvent.blur(input);

      expect(input).toHaveValue('component:default/mynewentity');
      expect(onChange).toHaveBeenCalledWith('component:default/mynewentity');
    });
  });

  describe('catalogFilter should take precedence over allowedKinds', () => {
    beforeEach(() => {
      uiSchema = {
        'ui:options': {
          catalogFilter: [
            {
              kind: ['Group'],
              'metadata.name': 'test-group',
            },
          ],
          allowedKinds: ['User'],
        },
      };
      props = {
        onChange,
        schema,
        required,
        uiSchema,
        rawErrors,
        formData,
      } as unknown as FieldProps<any>;
    });

    it('searches for a Group entity', async () => {
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      expect(catalogApi.queryEntities).toHaveBeenCalledWith(
        expect.objectContaining({
          filter: [
            {
              kind: ['Group'],
              'metadata.name': 'test-group',
            },
          ],
        }),
      );
    });
  });

  describe('ui:autoSelect behavior', () => {
    beforeEach(() => {
      uiSchema = {
        'ui:options': {
          defaultKind: 'Group',
        },
      };
      props = {
        onChange,
        schema,
        required,
        uiSchema,
        rawErrors,
        formData,
      } as unknown as FieldProps<any>;
    });

    it('default behavior', async () => {
      const { getByRole } = await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      const input = getByRole('textbox');

      // Type partial match and blur
      fireEvent.change(input, { target: { value: 'team' } });
      fireEvent.blur(input);

      // Default behavior with freeSolo enabled processes the typed value
      expect(onChange).toHaveBeenCalledWith('group:default/team');
    });

    it('does not autoSelect value onBlur', async () => {
      uiSchema = {
        'ui:options': {
          defaultKind: 'Group',
          autoSelect: false,
        },
      };
      props = {
        ...props,
        uiSchema,
      } as unknown as FieldProps<any>;

      const { getByRole } = await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      const input = getByRole('textbox');

      // Type and blur - with autoSelect=false, the autocomplete won't auto-select on blur
      fireEvent.change(input, { target: { value: 'team' } });
      fireEvent.blur(input);

      // With autoSelect=false, onChange should not be called on blur
      // This is the key difference - users must explicitly select an option
      expect(onChange).not.toHaveBeenCalled();
    });

    it('autoSelects entity onBlur', async () => {
      uiSchema = {
        'ui:options': {
          defaultKind: 'Group',
          autoSelect: true,
        },
      };
      props = {
        ...props,
        uiSchema,
      } as unknown as FieldProps<any>;

      const { getByRole } = await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      const input = getByRole('textbox');

      // Type and blur
      fireEvent.change(input, { target: { value: 'squad' } });
      fireEvent.blur(input);

      // With autoSelect=true and freeSolo, processes the typed value
      expect(onChange).toHaveBeenCalledWith('group:default/squad');
    });
  });

  describe('uses full entity ref', () => {
    beforeEach(() => {
      uiSchema = {
        'ui:options': {
          defaultKind: 'Group',
        },
      };
      props = {
        onChange,
        schema,
        required,
        uiSchema,
        rawErrors,
        formData,
      } as unknown as FieldProps<any>;
    });

    it('returns the full entityRef when entity exists in the list', async () => {
      const { getByRole } = await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'team-a' } });
      fireEvent.blur(input);

      expect(onChange).toHaveBeenCalledWith('group:default/team-a');
    });

    it('returns the full entityRef when entity does not exist in the list', async () => {
      const { getByRole } = await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'team-b' } });
      fireEvent.blur(input);

      expect(onChange).toHaveBeenCalledWith('group:default/team-b');
    });
  });
  describe('entity presentation', () => {
    beforeEach(() => {
      uiSchema = {
        'ui:options': {
          defaultKind: 'Group',
        },
      };
      props = {
        onChange,
        schema,
        required,
        uiSchema,
        rawErrors,
        formData,
      } as unknown as FieldProps<any>;
    });

    it('renders selection displayName', async () => {
      const items = entities.map(item => ({
        ...item,
        spec: {
          profile: { displayName: item.metadata.name.replace('-', ' ') },
        },
      }));
      catalogApi.queryEntities.mockResolvedValue({
        items,
        totalItems: 0,
        pageInfo: {},
      });

      const { getByRole, getByText } = await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 't' } });

      expect(getByText('team a')).toBeInTheDocument();

      fireEvent.change(input, { target: { value: 's' } });

      expect(getByText('squad b')).toBeInTheDocument();

      fireEvent.blur(input);
    });

    it('renders selection title', async () => {
      const items = entities.map(item => ({
        ...item,
        metadata: {
          ...item.metadata,
          title: item.metadata.name.replace('-', ' ').toUpperCase(),
        },
      }));
      catalogApi.queryEntities.mockResolvedValue({
        items,
        totalItems: 0,
        pageInfo: {},
      });

      const { getByRole, getByText } = await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 't' } });

      expect(getByText('TEAM A')).toBeInTheDocument();

      fireEvent.change(input, { target: { value: 's' } });

      expect(getByText('SQUAD B')).toBeInTheDocument();

      fireEvent.blur(input);
    });

    it('accepts a selected entity that is not on the current page', async () => {
      const selectedEntity = makeEntity('Group', 'default', 'off-page');
      catalogApi.getEntitiesByRefs.mockResolvedValue({
        items: [selectedEntity],
      });
      props = {
        ...props,
        formData: 'group:default/off-page',
        uiSchema: {
          'ui:options': { allowArbitraryValues: false },
        },
      } as unknown as FieldProps<any>;
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );
      await waitFor(() =>
        expect(screen.getByRole('textbox')).toHaveValue(
          'group:default/off-page',
        ),
      );

      expect(warn).not.toHaveBeenCalledWith(
        expect.stringContaining('value provided to Autocomplete is invalid'),
      );
      warn.mockRestore();
    });
  });

  describe('Required EntityPicker', () => {
    beforeEach(() => {
      uiSchema = {
        'ui:options': {
          catalogFilter: [
            {
              kind: ['Group'],
              'metadata.name': 'test-entity',
            },
            {
              kind: ['User'],
              'metadata.name': 'test-entity',
            },
          ],
        },
      };
      props = {
        onChange,
        schema,
        required: true,
        uiSchema,
        rawErrors,
        formData,
      } as unknown as FieldProps<any>;
    });

    it('User enters clear input', async () => {
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
          <div data-testid="outside">Outside</div>
        </Wrapper>,
      );

      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '' } });
      fireEvent.blur(input);

      expect(input).toHaveValue('');
    });

    it('User selects item', async () => {
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: 'team-a' } });
      fireEvent.blur(input);

      expect(input).toHaveValue('team-a');
      expect(onChange).toHaveBeenCalledWith('team-a');
    });

    it('User selects item and enters clear input', async () => {
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
          <div data-testid="outside">Outside</div>
        </Wrapper>,
      );

      // Open the Autocomplete dropdown
      const input = screen.getByRole('textbox');
      fireEvent.click(input);

      // Select an option from the dropdown
      fireEvent.change(input, { target: { value: 'team-a' } });

      // Close the dropdown by clicking outside the Autocomplete component
      const outside = screen.getByTestId('outside');
      fireEvent.mouseDown(outside);

      // Click back into the Autocomplete component
      fireEvent.click(input);

      // Verify that the selected option is displayed in the input
      expect(input).toHaveValue('team-a');

      // Click the Clear button to clear the input
      const clearButton = screen.getByLabelText('Clear');
      fireEvent.click(clearButton);

      // Verify that the input is empty
      expect(input).toHaveValue('');

      // Verify that the handleChange function was called with undefined
      expect(onChange).toHaveBeenCalledWith(undefined);
    });
  });

  describe('Optional EntityPicker', () => {
    beforeEach(() => {
      uiSchema = {
        'ui:options': {
          catalogFilter: [
            {
              kind: ['Group'],
              'metadata.name': 'test-entity',
            },
            {
              kind: ['User'],
              'metadata.name': 'test-entity',
            },
          ],
        },
      };
      props = {
        onChange,
        schema,
        required: false,
        uiSchema,
        rawErrors,
        formData,
      } as unknown as FieldProps<any>;
    });

    it('User enters clear input', async () => {
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
          <div data-testid="outside">Outside</div>
        </Wrapper>,
      );

      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '' } });
      fireEvent.blur(input);

      expect(input).toHaveValue('');
    });

    it('User selects item', async () => {
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: 'team-a' } });
      fireEvent.blur(input);

      expect(input).toHaveValue('team-a');
      expect(onChange).toHaveBeenCalledWith('team-a');
    });

    it('User selects item and enters clear input', async () => {
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
          <div data-testid="outside">Outside</div>
        </Wrapper>,
      );

      // Open the Autocomplete dropdown
      const input = screen.getByRole('textbox');
      fireEvent.click(input);

      // Select an option from the dropdown
      fireEvent.change(input, { target: { value: 'team-a' } });

      // Close the dropdown by clicking outside the Autocomplete component
      const outside = screen.getByTestId('outside');
      fireEvent.mouseDown(outside);

      // Click back into the Autocomplete component
      fireEvent.click(input);

      // Verify that the selected option is displayed in the input
      expect(input).toHaveValue('team-a');

      // Click the Clear button to clear the input
      const clearButton = screen.getByLabelText('Clear');
      fireEvent.click(clearButton);

      // Verify that the input is empty
      expect(input).toHaveValue('');

      // Verify that the handleChange function was called with undefined
      expect(onChange).toHaveBeenCalledWith(undefined);
    });
  });

  describe('Required Free Solo', () => {
    beforeEach(() => {
      uiSchema = {
        'ui:options': {
          catalogFilter: [
            {
              kind: ['Group'],
              'metadata.name': 'test-entity',
            },
            {
              kind: ['User'],
              'metadata.name': 'test-entity',
            },
          ],
        },
        allowArbitraryValues: true,
      };
      props = {
        onChange,
        schema,
        required: true,
        uiSchema,
        rawErrors,
        formData,
      } as unknown as FieldProps<any>;
    });

    it('User enters clear input', async () => {
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
          <div data-testid="outside">Outside</div>
        </Wrapper>,
      );

      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '' } });
      fireEvent.blur(input);

      expect(input).toHaveValue('');
    });

    it('User selects item', async () => {
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: 'team-a' } });
      fireEvent.blur(input);

      expect(input).toHaveValue('team-a');
      expect(onChange).toHaveBeenCalledWith('team-a');
    });

    it('User selects item and enters clear input', async () => {
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
          <div data-testid="outside">Outside</div>
        </Wrapper>,
      );

      // Open the Autocomplete dropdown
      const input = screen.getByRole('textbox');
      fireEvent.click(input);

      // Select an option from the dropdown
      fireEvent.change(input, { target: { value: 'team-a' } });

      // Close the dropdown by clicking outside the Autocomplete component
      const outside = screen.getByTestId('outside');
      fireEvent.mouseDown(outside);

      // Click back into the Autocomplete component
      fireEvent.click(input);

      // Verify that the selected option is displayed in the input
      expect(input).toHaveValue('team-a');

      // Click the Clear button to clear the input
      const clearButton = screen.getByLabelText('Clear');
      fireEvent.click(clearButton);

      // Verify that the input is empty
      expect(input).toHaveValue('');

      // Verify that the handleChange function was called with undefined
      expect(onChange).toHaveBeenCalledWith(undefined);
    });
  });

  describe('Optional Free Solo', () => {
    beforeEach(() => {
      uiSchema = {
        'ui:options': {
          catalogFilter: [
            {
              kind: ['Group'],
              'metadata.name': 'test-entity',
            },
            {
              kind: ['User'],
              'metadata.name': 'test-entity',
            },
          ],
        },
        allowArbitraryValues: true,
      };
      props = {
        onChange,
        schema,
        required: false,
        uiSchema,
        rawErrors,
        formData,
      } as unknown as FieldProps<any>;
    });

    it('User enters clear input', async () => {
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
          <div data-testid="outside">Outside</div>
        </Wrapper>,
      );

      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '' } });
      fireEvent.blur(input);

      expect(input).toHaveValue('');
    });

    it('User selects item', async () => {
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: 'team-a' } });
      fireEvent.blur(input);

      expect(input).toHaveValue('team-a');
      expect(onChange).toHaveBeenCalledWith('team-a');
    });

    it('User selects item and enters clear input', async () => {
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
          <div data-testid="outside">Outside</div>
        </Wrapper>,
      );

      // Open the Autocomplete dropdown
      const input = screen.getByRole('textbox');
      fireEvent.click(input);

      // Select an option from the dropdown
      fireEvent.change(input, { target: { value: 'team-a' } });

      // Close the dropdown by clicking outside the Autocomplete component
      const outside = screen.getByTestId('outside');
      fireEvent.mouseDown(outside);

      // Click back into the Autocomplete component
      fireEvent.click(input);

      // Verify that the selected option is displayed in the input
      expect(input).toHaveValue('team-a');

      // Click the Clear button to clear the input
      const clearButton = screen.getByLabelText('Clear');
      fireEvent.click(clearButton);

      // Verify that the input is empty
      expect(input).toHaveValue('');

      // Verify that the handleChange function was called with undefined
      expect(onChange).toHaveBeenCalledWith(undefined);
    });
  });

  describe('EntityPicker description', () => {
    const description = {
      fromSchema: 'EntityPicker description from schema',
      fromUiSchema: 'EntityPicker description from uiSchema',
    } as { fromSchema: string; fromUiSchema: string; default?: string };

    beforeEach(() => {
      const RealWrapper = Wrapper;
      Wrapper = ({ children }: { children?: ReactNode }) => {
        const { t } = useTranslationRef(scaffolderTranslationRef);
        description.default = t('fields.entityPicker.description');
        return <RealWrapper>{children}</RealWrapper>;
      };
    });
    it('presents default description', async () => {
      uiSchema = {
        'ui:options': {
          catalogFilter: [
            {
              kind: ['Group'],
              'metadata.name': 'test-entity',
            },
            {
              kind: ['User'],
              'metadata.name': 'test-entity',
            },
          ],
        },
      };
      props = {
        onChange,
        schema,
        required: true,
        uiSchema,
        rawErrors,
        formData,
      } as unknown as FieldProps<any>;

      const { getByText, queryByText } = await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );
      expect(getByText(description.default!)).toBeInTheDocument();
      expect(queryByText(description.fromSchema)).toBe(null);
      expect(queryByText(description.fromUiSchema)).toBe(null);
    });

    it('presents schema description', async () => {
      uiSchema = {
        'ui:options': {
          catalogFilter: [
            {
              kind: ['Group'],
              'metadata.name': 'test-entity',
            },
            {
              kind: ['User'],
              'metadata.name': 'test-entity',
            },
          ],
        },
      };
      props = {
        onChange,
        schema: {
          ...schema,
          description: description.fromSchema,
        },
        required: true,
        uiSchema,
        rawErrors,
        formData,
      } as unknown as FieldProps<any>;

      const { getByText, queryByText } = await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );
      expect(queryByText(description.default!)).toBe(null);
      expect(getByText(description.fromSchema)).toBeInTheDocument();
      expect(queryByText(description.fromUiSchema)).toBe(null);
    });

    it('presents uiSchema description', async () => {
      uiSchema = {
        'ui:options': {
          catalogFilter: [
            {
              kind: ['Group'],
              'metadata.name': 'test-entity',
            },
            {
              kind: ['User'],
              'metadata.name': 'test-entity',
            },
          ],
        },
        'ui:description': description.fromUiSchema,
      };
      props = {
        onChange,
        schema: {
          ...schema,
          description: description.fromSchema,
        },
        required: true,
        uiSchema,
        rawErrors,
        formData,
      } as unknown as FieldProps<any>;

      const { getByText, queryByText } = await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );
      expect(queryByText(description.default!)).toBe(null);
      expect(queryByText(description.fromSchema)).toBe(null);
      expect(getByText(description.fromUiSchema)).toBeInTheDocument();
    });
  });
});
