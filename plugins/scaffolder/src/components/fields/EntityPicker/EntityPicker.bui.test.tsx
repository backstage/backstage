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
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { ComponentType, PropsWithChildren, ReactNode } from 'react';
import { EntityPicker } from './EntityPicker';
import { EntityPickerProps } from './schema';
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
  apiVersion: 'backstage.io/v1alpha1',
  kind,
  metadata: { namespace, name, ...(title ? { title } : {}) },
});

describe('<EntityPicker /> with BUI theme', () => {
  const entities: Entity[] = [
    makeEntity('Group', 'default', 'team-a', 'Team A'),
    makeEntity('Group', 'default', 'squad-b', 'Squad B'),
  ];
  const onChange = jest.fn();
  const schema = {};
  const required = false;
  const rawErrors: string[] = [];
  let uiSchema: EntityPickerProps['uiSchema'];
  let props: FieldProps<string>;

  const catalogApi = catalogApiMock.mock({
    streamEntities: jest.fn(async function* () {
      yield entities;
    }),
  });

  let Wrapper: ComponentType<PropsWithChildren<{}>>;

  beforeEach(() => {
    uiSchema = { 'ui:options': { allowArbitraryValues: true } };
    props = {
      onChange,
      schema,
      required,
      uiSchema,
      rawErrors,
      formData: undefined,
    } as unknown as FieldProps;

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

  it('does not re-commit the display label as value on blur', async () => {
    await renderInTestApp(
      <Wrapper>
        <EntityPicker {...props} formData="group:default/team-a" />
      </Wrapper>,
    );

    const input = await screen.findByRole('combobox');
    // The input shows the presentation title of the committed selection
    await waitFor(() => expect(input).toHaveValue('Team A'));

    fireEvent.blur(input);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('still commits free-form values on blur', async () => {
    await renderInTestApp(
      <Wrapper>
        <EntityPicker {...props} />
      </Wrapper>,
    );

    const input = await screen.findByRole('combobox');
    fireEvent.change(input, { target: { value: 'squ' } });
    fireEvent.blur(input);

    expect(onChange).toHaveBeenCalledWith('squ');
  });
});
