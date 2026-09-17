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

import { TechDocsAddonTester } from '@backstage/plugin-techdocs-addons-test-utils';
import { act, fireEvent, waitFor } from '@testing-library/react';
import { screen } from 'shadow-dom-testing-library';
import { TextSize } from '../plugin';
import { useShadowRootElements } from '@backstage/plugin-techdocs-react';
import { entityPresentationApiRef } from '@backstage/plugin-catalog-react';

jest.mock('@backstage/plugin-techdocs-react', () => ({
  ...jest.requireActual('@backstage/plugin-techdocs-react'),
  useShadowRootElements: jest.fn(),
}));

describe('TextSize', () => {
  const useShadowRootElementsMock = useShadowRootElements as jest.Mock;

  const entityPresentationApiMock = {
    forEntity: jest.fn(),
  };
  entityPresentationApiMock.forEntity.mockReturnValue({
    snapshot: {
      primaryTitle: 'Test Entity',
    },
  });

  beforeEach(() => {
    useShadowRootElementsMock.mockReturnValue([]);
  });

  it('renders without exploding', async () => {
    await TechDocsAddonTester.buildAddonsInTechDocs([<TextSize />])
      .withDom(<body>TEST_CONTENT</body>)
      .withApis([[entityPresentationApiRef, entityPresentationApiMock]])
      .renderWithEffects();

    expect(screen.getByShadowText('TEST_CONTENT')).toBeInTheDocument();
  });

  it('changes content text size using slider', async () => {
    await TechDocsAddonTester.buildAddonsInTechDocs([<TextSize />])
      .withDom(<body>TEST_CONTENT</body>)
      .withApis([[entityPresentationApiRef, entityPresentationApiMock]])
      .renderWithEffects();

    const content = screen.getByShadowText('TEST_CONTENT');
    useShadowRootElementsMock.mockReturnValue([content]);

    fireEvent.click(screen.getByShadowTitle('Settings'));

    await waitFor(() => {
      expect(screen.getByShadowText('Text size')).toBeInTheDocument();
    });

    const slider = screen.getByShadowRole('slider');

    act(() => {
      slider.focus();
    });

    fireEvent.keyDown(slider, {
      key: 'ArrowRight',
    });

    await waitFor(() => {
      expect(screen.getByShadowDisplayValue('115')).toBeInTheDocument();
    });

    expect(slider).toHaveTextContent('115%');

    let style = window.getComputedStyle(screen.getByShadowText('TEST_CONTENT'));

    await waitFor(() => {
      expect(style.getPropertyValue('--md-typeset-font-size')).toBe('18.4px');
    });

    fireEvent.keyDown(slider, {
      key: 'ArrowLeft',
    });

    await waitFor(() => {
      expect(screen.getByShadowDisplayValue('100')).toBeInTheDocument();
    });

    expect(slider).toHaveTextContent('100%');

    style = window.getComputedStyle(screen.getByShadowText('TEST_CONTENT'));

    expect(style.getPropertyValue('--md-typeset-font-size')).toBe('16px');
  });

  it('changes content text size using buttons', async () => {
    await TechDocsAddonTester.buildAddonsInTechDocs([<TextSize />])
      .withDom(<body>TEST_CONTENT</body>)
      .withApis([[entityPresentationApiRef, entityPresentationApiMock]])
      .renderWithEffects();

    const content = screen.getByShadowText('TEST_CONTENT');
    useShadowRootElementsMock.mockReturnValue([content]);

    fireEvent.click(screen.getByShadowTitle('Settings'));

    await waitFor(() => {
      expect(screen.getByShadowText('Text size')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByShadowLabelText('Increase text size'));

    await waitFor(() => {
      expect(screen.getByShadowDisplayValue('115')).toBeInTheDocument();
    });

    const slider = screen.getByShadowRole('slider');

    expect(slider).toHaveTextContent('115%');

    let style = window.getComputedStyle(screen.getByShadowText('TEST_CONTENT'));

    expect(style.getPropertyValue('--md-typeset-font-size')).toBe('18.4px');

    fireEvent.click(screen.getByShadowLabelText('Decrease text size'));

    await waitFor(() => {
      expect(screen.getByShadowDisplayValue('100')).toBeInTheDocument();
    });

    expect(slider).toHaveTextContent('100%');

    style = window.getComputedStyle(screen.getByShadowText('TEST_CONTENT'));

    expect(style.getPropertyValue('--md-typeset-font-size')).toBe('16px');
  });
});
