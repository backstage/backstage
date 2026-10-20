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

import { createMockDirectory } from '@backstage/backend-test-utils';
import fs from 'fs-extra';
import { PassThrough, Writable } from 'node:stream';
import { KubernetesJobRunner } from './KubernetesJobRunner';
import { KubernetesOptions } from './types';

const mockBatch = {
  createNamespacedJob: jest.fn(),
  readNamespacedJob: jest.fn(),
  deleteNamespacedJob: jest.fn(),
};
const mockCore = { listNamespacedPod: jest.fn() };
const mockAuthorization = { createSelfSubjectAccessReview: jest.fn() };
const mockVersion = { getCode: jest.fn() };
const mockLog = jest.fn();

const mockKubernetesClient = {
  KubeConfig: class {
    loadFromDefault() {}
    getCurrentContext() {
      return 'test';
    }
    getContextObject() {
      return { namespace: 'from-context' };
    }
    getCurrentCluster() {
      return { server: 'https://k8s.test' };
    }
    makeApiClient(api: () => unknown) {
      return api();
    }
  },
  BatchV1Api: () => mockBatch,
  CoreV1Api: () => mockCore,
  AuthorizationV1Api: () => mockAuthorization,
  VersionApi: () => mockVersion,
  Log: class {
    log = mockLog;
  },
};

const workDir = createMockDirectory();

function createRunner(options: Partial<KubernetesOptions> = {}) {
  const runner = new KubernetesJobRunner({
    volumeClaimName: 'techdocs-work',
    workRoot: workDir.path,
    ...options,
  });
  (runner as any).injectedKubernetesClient = mockKubernetesClient;
  return runner;
}

function runOptions() {
  return {
    imageName: 'spotify/techdocs',
    args: ['build', '-d', '/output'],
    mountDirs: {
      [workDir.resolve('tree/repo')]: '/input',
      [workDir.resolve('techdocs-tmp-1')]: '/output',
    },
    workingDir: '/input',
    envVars: { HOME: '/tmp' },
  };
}

function createdJob() {
  return mockBatch.createNamespacedJob.mock.calls.at(-1)[0];
}

describe('KubernetesJobRunner', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    workDir.setContent({ 'tree/repo': {}, 'techdocs-tmp-1': {} });
    mockVersion.getCode.mockResolvedValue({});
    mockAuthorization.createSelfSubjectAccessReview.mockResolvedValue({
      status: { allowed: true },
    });
    mockBatch.createNamespacedJob.mockResolvedValue({
      metadata: { name: 'techdocs-abc' },
    });
    mockBatch.readNamespacedJob.mockResolvedValue({
      status: { conditions: [{ type: 'Complete', status: 'True' }] },
    });
    mockBatch.deleteNamespacedJob.mockResolvedValue({});
    mockCore.listNamespacedPod.mockResolvedValue({
      items: [
        {
          metadata: { name: 'techdocs-abc-pod' },
          status: { phase: 'Running' },
        },
      ],
    });
    mockLog.mockImplementation(
      async (_ns: string, _pod: string, _container: string, out: Writable) => {
        out.end('mkdocs output\n');
        return new AbortController();
      },
    );
  });

  it('runs the build as a locked down Job on the shared volume and streams its logs', async () => {
    const runner = createRunner({ nodeName: 'node-1' });
    const logStream = new PassThrough();
    const logs: string[] = [];
    logStream.on('data', chunk => logs.push(chunk.toString()));

    await runner.runContainer({ ...runOptions(), logStream });

    const { namespace, body } = createdJob();
    const podSpec = body.spec.template.spec;
    expect(namespace).toBe('from-context');
    expect(body.spec).toMatchObject({
      backoffLimit: 0,
      activeDeadlineSeconds: 600,
      ttlSecondsAfterFinished: 300,
    });
    expect(podSpec.containers[0]).toMatchObject({
      image: 'spotify/techdocs',
      imagePullPolicy: 'Always',
      args: ['build', '-d', '/output'],
      workingDir: '/input',
      env: [{ name: 'HOME', value: '/tmp' }],
      securityContext: {
        allowPrivilegeEscalation: false,
        capabilities: { drop: ['ALL'] },
      },
      volumeMounts: [
        { name: 'work', mountPath: '/input', subPath: 'tree/repo' },
        { name: 'work', mountPath: '/output', subPath: 'techdocs-tmp-1' },
      ],
    });
    expect(podSpec.containers[0].resources).toBeUndefined();
    expect(podSpec.volumes).toEqual([
      { name: 'work', persistentVolumeClaim: { claimName: 'techdocs-work' } },
    ]);
    expect(podSpec.automountServiceAccountToken).toBe(false);
    expect(podSpec.imagePullSecrets).toBeUndefined();
    expect(podSpec.securityContext).toEqual({
      ...(process.getuid && process.getgid
        ? {
            runAsUser: process.getuid(),
            runAsGroup: process.getgid(),
            runAsNonRoot: process.getuid() !== 0 ? true : undefined,
          }
        : {}),
      seccompProfile: { type: 'RuntimeDefault' },
    });
    expect(podSpec.affinity).toEqual({
      nodeAffinity: {
        preferredDuringSchedulingIgnoredDuringExecution: [
          {
            weight: 100,
            preference: {
              matchFields: [
                { key: 'metadata.name', operator: 'In', values: ['node-1'] },
              ],
            },
          },
        ],
      },
    });

    expect(mockCore.listNamespacedPod).toHaveBeenCalledWith({
      namespace: 'from-context',
      labelSelector: 'job-name=techdocs-abc',
    });
    expect(mockLog).toHaveBeenCalledWith(
      'from-context',
      'techdocs-abc-pod',
      'techdocs',
      expect.anything(),
      { follow: true },
    );
    expect(logs.join('')).toBe('mkdocs output\n');
    expect(logStream.writableEnded).toBe(false);
    expect(mockBatch.deleteNamespacedJob).not.toHaveBeenCalled();
    expect(
      mockAuthorization.createSelfSubjectAccessReview,
    ).toHaveBeenCalledTimes(5);

    await runner.runContainer(runOptions());
    expect(mockVersion.getCode).toHaveBeenCalledTimes(1);
  });

  it('applies the configured scheduling, pull and resource options', async () => {
    await createRunner({
      namespace: 'builds',
      nodeName: 'node-1',
      nodeAffinity: 'required',
      imagePullSecrets: ['registry-creds'],
      activeDeadlineSeconds: 1200,
      ttlSecondsAfterFinished: 60,
      resources: { requests: { cpu: '250m' }, limits: { memory: '1Gi' } },
    }).runContainer({ ...runOptions(), pullImage: false, defaultUser: true });
    const { namespace, body } = createdJob();
    const podSpec = body.spec.template.spec;
    expect(namespace).toBe('builds');
    expect(body.spec).toMatchObject({
      activeDeadlineSeconds: 1200,
      ttlSecondsAfterFinished: 60,
    });
    expect(podSpec.affinity).toEqual({
      nodeAffinity: {
        requiredDuringSchedulingIgnoredDuringExecution: {
          nodeSelectorTerms: [
            {
              matchFields: [
                { key: 'metadata.name', operator: 'In', values: ['node-1'] },
              ],
            },
          ],
        },
      },
    });
    expect(podSpec.imagePullSecrets).toEqual([{ name: 'registry-creds' }]);
    expect(podSpec.securityContext).toEqual({
      seccompProfile: { type: 'RuntimeDefault' },
    });
    expect(podSpec.containers[0]).toMatchObject({
      imagePullPolicy: 'IfNotPresent',
      resources: { requests: { cpu: '250m' }, limits: { memory: '1Gi' } },
    });

    await createRunner({
      nodeName: 'node-1',
      nodeAffinity: 'none',
    }).runContainer(runOptions());
    expect(createdJob().body.spec.template.spec.affinity).toBeUndefined();

    await createRunner().runContainer(runOptions());
    expect(createdJob().body.spec.template.spec.affinity).toBeUndefined();
  });

  it('refuses to mount directories outside the shared volume', async () => {
    const outside = createMockDirectory();
    outside.setContent({ docs: {} });

    await expect(
      createRunner().runContainer({
        ...runOptions(),
        mountDirs: { [outside.resolve('docs')]: '/input' },
      }),
    ).rejects.toThrow(
      `${outside.resolve('docs')} is not on the shared volume mounted at ${
        workDir.path
      }`,
    );
    expect(mockBatch.createNamespacedJob).not.toHaveBeenCalled();
  });

  it('reports why the build failed and deletes only Jobs that are still running', async () => {
    const runner = createRunner();

    mockBatch.readNamespacedJob.mockResolvedValue({
      status: {
        conditions: [
          {
            type: 'Failed',
            status: 'True',
            reason: 'BackoffLimitExceeded',
            message: 'Job has reached the specified backoff limit',
          },
        ],
      },
    });
    await expect(runner.runContainer(runOptions())).rejects.toThrow(
      'Kubernetes job techdocs-abc failed: BackoffLimitExceeded (Job has reached the specified backoff limit)',
    );
    expect(mockBatch.deleteNamespacedJob).not.toHaveBeenCalled();

    mockBatch.readNamespacedJob.mockResolvedValue({ status: {} });
    mockCore.listNamespacedPod.mockResolvedValue({
      items: [
        {
          metadata: { name: 'techdocs-abc-pod' },
          status: {
            phase: 'Pending',
            containerStatuses: [
              { state: { waiting: { reason: 'ImagePullBackOff' } } },
            ],
          },
        },
      ],
    });
    await expect(runner.runContainer(runOptions())).rejects.toThrow(
      'Kubernetes job techdocs-abc could not start: ImagePullBackOff',
    );
    expect(mockBatch.deleteNamespacedJob).toHaveBeenCalledTimes(1);
    expect(mockBatch.deleteNamespacedJob).toHaveBeenCalledWith({
      name: 'techdocs-abc',
      namespace: 'from-context',
      propagationPolicy: 'Background',
    });
  });

  it('removes stale build directories left on the shared volume', async () => {
    workDir.addContent({
      'techdocs-tmp-stale': { 'index.html': '' },
      'backstage-stale': {},
    });
    const hourAgo = new Date(Date.now() - 2 * 3600 * 1000);
    await fs.utimes(workDir.resolve('techdocs-tmp-stale'), hourAgo, hourAgo);
    await fs.utimes(workDir.resolve('backstage-stale'), hourAgo, hourAgo);

    await createRunner().runContainer(runOptions());

    expect(fs.existsSync(workDir.resolve('techdocs-tmp-stale'))).toBe(false);
    expect(fs.existsSync(workDir.resolve('techdocs-tmp-1'))).toBe(true);
    expect(fs.existsSync(workDir.resolve('backstage-stale'))).toBe(true);
  });

  it('checks cluster access and permissions before creating a Job', async () => {
    const runner = createRunner();

    mockVersion.getCode.mockRejectedValueOnce(new Error('ECONNREFUSED'));
    await expect(runner.runContainer(runOptions())).rejects.toThrow(
      /API server at https:\/\/k8s.test does not appear to be reachable.*ECONNREFUSED/,
    );

    mockAuthorization.createSelfSubjectAccessReview.mockImplementation(
      async ({ body }) => ({
        status: { allowed: body.spec.resourceAttributes.resource !== 'pods' },
      }),
    );
    await expect(runner.runContainer(runOptions())).rejects.toThrow(
      "Missing Kubernetes permissions in namespace 'from-context': list pods, get pods/log",
    );
    expect(mockBatch.createNamespacedJob).not.toHaveBeenCalled();
  });
});
