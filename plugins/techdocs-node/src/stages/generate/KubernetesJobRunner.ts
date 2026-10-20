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

import { ForwardedError } from '@backstage/errors';
import {
  AuthorizationV1Api,
  BatchV1Api,
  CoreV1Api,
  Log,
  KubeConfig,
  VersionApi,
} from '@kubernetes/client-node';
import { Writable } from 'node:stream';
import { ContainerRunnerPullOptions, TechDocsContainerRunner } from './types';

export type KubernetesClient = {
  batch: BatchV1Api;
  core: CoreV1Api;
  authorization: AuthorizationV1Api;
  log: Log;
  namespace: string;
};

const REQUIRED_PERMISSIONS = [
  {
    group: 'batch',
    resource: 'jobs',
    verbs: ['create', 'get', 'watch', 'delete'],
  },
  { group: '', resource: 'pods', verbs: ['get', 'list', 'watch'] },
  { group: '', resource: 'pods', subresource: 'log', verbs: ['get'] },
];

/**
 * @internal
 */
export class KubernetesJobRunner implements TechDocsContainerRunner {
  private client?: KubernetesClient;

  constructor(private readonly options: { namespace?: string } = {}) {}

  runContainer(opts: {
    imageName: string;
    command?: string | string[];
    args: string[];
    logStream?: Writable;
    mountDirs?: Record<string, string>;
    workingDir?: string;
    envVars?: Record<string, string>;
    pullImage?: boolean;
    defaultUser?: boolean;
    pullOptions?: ContainerRunnerPullOptions;
  }): Promise<void> {
    return Promise.resolve(undefined);
  }

  private async checkPermissions(client: KubernetesClient): Promise<void> {
    const { authorization, namespace } = client;
    const checks = REQUIRED_PERMISSIONS.flatMap(({ verbs, ...attrs }) =>
      verbs.map(verb => ({ ...attrs, verb, namespace })),
    );
    const results = await Promise.all(
      checks.map(async resourceAttributes => {
        const review = await authorization.createSelfSubjectAccessReview({
          body: { spec: { resourceAttributes } },
        });
        return {
          ...resourceAttributes,
          allowed: review.status?.allowed ?? false,
        };
      }),
    );
    const missing = results
      .filter(r => !r.allowed)
      .map(
        r =>
          `${r.verb} ${r.resource}${r.subresource ? `/${r.subresource}` : ''}`,
      );
    if (missing.length) {
      throw new Error(
        `Missing Kubernetes permissions in namespace '${namespace}': ${missing.join(
          ', ',
        )}`,
      );
    }
  }

  protected async getClient(): Promise<KubernetesClient> {
    if (!this.client) {
      this.client = await this.createClient();
    }
    return this.client;
  }

  private async createClient(): Promise<KubernetesClient> {
    // TODO: ESM-only package; switch to a static import once Node 22 is dropped (#34627)
    // const { BatchV1Api, CoreV1Api, KubeConfig, Log, VersionApi } = await import(
    //   '@kubernetes/client-node'
    // );

    const kc = new KubeConfig();
    kc.loadFromDefault();

    try {
      await kc.makeApiClient(VersionApi).getCode();
    } catch (e) {
      throw new ForwardedError(
        `This operation requires access to a Kubernetes cluster. The API server at ${
          kc.getCurrentCluster()?.server
        } does not appear to be reachable. VersionApi.getCode() failed with`,
        e,
      );
    }

    const client = {
      batch: kc.makeApiClient(BatchV1Api),
      core: kc.makeApiClient(CoreV1Api),
      authorization: kc.makeApiClient(AuthorizationV1Api),
      log: new Log(kc),
      namespace:
        this.options.namespace ??
        kc.getContextObject(kc.getCurrentContext())?.namespace ??
        'default',
    };
    await this.checkPermissions(client);
    return client;
  }
}
