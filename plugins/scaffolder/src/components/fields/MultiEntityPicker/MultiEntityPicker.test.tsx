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
} from '@backstage/plugin-catalog-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { PropsWithChildren, ComponentType, ReactNode } from 'react';
import { MultiEntityPicker } from './MultiEntityPicker';
import { MultiEntityPickerProps } from './schema';
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
const originalIntersectionObserver = globalThis.IntersectionObserver;

const makeEntity = (kind: string, namespace: string, name: string): Entity => ({
  apiVersion: 'scaffolder.backstage.io/v1beta3',
  kind,
  metadata: { namespace, name },
});

describe('<MultiEntityPicker />', () => {
  const entities: Entity[] = [
    makeEntity('Group', 'default', 'team-a'),
    makeEntity('Group', 'default', 'squad-b'),
  ];
  const onChange = jest.fn();
  const schema = { type: 'array', items: { type: 'string' } };
  const required = false;
  let uiSchema: MultiEntityPickerProps['uiSchema'];
  const rawErrors: string[] = [];
  const formData: string[] = [];

  let props: FieldProps<string[]>;

  const catalogApi = catalogApiMock.mock();
  let Wrapper: ComponentType<PropsWithChildren<{}>>;

  beforeEach(() => {
    mockUseScaffolderTheme.mockReturnValue('mui');
    Object.defineProperty(globalThis, 'IntersectionObserver', {
      configurable: true,
      value: class {
        readonly root = null;
        readonly rootMargin = '';
        readonly thresholds = [];
        disconnect() {}
        observe() {}
        takeRecords() {
          return [];
        }
        unobserve() {}
      },
    });
    catalogApi.queryEntities.mockResolvedValue({
      items: entities,
      totalItems: 0,
      pageInfo: {},
    });
    catalogApi.getEntitiesByRefs.mockResolvedValue({ items: [] });
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

  afterEach(() => {
    jest.resetAllMocks();
    Object.defineProperty(globalThis, 'IntersectionObserver', {
      configurable: true,
      value: originalIntersectionObserver,
    });
  });

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
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );

      expect(catalogApi.queryEntities).toHaveBeenCalledWith({
        limit: 20,
        orderFields: [{ field: 'metadata.name', order: 'asc' }],
        totalItems: 'exclude',
      });
    });

    it('updates even if there is not an exact match', async () => {
      const { getByRole } = await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );

      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'squ' } });
      fireEvent.blur(input);

      expect(onChange).toHaveBeenCalledWith(['squ']);
    });

    it('filters entities through the catalog as the user types', async () => {
      const { getByRole } = await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
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

    it('clears BUI server filtering after selecting an entity', async () => {
      mockUseScaffolderTheme.mockReturnValue('bui');
      await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );
      const input = screen.getByRole('combobox');

      fireEvent.change(input, { target: { value: 'team' } });
      await waitFor(() =>
        expect(catalogApi.queryEntities).toHaveBeenCalledTimes(2),
      );
      await userEvent.click(
        screen.getByRole('button', { name: /Show suggestions/ }),
      );
      await userEvent.click(
        await screen.findByRole('option', { name: 'team-a' }),
      );

      expect(onChange).toHaveBeenCalledWith(['group:default/team-a']);
      await waitFor(() =>
        expect(catalogApi.queryEntities).toHaveBeenCalledTimes(3),
      );
      expect(catalogApi.queryEntities).toHaveBeenLastCalledWith(
        expect.not.objectContaining({ fullTextFilter: expect.anything() }),
      );
    });

    it('looks up valid selected refs without arbitrary values', async () => {
      props = {
        ...props,
        formData: ['arbitrary-value', 'group:default/team-a'],
      } as unknown as FieldProps<string[]>;

      await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );
      await waitFor(() =>
        expect(catalogApi.queryEntities).toHaveBeenCalledTimes(1),
      );

      expect(catalogApi.getEntitiesByRefs).toHaveBeenCalledWith({
        entityRefs: ['group:default/team-a'],
      });
    });

    it('does not offer or add a canonical duplicate of a shorthand BUI value', async () => {
      mockUseScaffolderTheme.mockReturnValue('bui');
      catalogApi.getEntitiesByRefs.mockResolvedValueOnce({
        items: [
          {
            ...entities[0],
            metadata: { ...entities[0].metadata, title: 'Team A' },
          },
        ],
      });
      props = {
        ...props,
        formData: ['team-a'],
        uiSchema: { 'ui:options': { defaultKind: 'Group' } },
      } as unknown as FieldProps<string[]>;
      await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );
      const input = screen.getByRole('combobox');
      await userEvent.click(
        screen.getByRole('button', { name: /Show suggestions/ }),
      );

      expect(screen.getByText('Team A')).toBeInTheDocument();
      expect(
        screen.queryByRole('option', { name: 'Team A' }),
      ).not.toBeInTheDocument();
      fireEvent.change(input, { target: { value: 'team-a' } });
      fireEvent.blur(input);
      expect(onChange).not.toHaveBeenCalled();
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

      catalogApi.streamEntities.mockImplementation(async function* () {
        yield entities;
      });
    });

    it('searches for a specific group entity', async () => {
      await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
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

      catalogApi.streamEntities.mockImplementation(async function* () {
        yield entities;
      });

      await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} uiSchema={uiSchema} />
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

    it('search for entities containing an specific key', async () => {
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
          <MultiEntityPicker {...props} uiSchema={uiSchemaWithBoolean} />
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

      catalogApi.streamEntities.mockImplementation(async function* () {
        yield entities;
      });
    });

    it('searches for a Group entity', async () => {
      await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
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

  describe('with existing form data', () => {
    beforeEach(() => {
      uiSchema = { 'ui:options': {} };
      props = {
        onChange,
        schema,
        required,
        uiSchema,
        rawErrors,
        formData: ['group:default/team-a'],
      } as unknown as FieldProps;
    });

    it('preserves existing data on blur', async () => {
      const { getByRole } = await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );

      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'squ' } });
      fireEvent.blur(input);

      expect(onChange).toHaveBeenCalledWith(['group:default/team-a', 'squ']);
    });

    it('preserves existing data on value create', async () => {
      const { getByRole } = await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );

      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'squ' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(onChange).toHaveBeenCalledWith(['group:default/team-a', 'squ']);
    });

    it('preserves existing data on selecting an existing option', async () => {
      catalogApi.streamEntities.mockImplementation(async function* () {
        yield entities;
      });

      const { getByRole } = await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );

      const input = getByRole('textbox');

      fireEvent.mouseDown(input);
      const optionA = screen.getByText('squad-b');
      await userEvent.click(optionA as HTMLElement);

      expect(onChange).toHaveBeenCalledWith([
        'group:default/team-a',
        'group:default/squad-b',
      ]);
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

      catalogApi.streamEntities.mockImplementation(async function* () {
        yield entities;
      });
    });

    it('returns the full entityRef when entity exists in the list', async () => {
      const { getByRole } = await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );

      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'team-a' } });
      fireEvent.blur(input);

      expect(onChange).toHaveBeenCalledWith(['group:default/team-a']);
    });

    it('returns the full entityRef when entity does not exist in the list', async () => {
      const { getByRole } = await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );

      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'team-b' } });
      fireEvent.blur(input);

      expect(onChange).toHaveBeenCalledWith(['group:default/team-b']);
    });
  });

  describe('Required MultiEntityPicker', () => {
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

      catalogApi.streamEntities.mockImplementation(async function* () {
        yield entities;
      });
    });

    it('User enters clear input', async () => {
      await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
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
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );

      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: 'team-a' } });
      fireEvent.blur(input);

      expect(onChange).toHaveBeenCalledWith(['team-a']);
    });

    it('User selects item and enters clear input', async () => {
      await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
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

      // Verify that the handleChange function was called with an empty array
      expect(onChange).toHaveBeenCalledWith([]);
    });
  });

  describe('ui:disabled MultiEntityPicker', () => {
    beforeEach(() => {
      uiSchema = {
        'ui:options': {
          allowArbitraryValues: true,
        },
        'ui:disabled': true,
      };
      props = {
        onChange,
        schema,
        required: true,
        uiSchema,
        rawErrors,
        formData,
      } as unknown as FieldProps<any>;

      catalogApi.streamEntities.mockImplementation(async function* () {
        yield entities;
      });
    });
    it('Prevents user from modifying input when ui:disabled is true', async () => {
      props.formData = ['component/default:myentity'];
      await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );

      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });
  });

  describe('Optional MultiEntityPicker', () => {
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

      catalogApi.streamEntities.mockImplementation(async function* () {
        yield entities;
      });
    });

    it('User enters clear input', async () => {
      await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
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
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );

      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: 'team-a' } });
      fireEvent.blur(input);

      expect(onChange).toHaveBeenCalledWith(['team-a']);
    });

    it('User selects item and enters clear input', async () => {
      await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
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

      // Verify that the handleChange function was called with an empty array
      expect(onChange).toHaveBeenCalledWith([]);
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

      catalogApi.streamEntities.mockImplementation(async function* () {
        yield entities;
      });
    });

    it('User enters clear input', async () => {
      await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
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
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );

      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: 'team-a' } });
      fireEvent.blur(input);

      expect(onChange).toHaveBeenCalledWith(['team-a']);
    });

    it('User selects item and enters clear input', async () => {
      await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
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

      // Verify that the handleChange function was called with an empty array
      expect(onChange).toHaveBeenCalledWith([]);
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

      catalogApi.streamEntities.mockImplementation(async function* () {
        yield entities;
      });
    });

    it('User enters clear input', async () => {
      await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
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
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );

      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: 'team-a' } });
      fireEvent.blur(input);

      expect(onChange).toHaveBeenCalledWith(['team-a']);
    });

    it('User selects item and enters clear input', async () => {
      await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
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

      // Verify that the handleChange function was called with an empty array
      expect(onChange).toHaveBeenCalledWith([]);
    });
  });

  describe('Multiselect maxNoOfEntities option', () => {
    beforeEach(() => {
      const testEntities = [
        makeEntity('Group', 'default', 'team-a'),
        makeEntity('Group', 'default', 'squad-b'),
        makeEntity('User', 'default', 'user-a'),
        makeEntity('User', 'default', 'user-b'),
      ];

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

      catalogApi.queryEntities.mockResolvedValue({
        items: testEntities,
        totalItems: 0,
        pageInfo: {},
      });
    });

    it('limit the number of selected entities when maxNoOfEntities is specified', async () => {
      props.schema.maxItems = 2;
      await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );

      const input = screen.getByRole('textbox');

      fireEvent.mouseDown(input);
      const optionA = screen.getByText('team-a');
      await userEvent.click(optionA as HTMLElement);

      fireEvent.mouseDown(input);
      const optionB = screen.getByText('user-b');
      await userEvent.click(optionB as HTMLElement);

      fireEvent.mouseDown(input);
      const optionC = screen.getByText('user-a');
      await expect(() =>
        userEvent.click(optionC as HTMLElement),
      ).rejects.toThrow(/pointer-events: none/);

      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenNthCalledWith(1, ['group:default/team-a']);
      expect(onChange).toHaveBeenNthCalledWith(2, [
        'group:default/team-a',
        'user:default/user-b',
      ]);
      expect(onChange).not.toHaveBeenNthCalledWith(3, [
        'group:default/team-a',
        'user:default/user-b',
        'user:default/user-a',
      ]);
    });

    it('does not limit the number of selected entities when maxItems is not specified', async () => {
      props.schema.maxItems = undefined;
      await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );

      const input = screen.getByRole('textbox');

      fireEvent.mouseDown(input);
      const optionA = screen.getByText('team-a');
      await userEvent.click(optionA as HTMLElement);

      fireEvent.mouseDown(input);
      const optionB = screen.getByText('user-b');
      await userEvent.click(optionB as HTMLElement);

      fireEvent.mouseDown(input);
      const optionC = screen.getByText('user-a');
      await userEvent.click(optionC as HTMLElement);

      fireEvent.mouseDown(input);
      const optionD = screen.getByText('squad-b');
      await userEvent.click(optionD as HTMLElement);

      expect(onChange).toHaveBeenCalledTimes(4);
      expect(onChange).toHaveBeenNthCalledWith(1, ['group:default/team-a']);
      expect(onChange).toHaveBeenNthCalledWith(2, [
        'group:default/team-a',
        'user:default/user-b',
      ]);
      expect(onChange).toHaveBeenNthCalledWith(3, [
        'group:default/team-a',
        'user:default/user-b',
        'user:default/user-a',
      ]);
      expect(onChange).toHaveBeenNthCalledWith(4, [
        'group:default/team-a',
        'user:default/user-b',
        'user:default/user-a',
        'group:default/squad-b',
      ]);
    });
  });

  describe('MultiEntityPicker description', () => {
    const description = {
      fromSchema: 'MultiEntityPicker description from schema',
      fromUiSchema: 'MultiEntityPicker description from uiSchema',
    } as { fromSchema: string; fromUiSchema: string; default?: string };

    beforeEach(() => {
      const RealWrapper = Wrapper;
      Wrapper = ({ children }: { children?: ReactNode }) => {
        const { t } = useTranslationRef(scaffolderTranslationRef);
        description.default = t('fields.multiEntityPicker.description');
        return <RealWrapper>{children}</RealWrapper>;
      };
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
    });
    it('presents default description', async () => {
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
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );
      expect(getByText(description.default!)).toBeInTheDocument();
      expect(queryByText(description.fromSchema)).toBe(null);
      expect(queryByText(description.fromUiSchema)).toBe(null);
    });

    it('presents schema description', async () => {
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
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );
      expect(queryByText(description.default!)).toBe(null);
      expect(getByText(description.fromSchema)).toBeInTheDocument();
      expect(queryByText(description.fromUiSchema)).toBe(null);
    });

    it('presents uiSchema description', async () => {
      props = {
        onChange,
        schema: {
          ...schema,
          description: description.fromSchema,
        },
        required: true,
        uiSchema: {
          ...uiSchema,
          'ui:description': description.fromUiSchema,
        },
        rawErrors,
        formData,
      } as unknown as FieldProps<any>;

      const { getByText, queryByText } = await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );
      expect(queryByText(description.default!)).toBe(null);
      expect(queryByText(description.fromSchema)).toBe(null);
      expect(getByText(description.fromUiSchema)).toBeInTheDocument();
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

    it('renders and filters selection displayName', async () => {
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
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );

      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'team a' } });

      expect(getByText('team a')).toBeInTheDocument();

      fireEvent.change(input, { target: { value: 'squad b' } });

      expect(getByText('squad b')).toBeInTheDocument();

      fireEvent.blur(input);
    });

    it('renders and filters selection title', async () => {
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
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );

      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'team a' } });

      expect(getByText('TEAM A')).toBeInTheDocument();

      fireEvent.change(input, { target: { value: 'squad b' } });

      expect(getByText('SQUAD B')).toBeInTheDocument();

      fireEvent.blur(input);
    });
  });
});
