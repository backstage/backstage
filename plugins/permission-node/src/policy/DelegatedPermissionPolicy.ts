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

import {
  PermissionPolicy,
  PolicyQuery,
} from '@backstage/plugin-permission-node';
import { DecisionDelegate } from './types';
import { PolicyDecision } from '@backstage/plugin-permission-common';
import { BackstageIdentityResponse } from '@backstage/plugin-auth-node';

/**
 * Abstract policy that can delegate permission decisions
 * @alpha
 */
export abstract class DelegatedPermissionPolicy implements PermissionPolicy {
  private readonly delegates: DecisionDelegate[];

  /**
   * Create a new delegated permission policy.
   */
  protected constructor(delegates: DecisionDelegate<any>[]) {
    this.delegates = delegates;
  }

  /**
   * Implement this abstract methods to handle the case where a policy request wasn't handled by one of the delegates
   */
  protected abstract handleUndelegated(
    request: PolicyQuery,
    user?: BackstageIdentityResponse,
  ): Promise<PolicyDecision>;

  /**
   * Method is called if more than one delegate matches the request permission. Default behaviour is to return the first
   * matching delegate, but this can be overridden by supplying your own implementation here.
   */
  protected handleDelegateConflict(
    matches: DecisionDelegate<any>[],
  ): DecisionDelegate {
    return matches[0];
  }

  /** */
  async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse,
  ): Promise<PolicyDecision> {
    const matchingDelegates = this.delegates.filter(delegate =>
      delegate.match(request),
    );

    // Not matching delegates found, return fallback decision
    if (matchingDelegates.length === 0) {
      return this.handleUndelegated(request, user);
    }

    const match =
      matchingDelegates.length === 1
        ? matchingDelegates[0]
        : this.handleDelegateConflict(matchingDelegates);

    return match.build(request, user);
  }
}
