/*
 * Copyright 2024 The Backstage Authors
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
import { render, screen, fireEvent } from '@testing-library/react';
import TemplateTaskAutocomplete from './TemplateTaskAutocompleteComponent';
import React from 'react';

describe('TemplateTaskAutocompleteComponent', () => {
  test('renders autocomplete component', () => {
    render(<TemplateTaskAutocomplete onTemplateTaskChange={() => {}} />);
    const autocompleteElement = screen.getByRole('combobox');
    expect(autocompleteElement).toBeInTheDocument();
  });

  test('calls onTemplateTaskChange when a template task is selected', () => {
    const mockOnTemplateTaskChange = jest.fn();
    render(
      <TemplateTaskAutocomplete
        onTemplateTaskChange={mockOnTemplateTaskChange}
      />,
    );
    const autocompleteElement = screen.getByRole('combobox');
    fireEvent.change(autocompleteElement, { target: { value: 'Task 1' } });
    expect(mockOnTemplateTaskChange).toHaveBeenCalledWith('Task 1');
  });

  test('displays loading indicator when data is not available', () => {
    render(<TemplateTaskAutocomplete onTemplateTaskChange={() => {}} />);
    const loadingIndicator = screen.getByRole('progressbar');
    expect(loadingIndicator).toBeInTheDocument();
  });

  test('displays template tasks when data is available', () => {
    const mockData = {
      templateTasks: ['Task 1', 'Task 2', 'Task 3'],
    };
    jest.spyOn(global, 'fetch').mockImplementation(
      (): Promise<Response> =>
        Promise.resolve({
          json: () => Promise.resolve(mockData),
          headers: new Headers(),
          ok: true,
          redirected: false,
          status: 200,
          statusText: 'OK',
          type: 'basic',
          url: '',
          body: null,
          bodyUsed: false,
          clone: () => null,
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
          blob: () => Promise.resolve(new Blob()),
          formData: () => Promise.resolve(new FormData()),
          text: () => Promise.resolve(''),
          trailer: Promise.resolve(new Headers()),
          error: null,
          timeout: 0,
          useFinalURL: false,
        }) as unknown as Promise<Response>,
    );
    render(<TemplateTaskAutocomplete onTemplateTaskChange={() => {}} />);
    const templateTaskOptions = screen.getAllByRole('option');
    expect(templateTaskOptions).toHaveLength(mockData.templateTasks.length);
    expect(templateTaskOptions[0]).toHaveTextContent('Task 1');
    expect(templateTaskOptions[1]).toHaveTextContent('Task 2');
    expect(templateTaskOptions[2]).toHaveTextContent('Task 3');
  });
});
