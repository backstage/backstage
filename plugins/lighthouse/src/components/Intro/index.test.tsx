/*
 * Copyright 2020 The Backstage Authors
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
import React from 'react';
import LighthouseIntro from './index';

describe('LighthouseIntro', () => {
  it('renders successfully', async () => {
    await renderInTestApp(<LighthouseIntro />);
    expect(
      screen.getByText('Welcome to Lighthouse in Backstage!'),
    ).toBeInTheDocument();
  });

  describe('tabs', () => {
    const firstTabRe = /This plugin allows you to/;
    const secondTabRe = /you will need a running instance of/;

    it('selects the first text element', async () => {
      await renderInTestApp(<LighthouseIntro />);
      expect(screen.getByText(firstTabRe)).toBeInTheDocument();
      expect(screen.queryByText(secondTabRe)).not.toBeInTheDocument();
    });

    it('shows the other text when the tab is clicked', async () => {
      await renderInTestApp(<LighthouseIntro />);
      fireEvent.click(screen.getByText('Setup'));
      expect(screen.queryByText(firstTabRe)).not.toBeInTheDocument();
      expect(screen.getByText(secondTabRe)).toBeInTheDocument();
    });
  });

  describe('closing', () => {
    it('hides the content on click', async () => {
      await renderInTestApp(<LighthouseIntro />);
      const welcomeMessage = screen.queryByText(
        'Welcome to Lighthouse in Backstage!',
      );
      expect(welcomeMessage).toBeInTheDocument();
      fireEvent.click(screen.getByText('Hide intro'));

      expect(welcomeMessage).not.toBeInTheDocument();
    });
  });
});
