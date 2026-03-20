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
import { renderInTestApp } from '@backstage/test-utils';
import { fireEvent, screen } from '@testing-library/react';
import { AccordionField } from './AccordionField';
import { AccordionFieldProps } from './schema';
import { ScaffolderRJSFFieldProps as FieldProps } from '@backstage/plugin-scaffolder-react';

describe('<AccordionField />', () => {
  const MockSchemaField = jest.fn(() => null);

  const baseProps: FieldProps = {
    onChange: jest.fn(),
    onBlur: jest.fn(),
    onFocus: jest.fn(),
    schema: {
      type: 'object',
      title: 'Schema Title',
      properties: {
        field1: { type: 'string', title: 'Field 1' },
        field2: { type: 'string', title: 'Field 2' },
      },
    },
    uiSchema: {},
    idSchema: { $id: 'root' } as any,
    formData: undefined,
    errorSchema: {},
    registry: {
      fields: { SchemaField: MockSchemaField },
    } as any,
    rawErrors: [],
    disabled: false,
    readonly: false,
    name: 'test',
  } as unknown as FieldProps;

  beforeEach(() => {
    MockSchemaField.mockClear();
  });

  it('renders the title from ui:options, falls back to schema title, and toggles expansion', async () => {
    const propsWithCustomTitle = {
      ...baseProps,
      uiSchema: { 'ui:options': { accordionTitle: 'Advanced Configuration' } },
    } as unknown as AccordionFieldProps;

    await renderInTestApp(<AccordionField {...propsWithCustomTitle} />);

    // Custom title is rendered
    expect(screen.getByText('Advanced Configuration')).toBeInTheDocument();

    // Collapsed by default
    const button = screen.getByRole('button', {
      name: /advanced configuration/i,
    });
    expect(button).toHaveAttribute('aria-expanded', 'false');

    // Expands on click
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');

    // Child SchemaField components are rendered for each property
    expect(MockSchemaField).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'field1' }),
      expect.anything(),
    );
    expect(MockSchemaField).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'field2' }),
      expect.anything(),
    );
  });

  it('falls back to schema title when accordionTitle is not provided', async () => {
    await renderInTestApp(
      <AccordionField {...(baseProps as unknown as AccordionFieldProps)} />,
    );

    expect(screen.getByText('Schema Title')).toBeInTheDocument();
  });

  it('starts expanded when defaultExpanded is true', async () => {
    const propsWithDefaultExpanded = {
      ...baseProps,
      uiSchema: { 'ui:options': { defaultExpanded: true } },
    } as unknown as AccordionFieldProps;

    await renderInTestApp(<AccordionField {...propsWithDefaultExpanded} />);

    const button = screen.getByRole('button', { name: /schema title/i });
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('merges child field changes into the parent formData object', async () => {
    const onChange = jest.fn();
    const propsWithData = {
      ...baseProps,
      uiSchema: { 'ui:options': { defaultExpanded: true } },
      formData: { field1: 'existing' },
      onChange,
    } as unknown as AccordionFieldProps;

    await renderInTestApp(<AccordionField {...propsWithData} />);

    // Extract the onChange passed to field1's SchemaField and call it
    const calls = MockSchemaField.mock.calls as any[][];
    const field1Props = calls.find(call => call[0]?.name === 'field1')?.[0];
    field1Props.onChange('new value');

    expect(onChange).toHaveBeenCalledWith({ field1: 'new value' });
  });
});
