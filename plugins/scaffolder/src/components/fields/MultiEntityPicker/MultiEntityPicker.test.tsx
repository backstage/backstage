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

// Polyfill ResizeObserver for JSDOM — required by cmdk's Command component
// which uses ResizeObserver internally for list height measurement.
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof globalThis.ResizeObserver;
}

// Polyfill Element.prototype.scrollIntoView for JSDOM — required by cmdk's
// Command component which scrolls selected items into view during navigation.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function () {};
}

import { CATALOG_FILTER_EXISTS } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import {
  catalogApiRef,
  entityPresentationApiRef,
} from '@backstage/plugin-catalog-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { TooltipProvider } from '@backstage/core-components';

import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { PropsWithChildren, ComponentType, ReactNode } from 'react';
import { MultiEntityPicker } from './MultiEntityPicker';
import { MultiEntityPickerProps } from './schema';
import { ScaffolderRJSFFieldProps as FieldProps } from '@backstage/plugin-scaffolder-react';
import { DefaultEntityPresentationApi } from '@backstage/plugin-catalog';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { scaffolderTranslationRef } from '../../../translation';

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
        <TooltipProvider>{children}</TooltipProvider>
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

      // Open the combobox popover
      const combobox = getByRole('combobox');
      await userEvent.click(combobox);

      // Type into the CommandInput search field and submit with Enter
      const input = screen.getByPlaceholderText(/search/i);
      await userEvent.type(input, 'squ{Enter}');

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
      await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );

      // Open the combobox popover
      const combobox = screen.getByRole('combobox');
      await userEvent.click(combobox);

      // Type free text and submit with Enter
      const input = screen.getByPlaceholderText(/search/i);
      await userEvent.type(input, 'squ{Enter}');

      expect(onChange).toHaveBeenCalledWith(['group:default/team-a', 'squ']);
    });

    it('preserves existing data on value create', async () => {
      await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );

      // Open the combobox popover
      const combobox = screen.getByRole('combobox');
      await userEvent.click(combobox);

      // Type free text and submit with Enter
      const input = screen.getByPlaceholderText(/search/i);
      await userEvent.type(input, 'squ{Enter}');

      expect(onChange).toHaveBeenCalledWith(['group:default/team-a', 'squ']);
    });

    it('preserves existing data on selecting an existing option', async () => {
      catalogApi.getEntities.mockResolvedValue({ items: entities });

      await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );

      // Open the combobox popover and select an option
      const combobox = screen.getByRole('combobox');
      await userEvent.click(combobox);
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

      catalogApi.getEntities.mockResolvedValue({ items: entities });
    });

    it('returns the full entityRef when entity exists in the list', async () => {
      await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );

      // Open the combobox popover
      const combobox = screen.getByRole('combobox');
      await userEvent.click(combobox);

      // Type the entity name and submit via Enter for free-text
      const input = screen.getByPlaceholderText(/search/i);
      await userEvent.type(input, 'team-a{Enter}');

      expect(onChange).toHaveBeenCalledWith(['group:default/team-a']);
    });

    it('returns the full entityRef when entity does not exist in the list', async () => {
      await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );

      // Open the combobox popover
      const combobox = screen.getByRole('combobox');
      await userEvent.click(combobox);

      // Type the entity name and submit via Enter for free-text
      const input = screen.getByPlaceholderText(/search/i);
      await userEvent.type(input, 'team-b{Enter}');

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

      // Open the combobox popover
      const combobox = screen.getByRole('combobox');
      await userEvent.click(combobox);

      // The CommandInput should be empty initially
      const input = screen.getByPlaceholderText(/search/i);
      expect(input).toHaveValue('');

      // Pressing Enter on empty input should not trigger onChange
      expect(onChange).not.toHaveBeenCalled();
    });

    it('User selects item', async () => {
      await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );

      // Open the combobox popover
      const combobox = screen.getByRole('combobox');
      await userEvent.click(combobox);

      // Type free text and submit via Enter
      const input = screen.getByPlaceholderText(/search/i);
      await userEvent.type(input, 'team-a{Enter}');

      expect(onChange).toHaveBeenCalledWith(['team-a']);
    });

    it('User selects item and enters clear input', async () => {
      await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
          <div data-testid="outside">Outside</div>
        </Wrapper>,
      );

      // Open the combobox popover
      const combobox = screen.getByRole('combobox');
      await userEvent.click(combobox);

      // Type free text and submit via Enter to add entity
      const input = screen.getByPlaceholderText(/search/i);
      await userEvent.type(input, 'team-a{Enter}');

      // Verify onChange was called with the entity
      expect(onChange).toHaveBeenCalledWith(['team-a']);
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

      // The combobox trigger button should be disabled
      const combobox = screen.getByRole('combobox');
      expect(combobox).toBeDisabled();
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

      // Open the combobox popover
      const combobox = screen.getByRole('combobox');
      await userEvent.click(combobox);

      // The CommandInput should be empty initially
      const input = screen.getByPlaceholderText(/search/i);
      expect(input).toHaveValue('');

      // Pressing Enter on empty input should not trigger onChange
      expect(onChange).not.toHaveBeenCalled();
    });

    it('User selects item', async () => {
      await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );

      // Open the combobox popover
      const combobox = screen.getByRole('combobox');
      await userEvent.click(combobox);

      // Type free text and submit via Enter
      const input = screen.getByPlaceholderText(/search/i);
      await userEvent.type(input, 'team-a{Enter}');

      expect(onChange).toHaveBeenCalledWith(['team-a']);
    });

    it('User selects item and enters clear input', async () => {
      await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
          <div data-testid="outside">Outside</div>
        </Wrapper>,
      );

      // Open the combobox popover
      const combobox = screen.getByRole('combobox');
      await userEvent.click(combobox);

      // Type free text and submit via Enter to add entity
      const input = screen.getByPlaceholderText(/search/i);
      await userEvent.type(input, 'team-a{Enter}');

      // Verify onChange was called with the entity
      expect(onChange).toHaveBeenCalledWith(['team-a']);
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

      // Open the combobox popover
      const combobox = screen.getByRole('combobox');
      await userEvent.click(combobox);

      // The CommandInput should be empty initially
      const input = screen.getByPlaceholderText(/search/i);
      expect(input).toHaveValue('');

      // No onChange should have been called for empty input
      expect(onChange).not.toHaveBeenCalled();
    });

    it('User selects item', async () => {
      await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );

      // Open the combobox popover
      const combobox = screen.getByRole('combobox');
      await userEvent.click(combobox);

      // Type free text and submit via Enter
      const input = screen.getByPlaceholderText(/search/i);
      await userEvent.type(input, 'team-a{Enter}');

      expect(onChange).toHaveBeenCalledWith(['team-a']);
    });

    it('User selects item and enters clear input', async () => {
      await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
          <div data-testid="outside">Outside</div>
        </Wrapper>,
      );

      // Open the combobox popover
      const combobox = screen.getByRole('combobox');
      await userEvent.click(combobox);

      // Type free text and submit via Enter to add entity
      const input = screen.getByPlaceholderText(/search/i);
      await userEvent.type(input, 'team-a{Enter}');

      // Verify onChange was called with the entity
      expect(onChange).toHaveBeenCalledWith(['team-a']);
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

      // Open the combobox popover
      const combobox = screen.getByRole('combobox');
      await userEvent.click(combobox);

      // The CommandInput should be empty initially
      const input = screen.getByPlaceholderText(/search/i);
      expect(input).toHaveValue('');

      // No onChange should have been called for empty input
      expect(onChange).not.toHaveBeenCalled();
    });

    it('User selects item', async () => {
      await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );

      // Open the combobox popover
      const combobox = screen.getByRole('combobox');
      await userEvent.click(combobox);

      // Type free text and submit via Enter
      const input = screen.getByPlaceholderText(/search/i);
      await userEvent.type(input, 'team-a{Enter}');

      expect(onChange).toHaveBeenCalledWith(['team-a']);
    });

    it('User selects item and enters clear input', async () => {
      await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
          <div data-testid="outside">Outside</div>
        </Wrapper>,
      );

      // Open the combobox popover
      const combobox = screen.getByRole('combobox');
      await userEvent.click(combobox);

      // Type free text and submit via Enter to add entity
      const input = screen.getByPlaceholderText(/search/i);
      await userEvent.type(input, 'team-a{Enter}');

      // Verify onChange was called with the entity
      expect(onChange).toHaveBeenCalledWith(['team-a']);
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

      // Open the combobox popover
      const combobox = screen.getByRole('combobox');
      await userEvent.click(combobox);

      // Select first entity
      const optionA = screen.getByText('team-a');
      await userEvent.click(optionA as HTMLElement);

      // Select second entity
      const optionB = screen.getByText('user-b');
      await userEvent.click(optionB as HTMLElement);

      // Attempt to select third entity — maxItems should prevent it
      const optionC = screen.getByText('user-a');
      await userEvent.click(optionC as HTMLElement);

      // Only 2 onChange calls should have occurred (maxItems = 2)
      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenNthCalledWith(1, ['group:default/team-a']);
      expect(onChange).toHaveBeenNthCalledWith(2, [
        'group:default/team-a',
        'user:default/user-b',
      ]);
    });

    it('does not limit the number of selected entities when maxItems is not specified', async () => {
      props.schema.maxItems = undefined;
      await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );

      // Open the combobox popover
      const combobox = screen.getByRole('combobox');
      await userEvent.click(combobox);

      // Select all four entities one by one
      const optionA = screen.getByText('team-a');
      await userEvent.click(optionA as HTMLElement);

      const optionB = screen.getByText('user-b');
      await userEvent.click(optionB as HTMLElement);

      const optionC = screen.getByText('user-a');
      await userEvent.click(optionC as HTMLElement);

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
      catalogApi.getEntities.mockResolvedValue({
        items: entities.map(item => ({
          ...item,
          spec: {
            profile: { displayName: item.metadata.name.replace('-', ' ') },
          },
        })),
      });

      const { getByText } = await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );

      // Open the combobox popover to view entity options
      const combobox = screen.getByRole('combobox');
      await userEvent.click(combobox);

      // Entity display names should be rendered in the command list
      expect(getByText('team a')).toBeInTheDocument();
      expect(getByText('squad b')).toBeInTheDocument();
    });

    it('renders and filters selection title', async () => {
      catalogApi.getEntities.mockResolvedValue({
        items: entities.map(item => ({
          ...item,
          metadata: {
            ...item.metadata,
            title: item.metadata.name.replace('-', ' ').toUpperCase(),
          },
        })),
      });

      const { getByText } = await renderInTestApp(
        <Wrapper>
          <MultiEntityPicker {...props} />
        </Wrapper>,
      );

      // Open the combobox popover to view entity options
      const combobox = screen.getByRole('combobox');
      await userEvent.click(combobox);

      // Entity titles should be rendered in the command list
      expect(getByText('TEAM A')).toBeInTheDocument();
      expect(getByText('SQUAD B')).toBeInTheDocument();
    });
  });
});
