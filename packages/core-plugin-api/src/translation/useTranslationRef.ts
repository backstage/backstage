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

import { TranslationOptions, TranslationRef } from './types';
import { useApi } from '../apis';
import { appTranslationApiRef } from '../apis/alpha';

/** @alpha */
export const useTranslationRef = <
  Messages extends Record<keyof Messages, string>,
>(
  translationRef: TranslationRef<Messages>,
) => {
  const appTranslationApi = useApi(appTranslationApiRef);

  appTranslationApi.addResourcesByRef(translationRef);

  const { t } = useTranslation(translationRef.getId());

  const defaulteMessage = translationRef.getDefaultMessages();

  return <Tkey extends keyof Messages>(
    key: Tkey,
    options?: TranslationOptions,
  ): Messages[Tkey] => t(key as string, defaulteMessage[key], options);
};
