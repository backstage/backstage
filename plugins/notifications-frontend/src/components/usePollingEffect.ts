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
import { useEffect, useRef } from 'react';

const noop = () => {};

export const usePollingEffect = (
  asyncCallback: () => Promise<void>,
  dependencies = [],
  interval = 0,
  onCleanUp = noop,
) => {
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!interval || interval < 0) {
      return noop;
    }

    let isStopped = false;

    (async function pollingCallback() {
      try {
        if (!isStopped) {
          await asyncCallback();
        }
      } finally {
        // Set timeout after it finished, unless stopped
        timeoutIdRef.current =
          !isStopped && setTimeout(pollingCallback, interval);
      }
    })();

    return () => {
      isStopped = true;
      if (!!timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      onCleanUp();
    };
  }, [
    asyncCallback,
    interval,
    onCleanUp,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...dependencies,
  ]);
};
