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
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { DefaultEntityPresentationApi } from '@backstage/plugin-catalog';
import { ScaffolderRJSFFieldProps as FieldProps } from '@backstage/plugin-scaffolder-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { EntityPicker } from './EntityPicker';
import { EntityPickerProps } from './schema';

jest.mock('@backstage/plugin-scaffolder-react/alpha', () => ({
  ...jest.requireActual('@backstage/plugin-scaffolder-react/alpha'),
  useScaffolderTheme: () => 'bui',
}));

const makeEntity = (kind: string, name: string, title: string): Entity => ({
  apiVersion: 'backstage.io/v1alpha1',
  kind,
  metadata: { namespace: 'default', name, title },
});

describe('<EntityPicker /> with the BUI theme', () => {
  const entities = [
    makeEntity('System', 'salary-matrix', 'Salary matrix'),
    makeEntity('System', 'cloud-archive', 'Cloud Archive'),
  ];
  const catalogApi = catalogApiMock.mock({
    streamEntities: jest.fn(async function* () {
      yield entities;
    }),
  });
  const onChange = jest.fn();

  // Holds formData in state like the RJSF form does, so the field re-renders
  // with every value it commits.
  function StatefulPicker(props: {
    initialValue?: string;
    allowArbitraryValues: boolean;
  }) {
    const [formData, setFormData] = useState(props.initialValue);
    const uiSchema: EntityPickerProps['uiSchema'] = {
      'ui:options': {
        catalogFilter: { kind: 'System' },
        defaultKind: 'System',
        allowArbitraryValues: props.allowArbitraryValues,
      },
    };
    const fieldProps = {
      onChange: (value?: string) => {
        onChange(value);
        setFormData(value);
      },
      schema: { title: 'System' },
      required: false,
      uiSchema,
      rawErrors: [],
      formData,
    } as unknown as FieldProps<string>;

    return (
      <TestApiProvider
        apis={[
          [catalogApiRef, catalogApi],
          [
            entityPresentationApiRef,
            DefaultEntityPresentationApi.create({ catalogApi }),
          ],
        ]}
      >
        <EntityPicker {...fieldProps} />
      </TestApiProvider>
    );
  }

  afterEach(() => onChange.mockClear());

  describe.each([false, true])(
    'with allowArbitraryValues: %s',
    allowArbitraryValues => {
      it('clears the value when the user empties the input', async () => {
        await renderInTestApp(
          <StatefulPicker
            initialValue="system:default/salary-matrix"
            allowArbitraryValues={allowArbitraryValues}
          />,
        );
        const input = screen.getByRole('combobox');
        await waitFor(() => expect(input).toHaveValue('Salary matrix'));

        await userEvent.clear(input);
        await act(async () => input.blur());

        expect(onChange).toHaveBeenLastCalledWith(undefined);
        expect(input).toHaveValue('');
      });
    },
  );

  it('restores the selected label when the typed text is not committed', async () => {
    await renderInTestApp(
      <StatefulPicker
        initialValue="system:default/salary-matrix"
        allowArbitraryValues={false}
      />,
    );
    const input = screen.getByRole('combobox');
    await waitFor(() => expect(input).toHaveValue('Salary matrix'));

    // Overtype the selected label without emptying the input first.
    await userEvent.tripleClick(input);
    await userEvent.keyboard('sa');
    await act(async () => input.blur());

    // Free text is not allowed, so the selection stays and the input must
    // show it again instead of the uncommitted text.
    expect(onChange).not.toHaveBeenCalledWith(undefined);
    expect(input).toHaveValue('Salary matrix');
  });

  it('drops typed text that matches no option when free text is not allowed', async () => {
    await renderInTestApp(<StatefulPicker allowArbitraryValues={false} />);
    const input = screen.getByRole('combobox');

    await userEvent.type(input, 'sa');
    await act(async () => input.blur());

    expect(onChange).not.toHaveBeenCalledWith('sa');
    expect(input).toHaveValue('');
  });

  it('shows the label of an option the user selects', async () => {
    await renderInTestApp(<StatefulPicker allowArbitraryValues={false} />);
    const input = screen.getByRole('combobox');

    await userEvent.click(input);
    await userEvent.click(
      await screen.findByRole('option', { name: 'Cloud Archive' }),
    );

    expect(onChange).toHaveBeenLastCalledWith('system:default/cloud-archive');
    expect(input).toHaveValue('Cloud Archive');
  });

  it('keeps the selection and its label when the user leaves the field unchanged', async () => {
    await renderInTestApp(
      <StatefulPicker
        initialValue="system:default/salary-matrix"
        allowArbitraryValues={false}
      />,
    );
    const input = screen.getByRole('combobox');
    await waitFor(() => expect(input).toHaveValue('Salary matrix'));

    await userEvent.click(input);
    await act(async () => input.blur());

    expect(onChange).not.toHaveBeenCalledWith(undefined);
    expect(input).toHaveValue('Salary matrix');
  });
});
