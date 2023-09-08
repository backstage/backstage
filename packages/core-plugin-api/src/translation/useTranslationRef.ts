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

import { useTranslation } from 'react-i18next';

import { useApi } from '../apis';
import { appTranslationApiRef } from '../apis/alpha';
import { toInternalTranslationRef, TranslationRef } from './TranslationRef';

/** @alpha */
export interface TranslationOptions {
  /* no options supported for now */
}

/** @alpha */
export const useTranslationRef = <
  TMessages extends { [key in string]: string },
>(
  translationRef: TranslationRef<TMessages>,
) => {
  const appTranslationApi = useApi(appTranslationApiRef);

  appTranslationApi.addResourcesByRef(translationRef);

  const internalRef = toInternalTranslationRef(translationRef);

  const { t } = useTranslation(internalRef.id, {
    useSuspense: process.env.NODE_ENV !== 'test',
  });

  const defaultMessages = internalRef.getDefaultMessages();

  return <TKey extends keyof TMessages & string>(
    key: TKey,
    options?: TranslationOptions,
  ): TMessages[TKey] => t(key, defaultMessages[key], options);
};
