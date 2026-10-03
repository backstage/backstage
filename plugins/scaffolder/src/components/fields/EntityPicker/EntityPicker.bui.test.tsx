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

import { Entity } from '@backstage/catalog-model';
import {
  catalogApiRef,
  entityPresentationApiRef,
} from '@backstage/plugin-catalog-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { fireEvent, screen } from '@testing-library/react';
import { ComponentType, PropsWithChildren, ReactNode } from 'react';
import { EntityPicker } from './EntityPicker';
import { ScaffolderRJSFFieldProps as FieldProps } from '@backstage/plugin-scaffolder-react';
import { DefaultEntityPresentationApi } from '@backstage/plugin-catalog';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';

jest.mock('@backstage/plugin-scaffolder-react/alpha', () => ({
  ...jest.requireActual('@backstage/plugin-scaffolder-react/alpha'),
  useScaffolderTheme: () => 'bui',
}));

const makeEntity = (
  kind: string,
  namespace: string,
  name: string,
  title?: string,
): Entity => ({
  apiVersion: 'scaffolder.backstage.io/v1beta3',
  kind,
  metadata: title ? { namespace, name, title } : { namespace, name },
});

describe('<EntityPicker /> with bui theme', () => {
  const onChange = jest.fn();
  const schema = {};
  const rawErrors: string[] = [];

  let Wrapper: ComponentType<PropsWithChildren<{}>>;

  const catalogApi = catalogApiMock.mock({
    streamEntities: jest.fn(),
  });

  const entities: Entity[] = [
    makeEntity('Resource', 'default', 'my-subscription', 'My Subscription'),
    makeEntity('Resource', 'default', 'my-db', 'My DB'),
  ];

  const baseProps = (overrides: Partial<FieldProps<string>> = {}) =>
    ({
      onChange,
      schema,
      required: false,
      uiSchema: { 'ui:options': {} },
      rawErrors,
      formData: undefined,
      ...overrides,
    } as unknown as FieldProps<string>);

  beforeEach(() => {
    onChange.mockClear();
    catalogApi.streamEntities.mockReset();
    catalogApi.streamEntities.mockImplementation(async function* () {
      yield entities;
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

  it('does not clobber a valid selection on blur without defaultKind', async () => {
    await renderInTestApp(
      <Wrapper>
        <EntityPicker
          {...baseProps({ formData: 'resource:default/my-subscription' })}
        />
      </Wrapper>,
    );

    const input = screen.getByRole('combobox');

    // The display label of the selected entity is shown
    expect(input).toHaveValue('My Subscription');

    // Blurring must not re-commit the display label as an entity ref
    fireEvent.blur(input);

    expect(onChange).not.toHaveBeenCalled();
    expect(input).toHaveValue('My Subscription');
  });

  it('does not clobber a valid selection on blur with defaultKind set', async () => {
    await renderInTestApp(
      <Wrapper>
        <EntityPicker
          {...baseProps({
            formData: 'resource:default/my-subscription',
            uiSchema: {
              'ui:options': {
                defaultKind: 'Resource',
                defaultNamespace: 'default',
              },
            },
          })}
        />
      </Wrapper>,
    );

    const input = screen.getByRole('combobox');
    expect(input).toHaveValue('My Subscription');

    fireEvent.blur(input);

    // Previously the label would be re-parsed into a mangled ref such as
    // "resource:default/my subscription" and silently committed
    expect(onChange).not.toHaveBeenCalled();
  });

  it('still commits user-typed free text on blur', async () => {
    await renderInTestApp(
      <Wrapper>
        <EntityPicker
          {...baseProps({
            uiSchema: {
              'ui:options': {
                defaultKind: 'Group',
                defaultNamespace: 'default',
              },
            },
          })}
        />
      </Wrapper>,
    );

    const input = screen.getByRole('combobox');

    fireEvent.change(input, { target: { value: 'team-a' } });
    fireEvent.blur(input);

    expect(onChange).toHaveBeenCalledWith('group:default/team-a');
  });

  it('commits raw text on blur when it is not a valid entity ref and no defaultKind', async () => {
    await renderInTestApp(
      <Wrapper>
        <EntityPicker {...baseProps()} />
      </Wrapper>,
    );

    const input = screen.getByRole('combobox');

    fireEvent.change(input, { target: { value: 'some arbitrary value' } });
    fireEvent.blur(input);

    // allowArbitraryValues defaults to true; typed text is committed as-is
    expect(onChange).toHaveBeenCalledWith('some arbitrary value');
  });

  it('does not commit the display label as a ref when clearing the selection', async () => {
    await renderInTestApp(
      <Wrapper>
        <EntityPicker
          {...baseProps({ formData: 'resource:default/my-subscription' })}
        />
      </Wrapper>,
    );

    const input = screen.getByRole('combobox');
    expect(input).toHaveValue('My Subscription');

    // Simulate the clear action of the combobox: selection removed while the
    // input still holds the programmatically-set display label
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    expect(onChange).toHaveBeenCalledWith(undefined);
  });
});
