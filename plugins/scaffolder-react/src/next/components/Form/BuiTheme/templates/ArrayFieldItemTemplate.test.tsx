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
import { render, screen, fireEvent, within } from '@testing-library/react';
import { validator } from '@internal/rjsf-validator';
import { Form } from '../../Form';

const schema = {
  type: 'array' as const,
  items: {
    type: 'object' as const,
    title: 'Service',
    properties: { name: { type: 'string' as const, title: 'Name' } },
  },
};

describe('BUI array item titles', () => {
  it('uses the item schema title, with a numbered fallback for untitled items', () => {
    const { rerender } = render(
      <Form
        validator={validator}
        schema={schema}
        formData={[{ name: 'web' }]}
        EXPERIMENTAL_theme="bui"
      />,
    );
    expect(
      within(
        screen.getByRole('button', { name: /^Collapse/ }).parentElement!,
      ).getByText('Service 1'),
    ).toBeInTheDocument();
    rerender(
      <Form
        validator={validator}
        schema={{ ...schema, items: { ...schema.items, title: undefined } }}
        formData={[{ name: 'web' }]}
        EXPERIMENTAL_theme="bui"
      />,
    );
    expect(
      within(
        screen.getByRole('button', { name: /^Collapse/ }).parentElement!,
      ).getByText('Item 1'),
    ).toBeInTheDocument();
  });

  it('honors an explicit item UI title and updates it without replacing the form value', () => {
    const onChange = jest.fn();
    const { rerender } = render(
      <Form
        validator={validator}
        schema={schema}
        uiSchema={{ items: { 'ui:title': 'New service' } }}
        formData={[{ name: '' }]}
        onChange={onChange}
        EXPERIMENTAL_theme="bui"
      />,
    );
    expect(
      within(
        screen.getByRole('button', { name: /^Collapse/ }).parentElement!,
      ).getByText('New service'),
    ).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'web' } });
    const formData = onChange.mock.calls.at(-1)![0].formData;
    expect(formData).toEqual([{ name: 'web' }]);
    rerender(
      <Form
        validator={validator}
        schema={schema}
        uiSchema={{ items: { 'ui:title': 'web' } }}
        formData={formData}
        onChange={onChange}
        EXPERIMENTAL_theme="bui"
      />,
    );
    expect(
      within(
        screen.getByRole('button', { name: /^Collapse/ }).parentElement!,
      ).getByText('web'),
    ).toBeInTheDocument();
    expect(screen.queryByText('New service')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('web');
  });
});
