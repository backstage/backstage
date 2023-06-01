/*
 * Copyright 2021 The Backstage Authors
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

import { loggerToWinstonLogger } from '@backstage/backend-common';
import {
  coreServices,
  createBackendModule,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { BackstageIdentityResponse } from '@backstage/plugin-auth-node';
import {
  AuthorizeResult,
  PolicyDecision,
} from '@backstage/plugin-permission-common';
import {
  PermissionPolicy,
  PolicyQuery,
} from '@backstage/plugin-permission-node';
import {
  policyExtensionPoint,
  PolicyExtensionPoint,
} from '@backstage/plugin-permission-node/alpha';
import { createRouter } from './service';
import {
  MainPermissionPolicy,
  SubPermissionPolicy,
} from '@backstage/plugin-permission-node';
import { DelegateWithAllowAllFallbackPermissionPolicy } from './policies/delegate-with-allow-all-fallback';

class PolicyExtensionPointImpl implements PolicyExtensionPoint {
  public policy: MainPermissionPolicy | undefined;
  public subPolicies: SubPermissionPolicy[] = [];

  setPolicy(policy: MainPermissionPolicy): void {
    if (this.policy) {
      throw new Error('Policy already set');
    }
    this.policy = policy;
  }

  addSubPolicies(...subPolicies: SubPermissionPolicy[]): void {
    this.subPolicies.push(...subPolicies);
  }
}

/**
 * A permission policy module that allows all requests.
 *
 * @alpha
 */
export const permissionModuleAllowAllPolicy = createBackendModule({
  moduleId: 'allowAllPolicy',
  pluginId: 'permission',
  register(reg) {
    class AllowAllPermissionPolicy implements PermissionPolicy {
      async handle(
        _request: PolicyQuery,
        _user?: BackstageIdentityResponse,
      ): Promise<PolicyDecision> {
        return {
          result: AuthorizeResult.ALLOW,
        };
      }
    }

    reg.registerInit({
      deps: { policy: policyExtensionPoint },
      async init({ policy }) {
        policy.setPolicy(new AllowAllPermissionPolicy());
      },
    });
  },
});

/**
 * A permission policy module that delegates to contributed sub-policies
 * and allows all requests as a fallback.
 *
 * @alpha
 */
export const permissionModuleDelegateWithAllowAllFallbackPolicy =
  createBackendModule({
    moduleId: 'delegateWithAllowAllFallbackPolicy',
    pluginId: 'permission',
    register(reg) {
      reg.registerInit({
        deps: { policy: policyExtensionPoint },
        async init({ policy }) {
          policy.setPolicy(new DelegateWithAllowAllFallbackPermissionPolicy());
        },
      });
    },
  });

/**
 * Permission plugin
 *
 * @alpha
 */
export const permissionPlugin = createBackendPlugin(() => ({
  pluginId: 'permission',
  register(env) {
    const policies = new PolicyExtensionPointImpl();

    env.registerExtensionPoint(policyExtensionPoint, policies);

    env.registerInit({
      deps: {
        http: coreServices.httpRouter,
        config: coreServices.config,
        logger: coreServices.logger,
        discovery: coreServices.discovery,
        identity: coreServices.identity,
      },
      async init({ http, config, logger, discovery, identity }) {
        const winstonLogger = loggerToWinstonLogger(logger);
        if (!policies.policy) {
          throw new Error(
            'No policy module installed! Please install a policy module. If you want to allow all requests, use permissionModuleAllowAllPolicy or permissionModuleAllowAllAfterSubpoliciesPolicy',
          );
        }

        if (policies.subPolicies.length > 0) {
          if (!policies.policy.addSubPolicies) {
            throw new Error(
              'The main policy module does not support sub-policies! Please install a policy module that supports sub-policies, like permissionModuleAllowAllAfterSubpoliciesPolicy.',
            );
          }
          policies.policy.addSubPolicies(...policies.subPolicies);
        }

        http.use(
          await createRouter({
            config,
            discovery,
            identity,
            logger: winstonLogger,
            policy: policies.policy,
          }),
        );
      },
    });
  },
}));
