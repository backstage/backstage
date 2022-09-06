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

import {
  CoreV1Api,
  KubeConfig,
  RbacAuthorizationV1Api,
} from '@kubernetes/client-node';
import {
  KubernetesContainerRunner,
  KubernetesContainerRunnerOptions,
} from './KubernetesContainerRunner';
import { RunContainerOptions } from './ContainerRunner';
import { PassThrough } from 'stream';

// This ensures E2E tests that require a Kubernetes cluster are only run
// where KUBERNETES_TESTS environment variable is true
const describeIfKubernetes = Boolean(process.env.KUBERNETES_TESTS)
  ? describe
  : describe.skip;

jest.setTimeout(10 * 1000);

describeIfKubernetes('KubernetesContainerRunner', () => {
  const kubeConfig = new KubeConfig();
  kubeConfig.loadFromDefault();
  const name = 'kube-runner';

  it('should throw error when no namespace is configured', () => {
    const testConfig = new KubeConfig();
    testConfig.loadFromDefault();
    testConfig.addContext({
      name: 'test',
      cluster: kubeConfig.getCurrentCluster()!.name,
      user: kubeConfig.getCurrentUser()!.name,
    });
    testConfig.setCurrentContext('test');
    const test = () =>
      new KubernetesContainerRunner({
        kubeConfig: testConfig,
        name,
      });
    expect(test).toThrow(
      /Cannot read current namespace from Kubernetes cluster/,
    );
  });

  it('should throw error when mountBase is provided and podTemplate is invalid', () => {
    const error = /A Pod template containing the volume .+ is required/;
    const options: KubernetesContainerRunnerOptions = {
      kubeConfig,
      name,
      namespace: 'default',
      mountBase: {
        basePath: '/workdir',
        volumeName: 'workdir',
      },
    };
    const test = () => {
      return new KubernetesContainerRunner(options);
    };
    expect(test).toThrow(error);
    options.podTemplate = {};
    expect(test).toThrow(error);
    options.podTemplate.spec = { containers: [] };
    expect(test).toThrow(error);
    options.podTemplate.spec.volumes = [];
    expect(test).toThrow(error);
  });

  it('should not run the container when the mounts are not subdirectories of the basePath', async () => {
    const options: KubernetesContainerRunnerOptions = {
      kubeConfig,
      name,
      namespace: 'default',
      mountBase: {
        basePath: '/workdir',
        volumeName: 'workdir',
      },
      podTemplate: {
        spec: {
          containers: [],
          volumes: [
            {
              name: 'workdir',
            },
          ],
        },
      },
    };
    const containerRunner = new KubernetesContainerRunner(options);
    const logStream = new PassThrough();
    const runOptions: RunContainerOptions = {
      imageName: 'golang:1.17',
      args: ['echo', 'hello world'],
      logStream,
      mountDirs: {
        '/notWorkdir/app': '/app',
      },
    };
    await expect(containerRunner.runContainer(runOptions)).rejects.toThrow(
      `Mounted '/notWorkdir/app' dir should be subdirectories of '${
        options!.mountBase!.basePath
      }'`,
    );
  });

  it('should succeed when the container command returns a 0 exit code', async () => {
    const options: KubernetesContainerRunnerOptions = {
      kubeConfig,
      name,
      namespace: 'default',
    };
    const containerRunner = new KubernetesContainerRunner(options);
    const logStream = new PassThrough();
    const chunks: any[] = [];
    logStream.on('data', chunk => chunks.push(Buffer.from(chunk)));
    const runOptions: RunContainerOptions = {
      imageName: 'alpine',
      args: ['echo', 'hello world'],
      logStream,
    };
    await containerRunner.runContainer(runOptions);
    const result = Buffer.concat(chunks).toString('utf8');
    expect(result).toBe('hello world\n');
  });

  it('should fail when container run time exceeds the timeout', async () => {
    const options: KubernetesContainerRunnerOptions = {
      kubeConfig,
      name,
      namespace: 'default',
      timeoutMs: 5000,
    };
    const containerRunner = new KubernetesContainerRunner(options);
    const runOptions: RunContainerOptions = {
      imageName: 'alpine',
      args: ['sleep', '10'],
    };
    await expect(containerRunner.runContainer(runOptions)).rejects.toThrow(
      `Failed to complete in ${options.timeoutMs} ms`,
    );
  });

  it('should fail when container command returns a non 0 exit code', async () => {
    const options: KubernetesContainerRunnerOptions = {
      kubeConfig,
      name,
      namespace: 'default',
    };
    const containerRunner = new KubernetesContainerRunner(options);
    const runOptions: RunContainerOptions = {
      imageName: 'alpine',
      args: ['fake'],
    };
    await expect(containerRunner.runContainer(runOptions)).rejects.toThrow(
      `Container execution failed`,
    );
  });

  it('should fail when job creation fails', async () => {
    const options: KubernetesContainerRunnerOptions = {
      kubeConfig,
      name,
      namespace: 'fake',
    };
    const containerRunner = new KubernetesContainerRunner(options);
    const runOptions: RunContainerOptions = {
      imageName: 'golang:1.17',
      args: ['echo', 'hello world'],
    };
    await expect(containerRunner.runContainer(runOptions)).rejects.toThrow(
      'Kubernetes Job creation failed with the following error message: namespaces "fake" not found',
    );
  });

  describe('with namespace test', () => {
    let api: CoreV1Api;
    let authApi: RbacAuthorizationV1Api;

    beforeAll(async () => {
      api = kubeConfig.makeApiClient(CoreV1Api);
      authApi = kubeConfig.makeApiClient(RbacAuthorizationV1Api);
      await api.createNamespace({
        metadata: {
          name: 'test',
        },
      });
    });
    afterAll(async () => {
      await api.deleteNamespace('test');
    });

    it('should fail when watch fails', async () => {
      const testConfig = await givenAServiceAccountThatCannotWatchPods(
        api,
        authApi,
        kubeConfig,
      );
      const options: KubernetesContainerRunnerOptions = {
        kubeConfig: testConfig,
        name,
        namespace: 'test',
      };
      const containerRunner = new KubernetesContainerRunner(options);
      const runOptions: RunContainerOptions = {
        imageName: 'golang:1.17',
        args: ['echo', 'hello world'],
      };
      await expect(containerRunner.runContainer(runOptions)).rejects.toThrow(
        'Kubernetes watch request failed with the following error message: Error: Forbidden',
      );
    });
  });
});

async function givenAServiceAccountThatCannotWatchPods(
  api: CoreV1Api,
  authApi: RbacAuthorizationV1Api,
  kubeConfig: KubeConfig,
) {
  await Promise.all([
    api.createNamespacedServiceAccount('test', {
      metadata: {
        name: 'test',
      },
    }),
    authApi.createNamespacedRole('test', {
      metadata: {
        name: 'test',
      },
      rules: [
        {
          apiGroups: ['batch'],
          verbs: ['create'],
          resources: ['jobs'],
        },
      ],
    }),
    authApi.createNamespacedRoleBinding('test', {
      metadata: {
        name: 'test',
      },
      subjects: [
        {
          kind: 'ServiceAccount',
          name: 'test',
        },
      ],
      roleRef: {
        apiGroup: 'rbac.authorization.k8s.io',
        kind: 'Role',
        name: 'test',
      },
    }),
  ]);
  const token = (
    await api.createNamespacedServiceAccountToken('test', 'test', {
      spec: {
        audiences: [],
      },
    })
  ).body.status?.token;
  const testConfig = new KubeConfig();
  testConfig.loadFromDefault();
  testConfig.addUser({
    name: 'test',
    token,
  });
  testConfig.addContext({
    name: 'test',
    cluster: kubeConfig.getCurrentCluster()!.name,
    user: 'test',
  });
  testConfig.setCurrentContext('test');
  return testConfig;
}
