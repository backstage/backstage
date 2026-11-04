/*
 * Copyright 2026 The Backstage Authors
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

import { createInstance, type TFunction, type TOptions } from 'i18next';
import { TranslationRefTuple } from '@backstage/core-plugin-api/alpha';
import { DEFAULT_LANGUAGE } from '../AppLanguageApi/AppLanguageSelector';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { toInternalTranslationRef } from '../../../../../frontend-plugin-api/src/translation/TranslationRef';

const formatters = new WeakMap<
  TranslationRefTuple<any>['ref'],
  { t: TFunction; exists: (key: string, options: TOptions) => boolean }
>();

/** Formats only declared defaults, without consulting installed resources or the active locale. @internal */
export function getDefaultMessage(
  translation: TranslationRefTuple<any>,
  options?: {},
): string {
  const { ref, key } = translation;
  const messages = toInternalTranslationRef(ref).getDefaultMessages();
  const message = messages[key];
  if (
    options === undefined &&
    typeof message === 'string' &&
    !message.includes('$t(')
  ) {
    return message;
  }
  let formatter = formatters.get(ref);
  if (!formatter) {
    const defaults = { ...messages };
    // Give plural messages an other-form fallback when no count is supplied, including in nested messages.
    for (const [messageKey, value] of Object.entries(messages)) {
      if (messageKey.endsWith('_other')) {
        defaults[messageKey.slice(0, -'_other'.length)] ??= value;
      }
    }
    const i18n = createInstance();
    i18n.init({
      lng: DEFAULT_LANGUAGE,
      fallbackLng: false,
      initImmediate: false,
      ns: [ref.id],
      defaultNS: ref.id,
      resources: { [DEFAULT_LANGUAGE]: { [ref.id]: defaults } },
      interpolation: { escapeValue: false },
    });
    formatter = {
      t: i18n.getFixedT(DEFAULT_LANGUAGE, ref.id),
      exists: (messageKey, args) =>
        i18n.exists(messageKey, { ...args, ns: ref.id, lng: DEFAULT_LANGUAGE }),
    };
    formatters.set(ref, formatter);
  }
  const args = (options ?? {}) as TOptions;
  if (!formatter.exists(key, args)) {
    throw new Error(`Unknown translation key '${key}' in '${ref.id}'`);
  }
  return formatter.t(key, {
    ...args,
    ns: ref.id,
    lng: DEFAULT_LANGUAGE,
  }) as string;
}
