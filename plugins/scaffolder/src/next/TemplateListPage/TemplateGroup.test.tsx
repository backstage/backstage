/*
 * Copyright 2022 The Backstage Authors
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
jest.mock('./TemplateCard', () => ({ TemplateCard: jest.fn(() => null) }));

import React from 'react';
import { TemplateGroup } from './TemplateGroup';
import { render } from '@testing-library/react';
import { TemplateCard } from './TemplateCard';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';

describe('TemplateGroup', () => {
  it('should return a message when no templates are passed in', async () => {
    const { getByText } = render(<TemplateGroup title="Test" templates={[]} />);

    expect(
      getByText(/No templates found that match your filter/),
    ).toBeInTheDocument();
  });

  it('should render a card for each template with the template being passed as a prop', () => {
    const mockTemplates: TemplateEntityV1beta3[] = [
      {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'Template',
        metadata: { name: 'test' },
        spec: {
          parameters: [],
          steps: [],
          type: 'website',
        },
      },
      {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'Template',
        metadata: { name: 'test2' },
        spec: {
          parameters: [],
          steps: [],
          type: 'service',
        },
      },
    ];

    render(<TemplateGroup title="Test" templates={mockTemplates} />);

    expect(TemplateCard).toHaveBeenCalledTimes(2);

    for (const template of mockTemplates) {
      expect(TemplateCard).toHaveBeenCalledWith(
        expect.objectContaining({ template }),
        {},
      );
    }
  });

  it('should use the passed in TemplateCard prop to render the template card', () => {
    const mockTemplateCardComponent = jest.fn(() => null);

    const mockTemplates: TemplateEntityV1beta3[] = [
      {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'Template',
        metadata: { name: 'test' },
        spec: {
          parameters: [],
          steps: [],
          type: 'website',
        },
      },
      {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'Template',
        metadata: { name: 'test2' },
        spec: {
          parameters: [],
          steps: [],
          type: 'service',
        },
      },
    ];

    render(
      <TemplateGroup
        title="Test"
        templates={mockTemplates}
        components={{ CardComponent: mockTemplateCardComponent }}
      />,
    );

    expect(mockTemplateCardComponent).toHaveBeenCalledTimes(2);

    for (const template of mockTemplates) {
      expect(mockTemplateCardComponent).toHaveBeenCalledWith(
        expect.objectContaining({ template }),
        {},
      );
    }
  });

  it('should render the title when no templates passed', () => {
    const { getByText } = render(<TemplateGroup title="Test" templates={[]} />);
    expect(getByText('Test')).toBeInTheDocument();
  });

  it('should render the title when there are templates in the list', () => {
    const mockTemplates: TemplateEntityV1beta3[] = [
      {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'Template',
        metadata: { name: 'test' },
        spec: { parameters: [], steps: [], type: 'website' },
      },
    ];

    const { getByText } = render(
      <TemplateGroup title="Test" templates={mockTemplates} />,
    );

    expect(getByText('Test')).toBeInTheDocument();
  });

  it('should allow for passing through a user given title component', () => {
    const TitleComponent = <p>Im a custom header</p>;
    const { getByText } = render(
      <TemplateGroup templates={[]} title={TitleComponent} />,
    );

    expect(getByText('Im a custom header')).toBeInTheDocument();
  });
});
