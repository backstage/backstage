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

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { errorApiRef, useApi } from '../apis';
import {
  translationApiRef,
  TranslationComponent,
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
): {
  t: TranslationFunction<TMessages>;
  Translation: TranslationComponent<TMessages>;
} => {
  const errorApi = useApi(errorApiRef);
  const translationApi = useApi(translationApiRef);

  const [snapshot, setSnapshot] = useState<TranslationSnapshot<TMessages>>(() =>
    translationApi.getTranslation(translationRef),
  );
  const observable = useMemo(
    () => translationApi.translation$(translationRef),
    [translationApi, translationRef],
  );

  const onError = useCallback(
    (error: Error) => {
      if (!loggedRefs.has(translationRef)) {
        const errMsg = `Failed to load translation resource '${translationRef.id}'; caused by ${error}`;
        // eslint-disable-next-line no-console
        console.error(errMsg);
        errorApi.post(new Error(errMsg));
        loggedRefs.add(translationRef);
      }
    },
    [errorApi, translationRef],
  );

  useEffect(() => {
    const subscription = observable.subscribe({
      next(next) {
        if (next.ready) {
          setSnapshot(next);
        }
      },
      error(error) {
        onError(error);
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [observable, onError]);

  // Keep track of if the provided translation ref changes, and in that case update the snapshot
  const initialRenderRef = useRef(true);
  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
    } else {
      setSnapshot(translationApi.getTranslation(translationRef));
    }
  }, [translationApi, translationRef]);

  if (!snapshot.ready) {
    throw new Promise<void>(resolve => {
      const subscription = observable.subscribe({
        next(next) {
          if (next.ready) {
            subscription.unsubscribe();
            resolve();
          }
        },
        error(error) {
          subscription.unsubscribe();
          onError(error);
          resolve();
        },
      });
    });
  }

  const Translation = useMemo(
    () => translationApi.getTranslationComponent<TMessages>(snapshot.t),
    [snapshot.t, translationApi],
  );

  return { t: snapshot.t, Translation };
};
