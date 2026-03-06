/*
 * Copyright 2024 The Backstage Authors
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

import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { coreComponentsTranslationRef } from '../translation';

/**
 * Hook that returns the app title with translation support.
 *
 * This hook automatically uses translated values for the app title based on the
 * current language. It uses the fixed translation key 'app.title'.
 *
 * Translation priority:
 * 1. Translated value for 'app.title' in the current language
 * 2. Fallback to app.title from config
 * 3. Default translation ('Backstage')
 *
 * @remarks
 * Note: If you explicitly translate 'app.title' to "Backstage" (the same as the
 * default value), the hook cannot distinguish between a deliberate translation
 * and the default, so it will fall back to the config value. If you want to use
 * "Backstage" as your translated title while having a different `app.title` in
 * config, set the config value to "Backstage" as well.
 *
 * @public
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const appTitle = useAppTitle();
 *   return <h1>{appTitle}</h1>;
 * };
 * ```
 */
export function useAppTitle(): string {
  const configApi = useApi(configApiRef);
  const { t } = useTranslationRef(coreComponentsTranslationRef);

  // Default value defined in coreComponentsTranslationRef
  const defaultTitle = 'Backstage';

  // Try to get translation for the current language
  const translatedTitle = t('app.title', {});

  // Get the fallback title from config
  const configTitle = configApi.getOptionalString('app.title');

  // Priority: translation override → config value → default
  // If translation is different from default, it means an override exists
  if (translatedTitle !== defaultTitle) {
    return translatedTitle;
  }

  // Otherwise, use config value or fall back to default
  return configTitle || defaultTitle;
}
