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

import React from 'react';

import { fireEvent, waitFor } from '@testing-library/react';

import { TextSize } from '../../plugin';

describe('TextSize', () => {
  it('renders without exploding', async () => {
    const { getByText } = await TechDocsAddonTester.buildAddonsInTechDocs([
      <TextSize />,
    ])
      .withDom(<body>TEST_CONTENT</body>)
      .renderWithEffects();

    await waitFor(() => {
      expect(getByText('TEST_CONTENT')).toBeInTheDocument();
    });
  });

  it('changes content text size using slider', async () => {
    const { getByTitle, getByText, getByRole, getByDisplayValue } =
      await TechDocsAddonTester.buildAddonsInTechDocs([<TextSize />])
        .withDom(<body>TEST_CONTENT</body>)
        .renderWithEffects();

    fireEvent.click(getByTitle('Settings'));

    await waitFor(() => {
      expect(getByText('Text size')).toBeInTheDocument();
    });

    const slider = getByRole('slider');

    slider.focus();

    fireEvent.keyDown(slider, {
      key: 'ArrowRight',
    });

    await waitFor(() => {
      expect(getByDisplayValue('115')).toBeInTheDocument();
    });

    expect(slider).toHaveTextContent('115%');

    let style = getComputedStyle(getByText('TEST_CONTENT'));

    expect(style.getPropertyValue('--md-typeset-font-size')).toBe('18.4px');

    fireEvent.keyDown(slider, {
      key: 'ArrowLeft',
    });

    await waitFor(() => {
      expect(getByDisplayValue('100')).toBeInTheDocument();
    });

    expect(slider).toHaveTextContent('100%');

    style = getComputedStyle(getByText('TEST_CONTENT'));

    expect(style.getPropertyValue('--md-typeset-font-size')).toBe('16px');
  });

  it('changes content text size using buttons', async () => {
    const {
      getByTitle,
      getByText,
      getByRole,
      getByLabelText,
      getByDisplayValue,
    } = await TechDocsAddonTester.buildAddonsInTechDocs([<TextSize />])
      .withDom(<body>TEST_CONTENT</body>)
      .renderWithEffects();

    fireEvent.click(getByTitle('Settings'));

    await waitFor(() => {
      expect(getByText('Text size')).toBeInTheDocument();
    });

    fireEvent.click(getByLabelText('Increase text size'));

    await waitFor(() => {
      expect(getByDisplayValue('115')).toBeInTheDocument();
    });

    const slider = getByRole('slider');

    expect(slider).toHaveTextContent('115%');

    let style = getComputedStyle(getByText('TEST_CONTENT'));

    expect(style.getPropertyValue('--md-typeset-font-size')).toBe('18.4px');

    fireEvent.click(getByLabelText('Decrease text size'));

    await waitFor(() => {
      expect(getByDisplayValue('100')).toBeInTheDocument();
    });

    expect(slider).toHaveTextContent('100%');

    style = getComputedStyle(getByText('TEST_CONTENT'));

    expect(style.getPropertyValue('--md-typeset-font-size')).toBe('16px');
  });
});
