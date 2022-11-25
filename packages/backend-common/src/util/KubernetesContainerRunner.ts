/*
 * Copyright 2020 The Backstage Authors
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

import { PassThrough, Writable } from 'stream';
import { ContainerRunner, RunContainerOptions } from './ContainerRunner';
import {
  KubeConfig,
  BatchV1Api,
  V1Job,
  V1EnvVar,
  Log,
  HttpError,
  V1Status,
  V1VolumeMount,
  V1PodTemplateSpec,
  V1Pod,
  Watch,
} from '@kubernetes/client-node';
import { v4 as uuid } from 'uuid';
import { Request } from 'request';

/**
 * An existing Kubernetes volume that will be used as base for mounts.
 *
 * Every mount must start with the 'basePath'.
 *
 * @public
 */
export type KubernetesContainerRunnerMountBase = {
  volumeName: string;
  basePath: string;
};

/**
 * Options to create a {@link KubernetesContainerRunner}
 *
 * Kubernetes Jobs will be created on the provided 'namespace'
 * and their names will be prefixed with the provided 'name'.
 *
 * 'podTemplate' defines a Pod template for the Jobs. It has to include
 * a volume definition named as the {@link KubernetesContainerRunnerMountBase} 'volumeName'.
 *
 * @public
 */
export type KubernetesContainerRunnerOptions = {
  kubeConfig: KubeConfig;
  name: string;
  namespace?: string;
  mountBase?: KubernetesContainerRunnerMountBase;
  podTemplate?: V1PodTemplateSpec;
  timeoutMs?: number;
};

/**
 * A {@link ContainerRunner} for Kubernetes.
 *
 * Runs containers leveraging Jobs on a Kubernetes cluster
 *
 * @public
 */
export class KubernetesContainerRunner implements ContainerRunner {
  private readonly kubeConfig: KubeConfig;
  private readonly batchV1Api: BatchV1Api;
  private readonly log: Log;
  private readonly name: string;
  private readonly namespace: string;
  private readonly mountBase?: KubernetesContainerRunnerMountBase;
  private readonly podTemplate?: V1PodTemplateSpec;
  private readonly timeoutMs: number;
  private readonly containerName = 'executor';

  private getNamespace(kubeConfig: KubeConfig, namespace?: string): string {
    let _namespace = namespace;
    if (!_namespace) {
      _namespace = kubeConfig.getContextObject(
        kubeConfig.currentContext,
      )?.namespace;
    }
    if (!_namespace) {
      throw new Error('Cannot read current namespace from Kubernetes cluster');
    }
    return _namespace;
  }

  private validateMountBase(
    mountBase: KubernetesContainerRunnerMountBase,
    podTemplate?: V1PodTemplateSpec,
  ): KubernetesContainerRunnerMountBase {
    if (
      !podTemplate?.spec?.volumes?.filter(v => v.name === mountBase.volumeName)
        .length
    ) {
      throw new Error(
        `A Pod template containing the volume ${mountBase.volumeName} is required`,
      );
    }
    if (!mountBase.basePath.endsWith('/')) {
      mountBase.basePath += '/';
    }
    return mountBase;
  }

  constructor(options: KubernetesContainerRunnerOptions) {
    const { kubeConfig, name, namespace, mountBase, podTemplate, timeoutMs } =
      options;
    this.kubeConfig = kubeConfig;
    this.batchV1Api = kubeConfig.makeApiClient(BatchV1Api);
    this.log = new Log(kubeConfig);
    this.name = name;
    this.namespace = this.getNamespace(kubeConfig, namespace);
    if (mountBase) {
      this.mountBase = this.validateMountBase(mountBase, podTemplate);
    }
    this.podTemplate = podTemplate;
    this.timeoutMs = timeoutMs || 120 * 1000;
  }

  async runContainer(options: RunContainerOptions) {
    const {
      imageName,
      command,
      args,
      logStream = new PassThrough(),
      mountDirs = {},
      workingDir,
      envVars = {},
    } = options;

    const commandArr = typeof command === 'string' ? [command] : command;

    const volumeMounts: V1VolumeMount[] = [];
    for (const [hostDir, containerDir] of Object.entries(mountDirs)) {
      if (!this.mountBase) {
        throw new Error(
          'A volumeName and a basePath must be configured to bind mount directories',
        );
      }
      if (!hostDir.startsWith(this.mountBase.basePath)) {
        throw new Error(
          `Mounted '${hostDir}' dir should be subdirectories of '${this.mountBase.basePath}'`,
        );
      }
      volumeMounts.push({
        name: this.mountBase.volumeName,
        mountPath: containerDir,
        subPath: hostDir.slice(this.mountBase.basePath.length),
      });
    }

    const env = [];
    for (const [key, value] of Object.entries(envVars)) {
      env.push({
        name: key,
        value: value,
      } as V1EnvVar);
    }

    const taskId = uuid();

    // TODO find a way to merge recursively
    const mergedPodTemplate: V1PodTemplateSpec = {
      metadata: {
        ...{
          labels: {
            task: taskId,
          },
        },
        ...this.podTemplate?.metadata,
      },
      spec: {
        ...{
          containers: [
            {
              name: this.containerName,
              image: imageName,
              command: commandArr,
              args: args,
              env: env,
              workingDir: workingDir,
              volumeMounts: volumeMounts,
            },
          ],
          restartPolicy: 'Never',
        },
        ...this.podTemplate?.spec,
      },
    };

    const jobSpec: V1Job = {
      metadata: {
        generateName: `${this.name}-`,
      },
      spec: {
        backoffLimit: 0,
        ttlSecondsAfterFinished: 60,
        template: mergedPodTemplate,
      },
    };

    await this.runJob(jobSpec, taskId, logStream);
  }

  private handleError(err: any, errorCallback: (reason: any) => void) {
    if (err.code !== 'ECONNRESET' && err.message !== 'aborted') {
      errorCallback(
        handleKubernetesError(
          'Kubernetes watch request failed with the following error message:',
          err,
        ),
      );
    }
  }

  private watchPod(
    taskId: string,
    callback: (pod: V1Pod) => void,
    errorCallback: (reason: any) => void,
  ): Promise<Request> {
    const watch = new Watch(this.kubeConfig);
    const labelSelector = `task=${taskId}`;
    return watch.watch(
      `/api/v1/namespaces/${this.namespace}/pods`,
      {
        labelSelector,
      },
      (_, pod) => {
        callback(pod);
      },
      err => {
        if (err) {
          this.handleError(err, errorCallback);
        }
      },
    );
  }

  private tailLogs(
    taskId: string,
    logStream: Writable,
  ): { promise: Promise<void>; close: () => Promise<void> } {
    let log: Promise<Request>;
    let req: Promise<Request>;
    const watchPromise = new Promise<void>((_, reject) => {
      req = this.watchPod(
        taskId,
        pod => {
          if (
            log === undefined &&
            (pod.status?.phase === 'Running' ||
              pod.status?.phase === 'Succeeded' ||
              pod.status?.phase === 'Failed')
          ) {
            log = this.log.log(
              this.namespace,
              pod.metadata?.name!,
              this.containerName,
              logStream,
              { follow: true },
            );
          }
        },
        reject,
      );
    });
    const logPromise = new Promise<void>((resolve, _) => {
      if (!logStream.writableFinished) {
        logStream.on('finish', () => {
          resolve();
        });
      } else {
        resolve();
      }
    });
    const close = async () => {
      if (req) {
        (await req).abort();
      }
      if (log) {
        (await log).abort();
      }
    };
    return { promise: Promise.race([watchPromise, logPromise]), close };
  }

  private waitPod(taskId: string): {
    promise: Promise<void>;
    close: () => Promise<void>;
  } {
    let req: Promise<Request>;
    const promise = new Promise<void>(async (resolve, reject) => {
      req = this.watchPod(
        taskId,
        pod => {
          if (pod.status?.phase === 'Succeeded') {
            resolve();
          }
          if (pod.status?.phase === 'Failed') {
            reject(new Error('Container execution failed'));
          }
        },
        reject,
      );
    });
    const close = async () => {
      if (req) {
        (await req).abort();
      }
    };
    return { promise, close };
  }

  private async createJob(jobSpec: V1Job): Promise<any> {
    return this.batchV1Api
      .createNamespacedJob(this.namespace, jobSpec)
      .catch(err => {
        throw handleKubernetesError(
          'Kubernetes Job creation failed with the following error message:',
          err,
        );
      });
  }

  private async runJob(
    jobSpec: V1Job,
    taskId: string,
    logStream: Writable,
  ): Promise<any> {
    let timeout: NodeJS.Timeout;
    const timeoutPromise = new Promise<void>((_, reject) => {
      timeout = setTimeout(
        reject,
        this.timeoutMs,
        new Error(`Failed to complete in ${this.timeoutMs} ms`),
      );
    });

    const { promise: waitPromise, close: waitClose } = this.waitPod(taskId);
    const { promise: tailPromise, close: tailClose } = this.tailLogs(
      taskId,
      logStream,
    );

    const taskPromise = Promise.all([
      waitPromise,
      tailPromise,
      this.createJob(jobSpec),
    ]).finally(() => {
      clearTimeout(timeout);
    });

    return Promise.race([timeoutPromise, taskPromise])
      .finally(() => {
        return waitClose();
      })
      .finally(() => {
        return tailClose();
      });
  }
}

function handleKubernetesError(message: string, err: Error): Error {
  if (err instanceof HttpError) {
    return new Error(`${message} ${(err.body as V1Status).message}`);
  }
  return new Error(`${message} ${err}`);
}
