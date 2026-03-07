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

import { useState } from 'react';
import {
  useTranslationRef,
  appLanguageApiRef,
} from '@backstage/core-plugin-api/alpha';
import { userSettingsTranslationRef } from '../../translation';
import { useApi } from '@backstage/core-plugin-api';
import useObservable from 'react-use/esm/useObservable';
import { Select } from '@backstage/core-components';

const capitalize = (s: string) =>
  s.charAt(0).toLocaleUpperCase('en-US') + s.slice(1);

/** @public */
export const UserSettingsLanguageToggle = () => {
  const languageApi = useApi(appLanguageApiRef);
  const { t } = useTranslationRef(userSettingsTranslationRef);

  const [languageObservable] = useState(() => languageApi.language$());
  const { language: currentLanguage } = useObservable(
    languageObservable,
    languageApi.getLanguage(),
  );

  const { languages } = languageApi.getAvailableLanguages();

  if (languages.length <= 1) {
    return null;
  }

  const handleSetLanguage = (newLanguage: string | undefined) => {
    languageApi.setLanguage(newLanguage);
  };

  const getLanguageDisplayName = (language: string) => {
    try {
      const names = new Intl.DisplayNames([language], {
        type: 'language',
      });
      const languageDisplayName = names.of(language);
      return languageDisplayName ? capitalize(languageDisplayName) : language;
    } catch (err) {
      return language;
    }
  };

  return (
    <div className="flex flex-wrap w-full justify-between items-center pb-2 pr-4 sm:w-auto sm:pb-0">
      <div className="px-0">
        <p className="text-sm font-medium text-foreground">
          {t('languageToggle.title')}
        </p>
        <p className="text-xs text-muted-foreground">
          {t('languageToggle.description')}
        </p>
      </div>
      <div className="relative pl-4 sm:pl-0">
        <Select
          label="Select language"
          selected={currentLanguage}
          items={languages.map(language => ({
            label: getLanguageDisplayName(language),
            value: language,
          }))}
          onChange={selectedItems => handleSetLanguage(selectedItems as string)}
        />
      </div>
    </div>
  );
};
