/*
 * Copyright 2021 The Backstage Authors
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

import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import userEvent from '@testing-library/user-event';
import ObservableImpl from 'zen-observable';
import {
  AppLanguageApi,
  appLanguageApiRef,
} from '@backstage/core-plugin-api/alpha';
import { SidebarLanguageSwitcher } from './SidebarLanguageSwitcher';

describe('SidebarLanguageSwitcher', () => {
  let languageApi: jest.Mocked<AppLanguageApi>;

  beforeEach(() => {
    languageApi = {
      getAvailableLanguages: jest.fn(),
      getLanguage: jest.fn(),
      language$: jest.fn(),
      setLanguage: jest.fn(),
    };

    languageApi.language$.mockReturnValue(
      ObservableImpl.of<{ language?: string }>({ language: 'en' }),
    );
    languageApi.getLanguage.mockReturnValue({ language: 'en' });
    languageApi.getAvailableLanguages.mockReturnValue({
      languages: ['en', 'fi'],
    });
  });

  it('should display current language', async () => {
    const { getByLabelText, getByRole, getByText } = await renderInTestApp(
      <TestApiProvider apis={[[appLanguageApiRef, languageApi]]}>
        <SidebarLanguageSwitcher />
      </TestApiProvider>,
    );

    const button = getByLabelText('Language');
    expect(button).toBeInTheDocument();

    await userEvent.click(button);

    expect(getByRole('listbox')).toBeInTheDocument();
    expect(getByText('English')).toBeInTheDocument();
    expect(getByText('English').parentElement?.parentElement).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('should select different language', async () => {
    const { getByLabelText, getByRole, getByText } = await renderInTestApp(
      <TestApiProvider apis={[[appLanguageApiRef, languageApi]]}>
        <SidebarLanguageSwitcher />
      </TestApiProvider>,
    );

    const button = getByLabelText('Language');
    expect(button).toBeInTheDocument();

    await userEvent.click(button);

    expect(getByRole('listbox')).toBeInTheDocument();

    await userEvent.click(getByText('suomi'));

    expect(languageApi.setLanguage).toHaveBeenCalledWith('fi');
  });
});
