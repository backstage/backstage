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

import { TOptions } from 'i18next';
import { useTranslation } from 'react-i18next';

import { TranslationRef } from './types';
import { appTranslationApiRef, useApi } from '../apis';

export const useTranslationRef = <
  LazyMessages extends Record<string, string>,
  Messages extends Record<string, string>,
>(
  translationRef: TranslationRef<LazyMessages, Messages>,
) => {
  type MessageKey = keyof Messages | keyof LazyMessages;

  const appTranslationApi = useApi(appTranslationApiRef);

  appTranslationApi.useTranslationRef(translationRef);

  const translation = useTranslation(translationRef.getId());

  return translation as Omit<typeof translation, 't'> & {
    t(key: MessageKey, defaultValue?: string): string;
    t(key: MessageKey, options?: TOptions): string;
  };
};
