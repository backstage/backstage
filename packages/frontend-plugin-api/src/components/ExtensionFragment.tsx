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

import { JSX, ReactNode } from 'react';
import { extensionFragmentsApiRef } from '../apis/definitions/ExtensionFragmentsApi';
import { useApi } from '../apis/system';

/**
 * Props for {@link ExtensionFragment}.
 *
 * @public
 */
export interface ExtensionFragmentProps {
  /** The fragment namespace and optional name, for example `deployments/summary`. Omit the `fragment:` kind. */
  extensionId: string;
  /** Rendered when the fragment is missing, disabled, or excluded by a predicate. */
  fallback?: ReactNode;
}

/**
 * Renders one fragment in the host's React context. Available after the app
 * session boundary. Missing fragments render the fallback, or nothing.
 *
 * @public
 */
export function ExtensionFragment(props: ExtensionFragmentProps): JSX.Element {
  const api = useApi(extensionFragmentsApiRef);
  if (!/^[^:/]+(?:\/[^:/]+)?$/.test(props.extensionId)) {
    throw new Error(
      `Invalid fragment ID '${props.extensionId}', expected a namespace and optional name without the 'fragment:' kind`,
    );
  }
  return (
    <>{api.getFragment(`fragment:${props.extensionId}`) ?? props.fallback}</>
  );
}
