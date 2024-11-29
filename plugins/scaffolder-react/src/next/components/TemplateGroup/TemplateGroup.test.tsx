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
jest.mock('../TemplateCard', () => ({ TemplateCard: jest.fn(() => null) }));

import React from 'react';
import { TemplateGroup } from './TemplateGroup';
import { render } from '@testing-library/react';
import { TemplateCard } from '../TemplateCard';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';

describe('TemplateGroup', () => {
  it('should render a card for each template with the template being passed as a prop', () => {
    const mockOnSelected = jest.fn();
    const mockTemplates: { template: TemplateEntityV1beta3 }[] = [
      {
        template: {
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          kind: 'Template',
          metadata: { name: 'test' },
          spec: {
            parameters: [],
            steps: [],
            type: 'website',
          },
        },
      },
      {
        template: {
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          kind: 'Template',
          metadata: { name: 'test2' },
          spec: {
            parameters: [],
            steps: [],
            type: 'service',
          },
        },
      },
    ];

    render(
      <TemplateGroup
        onSelected={mockOnSelected}
        title="Test"
        templates={mockTemplates}
      />,
    );

    expect(TemplateCard).toHaveBeenCalledTimes(2);

    for (const { template } of mockTemplates) {
      expect(TemplateCard).toHaveBeenCalledWith(
        expect.objectContaining({ template, onSelected: mockOnSelected }),
        {},
      );
    }
  });

  it('should use the passed in TemplateCard prop to render the template card', () => {
    const mockTemplateCardComponent = jest.fn(() => null);
    const mockOnSelected = jest.fn();
    const mockTemplates: { template: TemplateEntityV1beta3 }[] = [
      {
        template: {
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          kind: 'Template',
          metadata: { name: 'test' },
          spec: {
            parameters: [],
            steps: [],
            type: 'website',
          },
        },
      },
      {
        template: {
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          kind: 'Template',
          metadata: { name: 'test2' },
          spec: {
            parameters: [],
            steps: [],
            type: 'service',
          },
        },
      },
    ];

    render(
      <TemplateGroup
        onSelected={mockOnSelected}
        title="Test"
        templates={mockTemplates}
        components={{ CardComponent: mockTemplateCardComponent }}
      />,
    );

    expect(mockTemplateCardComponent).toHaveBeenCalledTimes(2);

    for (const { template } of mockTemplates) {
      expect(mockTemplateCardComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          onSelected: mockOnSelected,
          template,
        }),
        {},
      );
    }
  });
  it('should render the title when there are templates in the list', () => {
    const mockTemplates: { template: TemplateEntityV1beta3 }[] = [
      {
        template: {
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          kind: 'Template',
          metadata: { name: 'test' },
          spec: { parameters: [], steps: [], type: 'website' },
        },
      },
    ];

    const { getByText } = render(
      <TemplateGroup
        onSelected={jest.fn()}
        title="Test"
        templates={mockTemplates}
      />,
    );

    expect(getByText('Test')).toBeInTheDocument();
  });

  it('should allow for passing through a user given title component', () => {
    const TitleComponent = <p>Im a custom header</p>;
    const mockTemplates: { template: TemplateEntityV1beta3 }[] = [
      {
        template: {
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          kind: 'Template',
          metadata: { name: 'test' },
          spec: { parameters: [], steps: [], type: 'website' },
        },
      },
    ];
    const { getByText } = render(
      <TemplateGroup
        onSelected={jest.fn()}
        templates={mockTemplates}
        title={TitleComponent}
      />,
    );

    expect(getByText('Im a custom header')).toBeInTheDocument();
  });
});
