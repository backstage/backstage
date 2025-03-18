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

import { fireEvent, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import React from 'react';
import { MultiEntityPicker } from './MultiEntityPicker';
import { MultiEntityPickerProps } from './schema';
import { ScaffolderRJSFFieldProps as FieldProps } from '@backstage/plugin-scaffolder-react';
import { DefaultEntityPresentationApi } from '@backstage/plugin-catalog';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';

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
  const schema = {};
  const required = false;
  let uiSchema: MultiEntityPickerProps['uiSchema'];
  const rawErrors: string[] = [];
  const formData: string[] = [];

  let props: FieldProps<string[]>;

  const catalogApi = catalogApiMock.mock({
    getEntities: jest.fn(async () => ({ items: entities })),
  });
  let Wrapper: React.ComponentType<React.PropsWithChildren<{}>>;

  beforeEach(() => {
    Wrapper = ({ children }: { children?: React.ReactNode }) => (
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
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );

      expect(catalogApi.getEntities).toHaveBeenCalledWith(undefined);
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
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );

      expect(catalogApi.getEntities).toHaveBeenCalledWith({
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
      });
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
          <MultiEntityPicker {...props} uiSchema={uiSchema} />
        </Wrapper>,
      );

      expect(catalogApi.getEntities).toHaveBeenCalledWith({
        filter: {
          kind: ['Group'],
          'metadata.name': 'test-entity',
        },
      });
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
          <MultiEntityPicker {...props} uiSchema={uiSchemaWithBoolean} />
        </Wrapper>,
      );

      expect(catalogApi.getEntities).toHaveBeenCalledWith({
        filter: [
          {
            kind: ['User'],
            'metadata.annotation.some/anotation': CATALOG_FILTER_EXISTS,
          },
        ],
      });
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
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );

      expect(catalogApi.getEntities).toHaveBeenCalledWith({
        filter: [
          {
            kind: ['Group'],
            'metadata.name': 'test-group',
          },
        ],
      });
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

      catalogApi.getEntities.mockResolvedValue({ items: entities });
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

      catalogApi.getEntities.mockResolvedValue({ items: entities });
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

      catalogApi.getEntities.mockResolvedValue({ items: entities });
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

      catalogApi.getEntities.mockResolvedValue({ items: entities });
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

      catalogApi.getEntities.mockResolvedValue({ items: entities });
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

      catalogApi.getEntities.mockResolvedValue({ items: testEntities });
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
});
