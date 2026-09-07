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

import type { TemplateCardComponentProps } from '@backstage/plugin-scaffolder-react/alpha';
import { renderInTestApp } from '@backstage/frontend-test-utils';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockIsIntersecting } from 'react-intersection-observer/test-utils';
import { useLocation } from 'react-router-dom';
import { template as makeTemplate } from './fixtures';
import { FeaturedTemplates } from './FeaturedTemplates';
import { selectedTemplateRouteRef, templatesRouteRef } from './routes';

jest.mock('@backstage/plugin-scaffolder-react/alpha', () => ({
  TemplateCard: ({ template, onSelected }: TemplateCardComponentProps) => (
    <button onClick={onSelected}>{template.metadata.title}</button>
  ),
}));

const templates = [
  makeTemplate('first', 'First template', { namespace: 'other' }),
  makeTemplate('second', 'Second template'),
];

const mountedRoutes = {
  '/create': templatesRouteRef,
  '/create/templates/:namespace/:templateName': selectedTemplateRouteRef,
};

function mockScrollGeometry(region: HTMLElement) {
  const scrollBy = jest.fn();
  Object.defineProperty(region, 'scrollBy', { value: scrollBy });
  Object.defineProperty(region.children[0], 'offsetLeft', { value: 8 });
  Object.defineProperty(region.children[1], 'offsetLeft', { value: 264 });
  return scrollBy;
}

const Location = () => <output>{useLocation().pathname}</output>;

describe('FeaturedTemplates', () => {
  it('queries tagged templates, preserves order, and opens the selected form', async () => {
    const getEntities = jest.fn().mockResolvedValue({ items: templates });

    renderInTestApp(
      <>
        <FeaturedTemplates tag="featured" />
        <Location />
      </>,
      {
        apis: [catalogApiMock.mock({ getEntities })],
        mountedRoutes,
      },
    );

    expect(
      screen.getByTestId('featured-templates-loading'),
    ).toBeInTheDocument();
    const track = await screen.findByTestId('featured-templates-track');
    expect(
      within(track)
        .getAllByRole('button')
        .map(button => button.textContent),
    ).toEqual(['First template', 'Second template']);
    expect(getEntities).toHaveBeenCalledWith({
      filter: { kind: 'Template', 'metadata.tags': 'featured' },
    });

    await userEvent.click(
      screen.getByRole('button', { name: 'First template' }),
    );
    expect(
      screen.getByText('/create/templates/other/first'),
    ).toBeInTheDocument();
  });

  it('shows an empty state linking to all templates', async () => {
    renderInTestApp(<FeaturedTemplates tag="golden-path" />, {
      apis: [
        catalogApiMock.mock({
          getEntities: async () => ({ items: [] }),
        }),
      ],
      mountedRoutes,
    });

    expect(
      await screen.findByText('There are currently no templates to show.'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Browse all templates' }),
    ).toHaveAttribute('href', '/create');
  });

  it('shows an error and retries', async () => {
    const getEntities = jest
      .fn()
      .mockRejectedValueOnce(new Error('catalog unavailable'))
      .mockResolvedValueOnce({ items: templates });
    renderInTestApp(<FeaturedTemplates tag="featured" />, {
      apis: [catalogApiMock.mock({ getEntities })],
      mountedRoutes,
    });

    expect(
      await screen.findByText('Could not load templates.'),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(await screen.findByText('First template')).toBeInTheDocument();
    expect(getEntities).toHaveBeenCalledTimes(2);
  });

  it('scrolls by exactly one card', async () => {
    renderInTestApp(<FeaturedTemplates tag="featured" />, {
      apis: [
        catalogApiMock.mock({
          getEntities: async () => ({ items: templates }),
        }),
      ],
      mountedRoutes,
    });
    const track = await screen.findByTestId('featured-templates-track');
    const scrollBy = mockScrollGeometry(track);
    const [firstCard, lastCard] = Array.from(track.children) as HTMLElement[];
    mockIsIntersecting(firstCard, 1);
    mockIsIntersecting(lastCard, 0.6);
    expect(
      screen.queryByRole('button', { name: 'Previous templates' }),
    ).not.toBeInTheDocument();

    const next = screen.getByRole('button', { name: 'Next templates' });
    await userEvent.click(next);
    expect(scrollBy).toHaveBeenCalledWith({
      left: 256,
      behavior: 'smooth',
    });
  });
});
