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

import { KeyPrefix, Namespace } from 'i18next';
import { TranslationRef } from './types';
import { UseTranslationOptions, useTranslation } from 'react-i18next';
import { DefaultNamespace } from 'react-i18next/TransWithoutContext';
import { appTranslationApiRef, useApi } from '../apis';

export function usePluginTranslation<
  N extends Namespace = DefaultNamespace,
  TKPrefix extends KeyPrefix<N> = undefined,
>(translationRef: TranslationRef, options?: UseTranslationOptions<TKPrefix>) {
  const translationApi = useApi(appTranslationApiRef);
  return useTranslation<string, TKPrefix>(translationRef.id, {
    ...options,
    i18n: translationApi.getI18next(),
  });
}
