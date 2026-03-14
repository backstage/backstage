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

import { discoveryApiRef, useApi } from '@backstage/core-plugin-api';
import { useEffect, useState } from 'react';

/** @internal */
export function useWellKnownSkillsBaseUrl() {
  const discoveryApi = useApi(discoveryApiRef);
  const [wellKnownBaseUrl, setWellKnownBaseUrl] = useState<string>();

  useEffect(() => {
    let cancelled = false;

    discoveryApi
      .getBaseUrl('skills')
      .then(baseUrl => {
        if (!cancelled) {
          const apiBaseUrl = new URL(baseUrl);
          setWellKnownBaseUrl(`${apiBaseUrl.origin}/.well-known/skills`);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setWellKnownBaseUrl(undefined);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [discoveryApi]);

  return wellKnownBaseUrl;
}
