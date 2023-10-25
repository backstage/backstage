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
import { TranslationRef } from './TranslationRef';
import { useTranslationRef } from './useTranslationRef';
import {
  CollapsedMessages,
  NestedMessageKeys,
  PluralKeys,
  TranslationFunctionOptions,
} from '../apis/definitions/TranslationApi';

/**
 * @alpha
 */
export function Translation<
  TMessages extends { [key in string]: string },
  TKey extends keyof CollapsedMessages<TMessages>,
>({
  translationRef,
  tKey,
  tFunctionOptions,
}: {
  translationRef: TranslationRef<string, TMessages>;
  tKey: TKey;
  tFunctionOptions?: TranslationFunctionOptions<
    NestedMessageKeys<TKey, CollapsedMessages<TMessages>>,
    PluralKeys<TMessages>,
    CollapsedMessages<TMessages>
  >[0];
}) {
  const { t } = useTranslationRef(translationRef);
  // todo: mario fix any type
  return <>{t(tKey, tFunctionOptions as any)}</>;
}
