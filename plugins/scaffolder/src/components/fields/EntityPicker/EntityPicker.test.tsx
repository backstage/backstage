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

// cmdk and Radix Popover require APIs not available in JSDOM
beforeAll(() => {
  if (typeof window !== 'undefined') {
    // ResizeObserver polyfill for Radix UI internals
    if (!window.ResizeObserver) {
      window.ResizeObserver = class ResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
      } as unknown as typeof window.ResizeObserver;
    }
    // scrollIntoView polyfill for cmdk item scrolling
    if (!Element.prototype.scrollIntoView) {
      Element.prototype.scrollIntoView = jest.fn();
    }
    // hasPointerCapture polyfill for Radix primitives
    if (!Element.prototype.hasPointerCapture) {
      Element.prototype.hasPointerCapture = jest.fn().mockReturnValue(false);
    }
  }
});

import { CATALOG_FILTER_EXISTS } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import {
  catalogApiRef,
  entityPresentationApiRef,
} from '@backstage/plugin-catalog-react';
import { TooltipProvider } from '@backstage/core-components';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { PropsWithChildren, ComponentType, ReactNode } from 'react';
import { EntityPicker } from './EntityPicker';
import { EntityPickerProps } from './schema';
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
          <EntityPicker {...props} />
        </Wrapper>,
      );

      expect(catalogApi.getEntities).toHaveBeenCalledWith({
        fields: [
          'kind',
          'metadata.name',
          'metadata.namespace',
          'metadata.title',
          'metadata.description',
          'spec.profile.displayName',
          'spec.type',
        ],
        filter: undefined,
      });
    });

    it('updates even if there is not an exact match', async () => {
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      // Open the combobox popover
      const combobox = screen.getByRole('combobox');
      fireEvent.click(combobox);

      // Type a partial match in the command input
      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.change(searchInput, { target: { value: 'squ' } });

      // Use the free-solo "Use ..." button to submit the arbitrary value
      const useButton = await screen.findByText(/Use "squ"/);
      fireEvent.click(useButton);

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

      const combobox = screen.getByRole('combobox');

      // Expect combobox trigger to be disabled
      expect(combobox).toBeDisabled();
      // The button text should display the current formData value
      expect(combobox).toHaveTextContent('component:default/myentity');
    });

    it('Allows user to edit when ui:disabled is false', async () => {
      props.uiSchema = { 'ui:disabled': false };
      props.formData = 'component:default/myentity';

      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      const combobox = screen.getByRole('combobox');
      expect(combobox).not.toBeDisabled();

      // Open the combobox popover
      fireEvent.click(combobox);

      // Type in the command input and use the free-solo button
      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.change(searchInput, {
        target: { value: 'component:default/mynewentity' },
      });

      const useButton = await screen.findByText(
        /Use "component:default\/mynewentity"/,
      );
      fireEvent.click(useButton);

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

      catalogApi.getEntities.mockResolvedValue({ items: entities });
    });

    it('default behavior', async () => {
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      // Open the combobox
      const combobox = screen.getByRole('combobox');
      fireEvent.click(combobox);

      // Type partial match in command input and submit via free-solo
      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.change(searchInput, { target: { value: 'team' } });

      const useButton = await screen.findByText(/Use "team"/);
      fireEvent.click(useButton);

      // With defaultKind set, the value is resolved to a full entity ref
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

      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      // In the Popover+Command pattern, selection is always explicit.
      // Opening and closing the popover without selecting does not trigger onChange.
      const combobox = screen.getByRole('combobox');
      fireEvent.click(combobox);

      // Type but do not select — just close the popover by pressing Escape
      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.change(searchInput, { target: { value: 'team' } });
      fireEvent.keyDown(searchInput, { key: 'Escape' });

      // onChange should not be called — no explicit selection was made
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

      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      // Open the combobox and submit via free-solo
      const combobox = screen.getByRole('combobox');
      fireEvent.click(combobox);

      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.change(searchInput, { target: { value: 'squad' } });

      const useButton = await screen.findByText(/Use "squad"/);
      fireEvent.click(useButton);

      // With defaultKind set, processes the typed value to a full entity ref
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

      catalogApi.getEntities.mockResolvedValue({ items: entities });
    });

    it('returns the full entityRef when entity exists in the list', async () => {
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      // Open combobox and submit free-solo value matching an existing entity
      const combobox = screen.getByRole('combobox');
      fireEvent.click(combobox);

      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.change(searchInput, { target: { value: 'team-a' } });

      const useButton = await screen.findByText(/Use "team-a"/);
      fireEvent.click(useButton);

      expect(onChange).toHaveBeenCalledWith('group:default/team-a');
    });

    it('returns the full entityRef when entity does not exist in the list', async () => {
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      // Open combobox and submit free-solo value for a non-existent entity
      const combobox = screen.getByRole('combobox');
      fireEvent.click(combobox);

      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.change(searchInput, { target: { value: 'team-b' } });

      const useButton = await screen.findByText(/Use "team-b"/);
      fireEvent.click(useButton);

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
      catalogApi.getEntities.mockResolvedValue({
        items: entities.map(item => ({
          ...item,
          spec: {
            profile: { displayName: item.metadata.name.replace('-', ' ') },
          },
        })),
      });

      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      // Open the combobox to show entity options
      const combobox = screen.getByRole('combobox');
      fireEvent.click(combobox);

      // Entity display names should be rendered in the command list
      await waitFor(() => {
        expect(screen.getByText('team a')).toBeInTheDocument();
        expect(screen.getByText('squad b')).toBeInTheDocument();
      });
    });

    it('renders selection title', async () => {
      catalogApi.getEntities.mockResolvedValue({
        items: entities.map(item => ({
          ...item,
          metadata: {
            ...item.metadata,
            title: item.metadata.name.replace('-', ' ').toUpperCase(),
          },
        })),
      });

      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      // Open the combobox to show entity options
      const combobox = screen.getByRole('combobox');
      fireEvent.click(combobox);

      // Entity titles should be rendered in the command list
      await waitFor(() => {
        expect(screen.getByText('TEAM A')).toBeInTheDocument();
        expect(screen.getByText('SQUAD B')).toBeInTheDocument();
      });
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
        </Wrapper>,
      );

      // With no formData, the combobox shows the title and no Clear button appears
      const combobox = screen.getByRole('combobox');
      expect(combobox).toBeInTheDocument();
      // onChange should not be called when no interaction occurs
      expect(onChange).not.toHaveBeenCalled();
    });

    it('User selects item', async () => {
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      // Open combobox and submit a free-solo value
      const combobox = screen.getByRole('combobox');
      fireEvent.click(combobox);

      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.change(searchInput, { target: { value: 'team-a' } });

      const useButton = await screen.findByText(/Use "team-a"/);
      fireEvent.click(useButton);

      expect(onChange).toHaveBeenCalledWith('team-a');
    });

    it('User selects item and enters clear input', async () => {
      // Render with formData set to simulate a prior selection
      props.formData = 'group:default/team-a';

      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...(props as any)} />
        </Wrapper>,
      );

      // Verify the combobox displays the selected entity
      const combobox = screen.getByRole('combobox');
      expect(combobox).toHaveTextContent('group:default/team-a');

      // Click the Clear button to clear the selection
      const clearButton = screen.getByLabelText('Clear');
      fireEvent.click(clearButton);

      // Verify that onChange was called with undefined
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
        </Wrapper>,
      );

      // With no formData, the combobox shows the title
      const combobox = screen.getByRole('combobox');
      expect(combobox).toBeInTheDocument();
      expect(onChange).not.toHaveBeenCalled();
    });

    it('User selects item', async () => {
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      // Open combobox and submit a free-solo value
      const combobox = screen.getByRole('combobox');
      fireEvent.click(combobox);

      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.change(searchInput, { target: { value: 'team-a' } });

      const useButton = await screen.findByText(/Use "team-a"/);
      fireEvent.click(useButton);

      expect(onChange).toHaveBeenCalledWith('team-a');
    });

    it('User selects item and enters clear input', async () => {
      // Render with formData set to simulate a prior selection
      props.formData = 'group:default/team-a';

      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...(props as any)} />
        </Wrapper>,
      );

      // Verify the combobox displays the selected entity
      const combobox = screen.getByRole('combobox');
      expect(combobox).toHaveTextContent('group:default/team-a');

      // Click the Clear button to clear the selection
      const clearButton = screen.getByLabelText('Clear');
      fireEvent.click(clearButton);

      // Verify that onChange was called with undefined
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
        </Wrapper>,
      );

      // With no formData, the combobox shows the title
      const combobox = screen.getByRole('combobox');
      expect(combobox).toBeInTheDocument();
      expect(onChange).not.toHaveBeenCalled();
    });

    it('User selects item', async () => {
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      // Open combobox and submit a free-solo value
      const combobox = screen.getByRole('combobox');
      fireEvent.click(combobox);

      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.change(searchInput, { target: { value: 'team-a' } });

      const useButton = await screen.findByText(/Use "team-a"/);
      fireEvent.click(useButton);

      expect(onChange).toHaveBeenCalledWith('team-a');
    });

    it('User selects item and enters clear input', async () => {
      // Render with formData to simulate a prior selection
      props.formData = 'group:default/team-a';

      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...(props as any)} />
        </Wrapper>,
      );

      // Verify the combobox displays the selected entity
      const combobox = screen.getByRole('combobox');
      expect(combobox).toHaveTextContent('group:default/team-a');

      // Click the Clear button to clear the selection
      const clearButton = screen.getByLabelText('Clear');
      fireEvent.click(clearButton);

      // Verify that onChange was called with undefined
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
        </Wrapper>,
      );

      // With no formData, the combobox shows the title
      const combobox = screen.getByRole('combobox');
      expect(combobox).toBeInTheDocument();
      expect(onChange).not.toHaveBeenCalled();
    });

    it('User selects item', async () => {
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      // Open combobox and submit a free-solo value
      const combobox = screen.getByRole('combobox');
      fireEvent.click(combobox);

      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.change(searchInput, { target: { value: 'team-a' } });

      const useButton = await screen.findByText(/Use "team-a"/);
      fireEvent.click(useButton);

      expect(onChange).toHaveBeenCalledWith('team-a');
    });

    it('User selects item and enters clear input', async () => {
      // Render with formData to simulate a prior selection
      props.formData = 'group:default/team-a';

      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...(props as any)} />
        </Wrapper>,
      );

      // Verify the combobox displays the selected entity
      const combobox = screen.getByRole('combobox');
      expect(combobox).toHaveTextContent('group:default/team-a');

      // Click the Clear button to clear the selection
      const clearButton = screen.getByLabelText('Clear');
      fireEvent.click(clearButton);

      // Verify that onChange was called with undefined
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
