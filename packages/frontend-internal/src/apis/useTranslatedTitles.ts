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

import { useState } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { createTranslatedMessagesSource } from './createTranslatedMessagesSource';

/**
 * Waits for an initial title group, retaining resolved titles during language changes.
 * APIs are supplied by the caller to avoid an inlined-package import cycle.
 * @internal
 */
export function useTranslatedTitles(
  options: Parameters<typeof createTranslatedMessagesSource>[0],
): readonly (string | undefined)[] | undefined {
  const [previousSource, setSource] = useState(() =>
    createTranslatedMessagesSource(options),
  );
  const source = previousSource.matches(options)
    ? previousSource
    : createTranslatedMessagesSource(
        options,
        previousSource.getRetainedState(),
      );
  if (source !== previousSource) {
    setSource(source);
  }
  return useSyncExternalStore(source.subscribe, source.getSnapshot);
}
