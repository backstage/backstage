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

import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { UserSettingsLanguageToggle } from './UserSettingsLanguageToggle';
import { renderInTestApp } from '@backstage/test-utils';
import { useTranslation } from 'react-i18next';

jest.mock('@backstage/core-plugin-api/alpha', () => ({
  ...jest.requireActual('@backstage/core-plugin-api/alpha'),
  useTranslationRef: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: jest.fn(),
}));

describe('UserSettingsLanguageToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with multiple supported languages', async () => {
    const messages: Record<string, string> = {
      en: 'English',
      fr: 'French',
      de: 'German',
      language: 'language',
      change_the_language: 'Change the language',
    };

    const i18nMock = {
      language: 'en',
      options: {
        supportedLngs: ['en', 'fr', 'de'],
      },
      changeLanguage: jest.fn(),
    };

    (useTranslation as jest.Mock).mockReturnValue({
      i18n: i18nMock,
    });

    (useTranslationRef as jest.Mock).mockReturnValue(
      (key: string, option: any) =>
        messages[option?.language || key] || 'translatedValue',
    );

    await renderInTestApp(<UserSettingsLanguageToggle />);

    expect(screen.getAllByText('Change the language')).toHaveLength(1);
    expect(screen.getAllByText('English')).toHaveLength(1);
    expect(screen.getAllByText('French')).toHaveLength(1);
    expect(screen.getAllByText('German')).toHaveLength(1);
  });

  it('should not render when only one supported language', async () => {
    const tMock = jest.fn().mockReturnValue('translatedValue');
    const i18nMock = {
      language: 'en',
      options: {
        supportedLngs: ['en'],
      },
      changeLanguage: jest.fn(),
    };

    (useTranslationRef as jest.Mock).mockReturnValue(tMock);

    (useTranslation as jest.Mock).mockReturnValue({
      i18n: i18nMock,
    });

    await renderInTestApp(<UserSettingsLanguageToggle />);

    expect(screen.queryByText('translatedValue')).toBeNull();
    expect(screen.queryByText('English')).toBeNull();
  });

  it('should handle language change', async () => {
    const messages: Record<string, string> = {
      en: 'English',
      fr: 'French',
      language: 'language',
      change_the_language: 'Change the language',
    };

    const i18nMock = {
      language: 'en',
      options: {
        supportedLngs: ['en', 'fr'],
      },
      changeLanguage: jest.fn(),
    };

    (useTranslationRef as jest.Mock).mockReturnValue(
      (key: string, option: any) =>
        messages[option?.language || key] || 'translatedValue',
    );

    (useTranslation as jest.Mock).mockReturnValue({
      i18n: i18nMock,
    });

    await renderInTestApp(<UserSettingsLanguageToggle />);

    fireEvent.click(screen.getByText('French'));

    expect(i18nMock.changeLanguage).toHaveBeenCalledWith('fr');
  });
});
