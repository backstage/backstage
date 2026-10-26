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

import { SnapshotSource } from '@backstage/types/alpha';
import { ApiHolder, appLanguageApiRef, translationApiRef } from '../apis';
import { TranslationRef } from './TranslationRef';
import { TranslationSnapshot } from '../apis/definitions/TranslationApi';

/** @internal */
export function createTranslationTitleSource(options: {
  translation: { ref: TranslationRef; key: string };
  fallback: string;
  apis: ApiHolder;
}): SnapshotSource<string> {
  const {
    translation: { ref, key },
    fallback,
    apis,
  } = options;
  const api = apis.get(translationApiRef);
  const languageApi = apis.get(appLanguageApiRef);
  const initial = api?.getTranslation(ref);
  let value = initial?.ready ? initial.t(key) : fallback;
  const listeners = new Set<() => void>();
  let disconnect: (() => void) | undefined;

  const connect = () => {
    if (!api) {
      return () => {};
    }
    let active = true;
    let failed = false;
    const update = (snapshot: TranslationSnapshot<Record<string, string>>) => {
      if (!active || !snapshot.ready) {
        return;
      }
      const next = snapshot.t(key);
      if (next !== value) {
        value = next;
        listeners.forEach(listener => listener());
      }
    };
    const subscribe = () =>
      api.translation$(ref).subscribe({
        next: update,
        error: () => {
          if (!active) {
            return;
          }
          failed = true;
          update(api.getTranslation(ref));
        },
      });
    let subscription = subscribe();
    // Failed translation observables close; reconnect when the language changes.
    const languageSubscription = languageApi?.language$().subscribe(() => {
      if (failed) {
        failed = false;
        subscription.unsubscribe();
        subscription = subscribe();
      }
      update(api.getTranslation(ref));
    });
    // Recheck after subscribing to include changes since the source was created.
    update(api.getTranslation(ref));
    return () => {
      active = false;
      subscription.unsubscribe();
      languageSubscription?.unsubscribe();
    };
  };

  return {
    getSnapshot: () => value,
    subscribe: onChange => {
      const listener = () => onChange();
      listeners.add(listener);
      if (listeners.size === 1) {
        disconnect = connect();
      }
      return () => {
        if (listeners.delete(listener) && listeners.size === 0) {
          disconnect?.();
          disconnect = undefined;
        }
      };
    },
  };
}
