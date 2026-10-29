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

import { LoggerService } from '@backstage/backend-plugin-api';
import { ForwardedError } from '@backstage/errors';
import type {
  AuthorizationV1Api,
  BatchV1Api,
  CoreV1Api,
  Log,
  V1Affinity,
  V1Job,
  V1NodeSelectorTerm,
} from '@kubernetes/client-node';
import fs from 'fs-extra';
import { PassThrough, Writable } from 'node:stream';
import { finished } from 'node:stream/promises';
import { setTimeout as sleep } from 'node:timers/promises';
import { KubernetesOptions, TechDocsContainerRunner } from './types';
import path from 'node:path';

type RunContainerOptions = Parameters<
  TechDocsContainerRunner['runContainer']
>[0];

export type KubernetesClient = {
  batch: BatchV1Api;
  core: CoreV1Api;
  authorization: AuthorizationV1Api;
  log: Log;
  namespace: string;
};

const CONTAINER_NAME = 'techdocs';
const POLL_INTERVAL_MS = 1000;
const LOG_FLUSH_TIMEOUT_MS = 5000;
const FATAL_WAITING_REASONS = [
  'ErrImagePull',
  'ImagePullBackOff',
  'InvalidImageName',
  'CreateContainerConfigError',
];

// The prefix DocsBuilder uses for its output directories under backend.workingDirectory
const WORK_DIR_PREFIX = 'techdocs-tmp-';
const MIN_STALE_WORK_DIR_AGE_SECONDS = 3600;

class JobFailedError extends Error {}

const REQUIRED_PERMISSIONS = [
  { group: 'batch', resource: 'jobs', verbs: ['create', 'get', 'delete'] },
  { group: '', resource: 'pods', verbs: ['list'] },
  { group: '', resource: 'pods', subresource: 'log', verbs: ['get'] },
];

/**
 * @internal
 */
export class KubernetesJobRunner implements TechDocsContainerRunner {
  private clientPromise?: Promise<KubernetesClient>;
  private lastStaleWorkDirSweep = 0;
  // Only used in tests, as jest.mock doesn't intercept the dynamic import
  private injectedKubernetesClient?: typeof import('@kubernetes/client-node');

  constructor(
    private readonly options: KubernetesOptions,
    private readonly logger?: LoggerService,
  ) {}

  async runContainer(opts: RunContainerOptions): Promise<void> {
    const client = await this.getClient();
    const { batch, namespace } = client;
    const { cleanupIntervalSeconds = 600 } = this.options;
    if (
      Date.now() - this.lastStaleWorkDirSweep >
      cleanupIntervalSeconds * 1000
    ) {
      this.lastStaleWorkDirSweep = Date.now();
      await this.removeStaleWorkDirs().catch(error =>
        this.logger?.warn(
          `Failed to remove stale TechDocs build directories from ${this.options.workRoot}`,
          error,
        ),
      );
    }
    const job = await this.createNamespacedJobRequest(opts);

    const created = await batch.createNamespacedJob({ namespace, body: job });
    const jobName = created.metadata!.name!; // generateName → server assigns the suffix
    try {
      const podName = await this.waitForPodStart(client, jobName);
      const logs =
        opts.logStream && this.followLogs(client, podName, opts.logStream);
      try {
        await this.waitForJobCompletion(client, jobName);
      } finally {
        await logs?.stop();
      }
    } catch (error) {
      // A failed Job has already stopped, so keep it until its TTL for debugging
      if (!(error instanceof JobFailedError)) {
        await batch
          .deleteNamespacedJob({
            name: jobName,
            namespace,
            propagationPolicy: 'Background',
          })
          .catch(() => {});
      }
      throw error;
    }
  }

  private async waitForPodStart(
    client: KubernetesClient,
    jobName: string,
  ): Promise<string> {
    const { core, namespace } = client;
    let pendingReason =
      'no pod was created, check the Job events for admission or quota errors';
    for (;;) {
      // Check the pod before the Job, so a build that fails within one poll still gets its logs streamed
      const { items } = await core.listNamespacedPod({
        namespace,
        labelSelector: `job-name=${jobName}`,
      });
      const pod = items[0];
      if (pod) {
        const waiting = pod.status?.containerStatuses?.[0]?.state?.waiting;
        if (waiting?.reason && FATAL_WAITING_REASONS.includes(waiting.reason)) {
          throw new Error(
            `Kubernetes job ${jobName} could not start: ${waiting.reason}`,
          );
        }
        if (pod.status?.phase && pod.status.phase !== 'Pending') {
          return pod.metadata!.name!;
        }
        const unscheduled = pod.status?.conditions?.find(
          c => c.type === 'PodScheduled' && c.status === 'False',
        );
        pendingReason = unscheduled
          ? `${unscheduled.reason}: ${unscheduled.message}`
          : waiting?.reason ?? 'the pod stayed pending';
      }
      try {
        await this.assertJobNotFailed(client, jobName);
      } catch (error) {
        if (error instanceof JobFailedError) {
          throw new JobFailedError(
            `${error.message}. The pod never started: ${pendingReason}`,
          );
        }
        throw error;
      }
      await sleep(POLL_INTERVAL_MS);
    }
  }

  // Logs are best effort: the build result comes from the Job status, and a stalled log stream must not block it
  private followLogs(
    client: KubernetesClient,
    podName: string,
    logStream: Writable,
  ): { stop(): Promise<void> } {
    const output = new PassThrough();
    output.pipe(logStream, { end: false });
    const request = client.log.log(
      client.namespace,
      podName,
      CONTAINER_NAME,
      output,
      { follow: true },
    );
    const done = request
      .then(() => finished(output))
      .catch(error =>
        this.logger?.warn(
          `Failed to stream logs from TechDocs build pod ${podName}`,
          error,
        ),
      );
    return {
      stop: async () => {
        let timer: NodeJS.Timeout | undefined;
        const timedOut = await Promise.race([
          done.then(() => false),
          new Promise<boolean>(resolve => {
            timer = setTimeout(() => resolve(true), LOG_FLUSH_TIMEOUT_MS);
          }),
        ]);
        clearTimeout(timer);
        if (timedOut) {
          (await request.catch(() => undefined))?.abort();
          output.end();
        }
        output.unpipe(logStream);
      },
    };
  }

  private async waitForJobCompletion(
    client: KubernetesClient,
    jobName: string,
  ): Promise<void> {
    for (;;) {
      const job = await this.assertJobNotFailed(client, jobName);
      if (
        job.status?.conditions?.some(
          c => c.type === 'Complete' && c.status === 'True',
        )
      ) {
        return;
      }
      await sleep(POLL_INTERVAL_MS);
    }
  }

  private async assertJobNotFailed(
    client: KubernetesClient,
    jobName: string,
  ): Promise<V1Job> {
    const job = await client.batch.readNamespacedJob({
      name: jobName,
      namespace: client.namespace,
    });
    const failed = job.status?.conditions?.find(
      c => c.type === 'Failed' && c.status === 'True',
    );
    if (failed) {
      throw new JobFailedError(
        `Kubernetes job ${jobName} failed: ${failed.reason}${
          failed.message ? ` (${failed.message})` : ''
        }`,
      );
    }
    return job;
  }

  // Build directories outlive a Backstage crash on the shared volume. Past 2x the deadline no Job can still be writing to them.
  private async removeStaleWorkDirs(): Promise<void> {
    const { workRoot, activeDeadlineSeconds = 600 } = this.options;
    const cutoff =
      Date.now() -
      Math.max(2 * activeDeadlineSeconds, MIN_STALE_WORK_DIR_AGE_SECONDS) *
        1000;
    const entries = await fs.readdir(workRoot, { withFileTypes: true });
    await Promise.all(
      entries
        .filter(e => e.isDirectory() && e.name.startsWith(WORK_DIR_PREFIX))
        .map(async e => {
          const dir = path.join(workRoot, e.name);
          if ((await fs.stat(dir)).mtimeMs < cutoff) {
            await fs.remove(dir);
            this.logger?.info(`Removed stale TechDocs build directory ${dir}`);
          }
        }),
    );
  }

  private createAffinity(): V1Affinity | undefined {
    const { nodeName, nodeAffinity = 'preferred' } = this.options;
    if (!nodeName || nodeAffinity === 'none') {
      return undefined;
    }
    // matchFields on metadata.name, as the kubernetes.io/hostname label can differ from the node name
    const term: V1NodeSelectorTerm = {
      matchFields: [
        { key: 'metadata.name', operator: 'In', values: [nodeName] },
      ],
    };
    return {
      nodeAffinity:
        nodeAffinity === 'required'
          ? {
              requiredDuringSchedulingIgnoredDuringExecution: {
                nodeSelectorTerms: [term],
              },
            }
          : {
              preferredDuringSchedulingIgnoredDuringExecution: [
                { weight: 100, preference: term },
              ],
            },
    };
  }

  private async toSubPath(hostDir: string): Promise<string> {
    // Docker can't bind symlinks either, so resolve both sides before comparing
    const [workRoot, dir] = await Promise.all([
      fs.realpath(this.options.workRoot),
      fs.realpath(hostDir),
    ]);
    const subPath = path.relative(workRoot, dir);
    if (
      subPath === '..' ||
      subPath.startsWith(`..${path.sep}`) ||
      path.isAbsolute(subPath)
    ) {
      throw new Error(
        `${hostDir} is not on the shared volume mounted at ${this.options.workRoot}; set backend.workingDirectory to a path under it`,
      );
    }
    return subPath.split(path.sep).join('/');
  }

  private async createNamespacedJobRequest({
    imageName,
    command,
    args,
    mountDirs = {},
    workingDir,
    envVars = {},
    pullImage,
    defaultUser,
  }: RunContainerOptions): Promise<V1Job> {
    const {
      volumeClaimName,
      imagePullSecrets = [],
      activeDeadlineSeconds = 600,
      ttlSecondsAfterFinished = 300,
      resources,
    } = this.options;
    // Match the Backstage process so it can read and clean up the output on the shared volume
    const user =
      !defaultUser && process.getuid && process.getgid
        ? { runAsUser: process.getuid(), runAsGroup: process.getgid() }
        : undefined;
    const volumeMounts = await Promise.all(
      Object.entries(mountDirs).map(async ([hostDir, mountPath]) => ({
        name: 'work',
        mountPath,
        subPath: await this.toSubPath(hostDir),
      })),
    );
    return {
      apiVersion: 'batch/v1',
      kind: 'Job',
      metadata: {
        generateName: 'techdocs-',
        labels: { 'app.kubernetes.io/managed-by': 'backstage-techdocs' },
      },
      spec: {
        backoffLimit: 0,
        activeDeadlineSeconds,
        ttlSecondsAfterFinished,
        template: {
          spec: {
            restartPolicy: 'Never',
            automountServiceAccountToken: false,
            securityContext: {
              ...user,
              runAsNonRoot: user && user.runAsUser !== 0 ? true : undefined,
              seccompProfile: { type: 'RuntimeDefault' },
            },
            affinity: this.createAffinity(),
            imagePullSecrets: imagePullSecrets.length
              ? imagePullSecrets.map(name => ({ name }))
              : undefined,
            containers: [
              {
                name: CONTAINER_NAME,
                image: imageName,
                imagePullPolicy:
                  pullImage === false ? 'IfNotPresent' : 'Always',
                command: typeof command === 'string' ? [command] : command,
                args,
                workingDir,
                env: Object.entries(envVars).map(([name, value]) => ({
                  name,
                  value,
                })),
                resources,
                securityContext: {
                  allowPrivilegeEscalation: false,
                  capabilities: { drop: ['ALL'] },
                },
                volumeMounts,
              },
            ],
            volumes: [
              {
                name: 'work',
                persistentVolumeClaim: { claimName: volumeClaimName },
              },
            ],
          },
        },
      },
    };
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

  protected getClient(): Promise<KubernetesClient> {
    if (!this.clientPromise) {
      this.clientPromise = this.createClient().catch(error => {
        this.clientPromise = undefined;
        throw error;
      });
    }
    return this.clientPromise;
  }

  private async createClient(): Promise<KubernetesClient> {
    // TODO: ESM-only package; switch to a static import once Node 22 is dropped (#34627)
    const {
      AuthorizationV1Api,
      BatchV1Api,
      CoreV1Api,
      KubeConfig,
      Log,
      VersionApi,
    } =
      this.injectedKubernetesClient ??
      (await import('@kubernetes/client-node'));
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
