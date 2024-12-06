/*
 * Copyright 2023 The Backstage Authors
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

import { screen, fireEvent } from '@testing-library/react';
import { UserSettingsLanguageToggle } from './UserSettingsLanguageToggle';
import { TestApiProvider, renderInTestApp } from '@backstage/test-utils';
import { appLanguageApiRef } from '@backstage/core-plugin-api/alpha';

describe('UserSettingsLanguageToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render with only one available language', async () => {
    const rendered = await renderInTestApp(<UserSettingsLanguageToggle />);

    expect(rendered.container).toBeEmptyDOMElement();
  });

  it('should render correctly with multiple available languages', async () => {
    const mockLanguageApi: typeof appLanguageApiRef.T = {
      getAvailableLanguages: jest
        .fn()
        .mockReturnValue({ languages: ['en', 'de'] }),
      getLanguage: jest.fn().mockReturnValue({ language: 'en' }),
      language$: jest.fn().mockReturnValue({
        subscribe: jest.fn().mockReturnValue({ unsubscribe: jest.fn() }),
      }),
      setLanguage: jest.fn(),
    };

    await renderInTestApp(
      <TestApiProvider apis={[[appLanguageApiRef, mockLanguageApi]]}>
        <UserSettingsLanguageToggle />
      </TestApiProvider>,
    );

    expect(screen.getByText('Change the language')).toBeInTheDocument();
  });

  it('should handle language change', async () => {
    const mockLanguageApi: typeof appLanguageApiRef.T = {
      getAvailableLanguages: jest
        .fn()
        .mockReturnValue({ languages: ['en', 'de'] }),
      getLanguage: jest.fn().mockReturnValue({ language: 'en' }),
      language$: jest.fn().mockReturnValue({
        subscribe: jest.fn().mockReturnValue({ unsubscribe: jest.fn() }),
      }),
      setLanguage: jest.fn(),
    };

    await renderInTestApp(
      <TestApiProvider apis={[[appLanguageApiRef, mockLanguageApi]]}>
        <UserSettingsLanguageToggle />
      </TestApiProvider>,
    );

    expect(screen.getByText('Change the language')).toBeInTheDocument();

    await renderInTestApp(<UserSettingsLanguageToggle />);

    // open the select control
    fireEvent.mouseDown(screen.getByText('English'));
    // select the new language
    fireEvent.click(screen.getByText('Deutsch'));

    expect(mockLanguageApi.setLanguage).toHaveBeenCalledWith('de');
  });
});
