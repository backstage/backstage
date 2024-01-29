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
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TemplateAutocomplete from './TemplateAutocompleteComponent';

describe('TemplateAutocomplete', () => {
  const mockOnTemplateChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call onTemplateChange when a template is selected', () => {
    render(<TemplateAutocomplete onTemplateChange={mockOnTemplateChange} />);

    const templateInput = screen.getByLabelText('Template Name');
    fireEvent.change(templateInput, { target: { value: 'Template 1' } });

    expect(mockOnTemplateChange).toHaveBeenCalledWith('Template 1');
  });

  it('should render CircularProgress when data is not available', () => {
    render(<TemplateAutocomplete onTemplateChange={mockOnTemplateChange} />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render Autocomplete with options when data is available', () => {
    const mockData = {
      templates: ['Template 1', 'Template 2', 'Template 3'],
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockData),
    } as any);

    render(<TemplateAutocomplete onTemplateChange={mockOnTemplateChange} />);

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Template Name')).toBeInTheDocument();

    const autocompleteInput = screen.getByRole('textbox');
    fireEvent.focus(autocompleteInput);

    const option1 = screen.getByText('Template 1');
    const option2 = screen.getByText('Template 2');
    const option3 = screen.getByText('Template 3');

    expect(option1).toBeInTheDocument();
    expect(option2).toBeInTheDocument();
    expect(option3).toBeInTheDocument();
  });
});
