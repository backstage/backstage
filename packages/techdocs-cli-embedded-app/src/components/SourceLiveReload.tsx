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

import { useEffect, useState } from 'react';
import { isProductionServe } from '../config';

/** Polls only the local preview server, never an adopter's backend. */
export function SourceLiveReload() {
  const [error, setError] = useState('');
  useEffect(() => {
    let stopped = false;
    let revision: number | undefined;
    let timer: ReturnType<typeof setTimeout>;
    const controller = new AbortController();
    const origin = isProductionServe().then(production =>
      production ? '' : 'http://localhost:7007',
    );
    const poll = async () => {
      try {
        const response = await fetch(
          `${await origin}/api/techdocs/_techdocs/preview.json`,
          {
            signal: controller.signal,
            cache: 'no-store',
          },
        );
        if (!response.ok) return;
        const value = await response.json();
        if (typeof value.revision !== 'number') return;
        if (revision !== undefined && revision !== value.revision)
          window.location.reload();
        revision = value.revision;
        setError(typeof value.error === 'string' ? value.error : '');
      } catch {
        /* A stopped preview server will be retried. */
      } finally {
        if (!stopped) timer = setTimeout(poll, 1000);
      }
    };
    void poll();
    return () => {
      stopped = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, []);
  return error ? <div role="alert">Preview build failed: {error}</div> : null;
}
