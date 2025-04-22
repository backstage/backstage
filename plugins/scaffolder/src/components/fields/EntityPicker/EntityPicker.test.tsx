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

import { CATALOG_FILTER_EXISTS } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import {
  catalogApiRef,
  entityPresentationApiRef,
  EntityDisplayName,
} from '@backstage/plugin-catalog-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { fireEvent, screen } from '@testing-library/react';
import { PropsWithChildren, ComponentType, ReactNode } from 'react';
import { EntityPicker } from './EntityPicker';
import { EntityPickerProps } from './schema';
import { ScaffolderRJSFFieldProps as FieldProps } from '@backstage/plugin-scaffolder-react';
import { DefaultEntityPresentationApi } from '@backstage/plugin-catalog';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';

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

  const catalogApi = catalogApiMock.mock({
    getEntities: jest.fn(async () => ({ items: entities })),
  });

  let Wrapper: ComponentType<PropsWithChildren<{}>>;

  beforeEach(() => {
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

      expect(catalogApi.getEntities).toHaveBeenCalledWith({
        fields: [
          'metadata.name',
          'metadata.namespace',
          'metadata.title',
          'kind',
        ],
        filter: undefined,
      });
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

      catalogApi.getEntities.mockResolvedValue({ items: entities });
    });

    it('searches for users and groups', async () => {
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      expect(catalogApi.getEntities).toHaveBeenCalledWith(
        expect.objectContaining({
          filter: {
            kind: ['User'],
          },
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

      catalogApi.getEntities.mockResolvedValue({ items: entities });
    });

    it('searches for a specific group entity', async () => {
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      expect(catalogApi.getEntities).toHaveBeenCalledWith(
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

      catalogApi.getEntities.mockResolvedValue({ items: entities });

      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} uiSchema={uiSchema} />
        </Wrapper>,
      );

      expect(catalogApi.getEntities).toHaveBeenCalledWith(
        expect.objectContaining({
          filter: {
            kind: ['Group'],
            'metadata.name': 'test-entity',
          },
        }),
      );
    });

    it('search for entitities containing an specific key', async () => {
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

      expect(catalogApi.getEntities).toHaveBeenCalledWith(
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

      catalogApi.getEntities.mockResolvedValue({ items: entities });
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

      catalogApi.getEntities.mockResolvedValue({ items: entities });
    });

    it('searches for a Group entity', async () => {
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      expect(catalogApi.getEntities).toHaveBeenCalledWith(
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

      catalogApi.getEntities.mockResolvedValue({ items: entities });
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

      catalogApi.getEntities.mockResolvedValue({ items: entities });
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

      catalogApi.getEntities.mockResolvedValue({ items: entities });
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

      catalogApi.getEntities.mockResolvedValue({ items: entities });
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

      catalogApi.getEntities.mockResolvedValue({ items: entities });
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

  describe('rendering consistency', () => {
    beforeEach(() => {
      uiSchema = { 'ui:options': {} };
      props = {
        onChange,
        schema,
        required,
        uiSchema,
        rawErrors,
        formData: 'group:default/team-a',
      } as unknown as FieldProps<string>;
    });

    it('shows display inconsistency before the fix', async () => {
      // Mock the presentation API to return specific values for testing
      const mockEntityPresentation = {
        entityRef: 'group:default/team-a',
        primaryTitle: 'Team A',
      };

      // Create a catalog API that includes the specific test entity
      const testCatalogApi = catalogApiMock.mock({
        getEntities: jest.fn().mockResolvedValue({
          items: [makeEntity('Group', 'default', 'team-a')],
        }),
      });

      // Create an entity presentation API that returns different display values
      const entityPresentationApiWithOriginalBehavior = {
        forEntity: jest.fn().mockReturnValue({
          snapshot: {
            ...mockEntityPresentation,
            primaryTitle: undefined,
            entityRef: 'group:default/team-a',
          },
          promise: Promise.resolve({
            ...mockEntityPresentation,
            primaryTitle: undefined,
            entityRef: 'group:default/team-a',
          }),
        }),
      };

      await renderInTestApp(
        <TestApiProvider
          apis={[
            [catalogApiRef, testCatalogApi],
            [
              entityPresentationApiRef,
              entityPresentationApiWithOriginalBehavior,
            ],
          ]}
        >
          <EntityPicker {...props} formData="group:default/team-a" />
        </TestApiProvider>,
      );

      // Wait for the entity data to load and be processed
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check how it appears in the input (should show raw entity ref)
      const input = screen.getByRole('textbox');

      // With the old behavior (before the fix), the input shows the entity ref
      // but may render differently in the dropdown, causing inconsistency
      expect(input).toHaveValue('group:default/team-a');

      // Now observe how EntityDisplayName would render the selected option:
      // We need to render a separate EntityDisplayName component to check what
      // the dropdown would render
      const { getByText } = await renderInTestApp(
        <TestApiProvider
          apis={[
            [catalogApiRef, testCatalogApi],
            [
              entityPresentationApiRef,
              {
                forEntity: jest.fn().mockReturnValue({
                  snapshot: mockEntityPresentation,
                  promise: Promise.resolve(mockEntityPresentation),
                }),
              },
            ],
          ]}
        >
          <EntityDisplayName
            entityRef={makeEntity('Group', 'default', 'team-a')}
          />
        </TestApiProvider>,
      );

      // EntityDisplayName would typically show a formatted version, not the raw reference
      expect(getByText('Team A')).toBeInTheDocument();

      // This demonstrates the inconsistency - one shows "group:default/team-a" (input)
      // while the other would show "Team A" (dropdown with EntityDisplayName)
    });

    it('renders consistent entity display between dropdown and selected value', async () => {
      // Mock the presentation API to return specific values for testing
      const mockEntityPresentation = {
        entityRef: 'group:default/team-a',
        primaryTitle: 'Team A',
      };

      // Create a catalog API that includes the specific test entity
      const testCatalogApi = catalogApiMock.mock({
        getEntities: jest.fn().mockResolvedValue({
          items: [makeEntity('Group', 'default', 'team-a')],
        }),
      });

      // Create mock entity presentation mapping
      const entityRefToPresentation = new Map();
      entityRefToPresentation.set(
        'group:default/team-a',
        mockEntityPresentation,
      );

      const renderResult = await renderInTestApp(
        <TestApiProvider
          apis={[
            [catalogApiRef, testCatalogApi],
            [
              entityPresentationApiRef,
              {
                forEntity: jest.fn().mockReturnValue({
                  snapshot: mockEntityPresentation,
                  promise: Promise.resolve(mockEntityPresentation),
                }),
              },
            ],
          ]}
        >
          <EntityPicker {...props} />
        </TestApiProvider>,
      );

      // Wait for the entity data to load and be processed
      // This is needed because the EntityPicker uses useAsync
      await new Promise(resolve => setTimeout(resolve, 100));

      // Force a re-render to apply the mocked data
      renderResult.rerender(
        <TestApiProvider
          apis={[
            [catalogApiRef, testCatalogApi],
            [
              entityPresentationApiRef,
              {
                forEntity: jest.fn().mockReturnValue({
                  snapshot: mockEntityPresentation,
                  promise: Promise.resolve(mockEntityPresentation),
                }),
              },
            ],
          ]}
        >
          <EntityPicker {...props} formData="group:default/team-a" />
        </TestApiProvider>,
      );

      // Force update to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify the selected value shows the correct display
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('Team A');

      // Open the dropdown
      fireEvent.mouseDown(input);

      // Check if dropdown shows the same representation
      const option = await screen.findByText('Team A');
      expect(option).toBeInTheDocument();
    });

    it('preserves the entity reference when selecting an entity with allowArbitraryValues enabled', async () => {
      // Create a test with allowArbitraryValues (which is the default)
      uiSchema = { 'ui:options': { allowArbitraryValues: true } };
      props = {
        onChange,
        schema,
        required,
        uiSchema,
        rawErrors,
        formData: undefined,
      } as unknown as FieldProps<string>;

      // Mock the presentation API to return specific values for testing
      const mockEntityPresentation = {
        entityRef: 'group:default/team-a',
        primaryTitle: 'Team A',
      };

      // Create a catalog API that includes the specific test entity
      const testCatalogApi = catalogApiMock.mock({
        getEntities: jest.fn().mockResolvedValue({
          items: [makeEntity('Group', 'default', 'team-a')],
        }),
      });

      // Create mock entity presentation mapping
      const entityRefToPresentation = new Map();
      entityRefToPresentation.set(
        'group:default/team-a',
        mockEntityPresentation,
      );

      const mockEntity = makeEntity('Group', 'default', 'team-a');

      await renderInTestApp(
        <TestApiProvider
          apis={[
            [catalogApiRef, testCatalogApi],
            [
              entityPresentationApiRef,
              {
                forEntity: jest.fn().mockReturnValue({
                  snapshot: mockEntityPresentation,
                  promise: Promise.resolve(mockEntityPresentation),
                }),
              },
            ],
          ]}
        >
          <EntityPicker {...props} />
        </TestApiProvider>,
      );

      // Wait for the entity data to load and be processed
      await new Promise(resolve => setTimeout(resolve, 100));

      // Open the dropdown
      const input = screen.getByRole('textbox');
      fireEvent.mouseDown(input);

      // Find and click on the "Team A" option
      const option = await screen.findByText('Team A');
      fireEvent.click(option);

      // Verify that onChange was called with the entity reference, not the display name
      expect(onChange).toHaveBeenCalledWith('group:default/team-a');
      expect(onChange).not.toHaveBeenCalledWith('Team A');
    });
  });
});
