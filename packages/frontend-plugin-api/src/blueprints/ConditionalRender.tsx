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

import { ReactNode } from 'react';
import { useApiHolder } from '@backstage/core-plugin-api';
import useAsync from 'react-use/esm/useAsync';
import { ExtensionConditionFunc } from './types';

/**
 * A component that conditionally renders its children based on the result of an ExtensionConditionFunc.
 *
 * @public
 * @param props - Component props
 * @param props.condition - The condition function to evaluate
 * @param props.children - The content to render if the condition is met
 * @param props.fallback - Optional fallback content to render if the condition is not met (defaults to null)
 * @returns The children if the condition is met, the fallback otherwise, or null while loading
 *
 * @example
 * ```typescript
 * <ConditionalRender
 *   condition={async (originalDecision, { apiHolder }) => {
 *     const permissionApi = apiHolder.get(permissionApiRef);
 *     const result = await permissionApi?.authorize({ permission: myPermission });
 *     return result?.result === 'ALLOW';
 *   }}
 * >
 *   <MyProtectedComponent />
 * </ConditionalRender>
 * ```
 */
export function ConditionalRender({
  condition,
  children,
  fallback = null,
}: {
  condition: ExtensionConditionFunc;
  children: ReactNode;
  fallback?: ReactNode;
}): JSX.Element | null {
  const apiHolder = useApiHolder();

  const {
    loading,
    error,
    value: conditionMet,
  } = useAsync(async () => {
    const originalDecision = async () => true; // Always true for now, reserved for future config-based conditions
    return condition(originalDecision, { apiHolder });
  }, [condition, apiHolder]);

  if (error) {
    // eslint-disable-next-line no-console
    console.error('Error evaluating extension condition:', error);
    return <>{fallback}</>;
  }

  if (loading || conditionMet === undefined) {
    return null; // Loading
  }

  return <>{conditionMet ? children : fallback}</>;
}
