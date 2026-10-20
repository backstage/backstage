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
  V1Job,
} from '@kubernetes/client-node';
import { Writable } from 'node:stream';
import { ContainerRunnerPullOptions, TechDocsContainerRunner } from './types';
import path from 'node:path';

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

  constructor(
    private readonly options: {
      namespace?: string;
      volumeClaimName: string;
      workRoot: string;
    },
  ) {}

  async runContainer(opts: {
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
    const { batch, core, log, namespace } = await this.getClient();
    const job = this.createNamespacedJobRequest(
      opts.imageName,
      opts.args,
      opts.mountDirs || {},
      opts.envVars || {},
      opts.command,
      opts.workingDir,
      opts.pullImage,
    );

    const created = await batch.createNamespacedJob({ namespace, body: job });
    const jobName = created.metadata!.name!; // generateName → server assigns the suffix
    // TODO: wait for job completion via Complete/Failed conditions (readNamespacedJobStatus or Watch)
    // TODO: stream logs: find pod via core.listNamespacedPod({ labelSelector: `job-name=${jobName}` }), wait until it leaves Pending, then log.log(..., { follow: true }) piped with { end: false }
    // TODO: error checking: throw on Failed with the condition reason; on any error, delete the job with propagationPolicy 'Background'
    return Promise.resolve(undefined);
  }

  private createNamespacedJobRequest(
    imageName: string,
    args: string[],
    mountDirs: Record<string, string>,
    envVars: Record<string, string>,
    command?: string | string[],
    workingDir?: string,
    pullImage?: boolean,
  ): V1Job {
    // TODO: handle the `defaultUser` security context
    // TODO: handle pullOptions
    // TODO: update timeouts
    // TODO: set automountServiceAccountToken: false so the build pod gets no API token
    // TODO: add PSA-friendly securityContext (runAsNonRoot, allowPrivilegeEscalation: false, drop ALL)
    // TODO: add resource requests/limits
    const job: V1Job = {
      apiVersion: 'batch/v1',
      kind: 'Job',
      metadata: {
        generateName: 'techdocs-',
        labels: { 'app.kubernetes.io/managed-by': 'backstage-techdocs' },
      },
      spec: {
        backoffLimit: 0,
        activeDeadlineSeconds: 600,
        ttlSecondsAfterFinished: 300,
        template: {
          spec: {
            restartPolicy: 'Never',
            containers: [
              {
                name: 'techdocs',
                image: imageName,
                imagePullPolicy: pullImage ? 'Always' : 'IfNotPresent',
                command: typeof command === 'string' ? [command] : command,
                args,
                workingDir,
                env: Object.entries(envVars).map(([name, value]) => ({
                  name,
                  value,
                })),
                // TODO: throw if hostDir is outside workRoot (subPath starts with '..' or is absolute), e.g. dir: refs in local dev
                // TODO: fs.realpath both hostDir and workRoot first, like DockerContainerRunner, so symlinks don't skew subPath
                volumeMounts: Object.entries(mountDirs).map(
                  ([hostDir, mountPath]) => ({
                    name: 'work',
                    mountPath,
                    subPath: path.relative(this.options.workRoot, hostDir),
                  }),
                ),
              },
            ],
            volumes: [
              {
                name: 'work',
                persistentVolumeClaim: {
                  claimName: this.options.volumeClaimName,
                },
              },
            ],
          },
        },
      },
    };
    return job;
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
