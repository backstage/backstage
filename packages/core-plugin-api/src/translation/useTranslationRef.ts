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

import { useEffect, useState } from 'react';

import { useApi } from '../apis';
import {
  translationApiRef,
  TranslationFunction,
  TranslationSnapshot,
} from '../apis/alpha';
import { TranslationRef } from './TranslationRef';

// Make sure we don't fill the logs with loading errors for the same ref
const loggedRefs = new WeakSet<TranslationRef<string, {}>>();

/** @alpha */
export const useTranslationRef = <
  TMessages extends { [key in string]: string },
>(
  translationRef: TranslationRef<string, TMessages>,
): { t: TranslationFunction<TMessages> } => {
  const translationApi = useApi(translationApiRef);

  const [error, setError] = useState<Error>();
  const [snapshot, setSnapshot] = useState<TranslationSnapshot<TMessages>>(() =>
    translationApi.getTranslation(translationRef),
  );
  const [observable] = useState(() =>
    translationApi.translation$(translationRef),
  );

  useEffect(() => {
    const subscription = observable.subscribe({
      next(next) {
        if (next.ready) {
          setSnapshot(next);
        }
      },
      error: setError,
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [observable]);

  if (error) {
    throw error;
  }

  if (!snapshot.ready) {
    throw new Promise<void>(resolve => {
      const subscription = observable.subscribe({
        next(next) {
          if (next.ready) {
            subscription.unsubscribe();
            resolve();
          }
        },
        error(err) {
          if (!loggedRefs.has(translationRef)) {
            // eslint-disable-next-line no-console
            console.error(
              `Failed to load translation resource '${translationRef.id}'; caused by ${err}`,
            );
            loggedRefs.add(translationRef);
          }
          resolve();
        },
      });
    });
  }

  return { t: snapshot.t };
};
