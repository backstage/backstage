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

import React, { PropsWithChildren } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { appTranslationApiRef } from '@backstage/core-plugin-api';
import { I18nextProvider } from 'react-i18next';

export function AppTranslationProvider({ children }: PropsWithChildren<{}>) {
  const appTranslationAPi = useApi(appTranslationApiRef);
  const i18n = appTranslationAPi.getI18n();
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
