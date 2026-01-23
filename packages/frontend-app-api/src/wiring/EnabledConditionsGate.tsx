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

import { ReactNode, useEffect, useState } from 'react';
import { AppNode, coreExtensionData } from '@backstage/frontend-plugin-api';

/**
 * @public
 */
export interface EnabledConditionsGateProps {
  tree: { root: AppNode };
  completeInitialization: () => Promise<JSX.Element | undefined>;
  fallback?: ReactNode;
}

/**
 * Component that completes app initialization after mount.
 *
 * This component:
 * 1. Renders immediately with core extensions
 * 2. Evaluates enabled conditions for user extensions in background
 * 3. Re-renders with full app once user extensions are ready
 *
 * @public
 */
export function EnabledConditionsGate({
  tree,
  completeInitialization,
  fallback = null,
}: EnabledConditionsGateProps): JSX.Element | undefined {
  // Start with core extensions (already instantiated)
  const [rootElement, setRootElement] = useState<JSX.Element | undefined>(
    () => {
      const initialEl = tree.root.instance!.getData(
        coreExtensionData.reactElement,
      );
      return initialEl;
    },
  );

  useEffect(() => {
    let cancelled = false;

    // Evaluate enabled conditions and re-instantiate in background
    completeInitialization()
      .then(newRootEl => {
        if (!cancelled) {
          setRootElement(newRootEl);
        }
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(
          '[EnabledConditionsGate] Failed to complete app initialization:',
          err,
        );
      });

    return () => {
      cancelled = true;
    };
  }, [completeInitialization]);

  return rootElement ?? <>{fallback}</>;
}
