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
  V1Pod,
  V1Deployment,
  V1HorizontalPodAutoscaler,
} from '@kubernetes/client-node';
import { detectErrors } from './error-detection';
import * as healthyPod from './__fixtures__/pod.json';
import * as podMissingCm from './__fixtures__/pod-missing-cm.json';
import * as crashingPod from './__fixtures__/pod-crashing.json';
import * as healthyDeploy from './__fixtures__/deploy-healthy.json';
import * as failingDeploy from './__fixtures__/deploy-bad.json';
import * as healthyHpa from './__fixtures__/hpa-healthy.json';
import * as maxedOutHpa from './__fixtures__/hpa-maxed-out.json';
import {
  FetchResponse,
  ObjectsByEntityResponse,
} from '@backstage/plugin-kubernetes-common';

const CLUSTER_NAME = 'cluster-a';

const oneItem = (value: FetchResponse): ObjectsByEntityResponse => {
  return {
    items: [
      {
        cluster: { name: CLUSTER_NAME },
        errors: [],
        podMetrics: [],
        resources: [value],
      },
    ],
  };
};

const onePod = (pod: V1Pod): ObjectsByEntityResponse => {
  return oneItem({
    type: 'pods',
    resources: [pod],
  });
};

const oneDeployment = (deployment: V1Deployment): ObjectsByEntityResponse => {
  return oneItem({
    type: 'deployments',
    resources: [deployment],
  });
};

const oneHpa = (hpa: V1HorizontalPodAutoscaler): ObjectsByEntityResponse => {
  return oneItem({
    type: 'horizontalpodautoscalers',
    resources: [hpa],
  });
};

describe('detectErrors', () => {
  it('should return errors from different clusters', () => {
    const result = detectErrors({
      items: [
        {
          cluster: { name: 'cluster-a' },
          errors: [],
          podMetrics: [],
          resources: [
            {
              type: 'pods',
              resources: [crashingPod as any],
            },
          ],
        },
        {
          cluster: { name: 'cluster-b' },
          errors: [],
          podMetrics: [],
          resources: [
            {
              type: 'horizontalpodautoscalers',
              resources: [maxedOutHpa as any],
            },
          ],
        },
        {
          cluster: { name: 'cluster-c' },
          errors: [],
          podMetrics: [],
          resources: [
            {
              type: 'deployments',
              resources: [healthyDeploy as any],
            },
          ],
        },
      ],
    });

    expect(result.size).toBe(3);

    const errorsFromClusterA = result.get('cluster-a');
    const errorsFromClusterB = result.get('cluster-b');
    const errorsFromClusterC = result.get('cluster-c');

    expect(errorsFromClusterA).toBeDefined();
    expect(errorsFromClusterA).toHaveLength(4);

    expect(errorsFromClusterB).toBeDefined();
    expect(errorsFromClusterB).toHaveLength(1);

    expect(errorsFromClusterC).toBeDefined();
    expect(errorsFromClusterC).toHaveLength(0);
  });

  it('should detect no errors in healthy pod', () => {
    const result = detectErrors(onePod(healthyPod as any));

    expect(result.size).toBe(1);

    const errors = result.get(CLUSTER_NAME);

    expect(errors).toBeDefined();
    expect(errors).toHaveLength(0);
  });
  it('should detect errors in crashing pod', () => {
    const result = detectErrors(onePod(crashingPod as any));

    expect(result.size).toBe(1);

    const errors = result.get(CLUSTER_NAME);

    expect(errors).toBeDefined();
    expect(errors).toHaveLength(4);

    const [err1, err2, err3, err4] = errors ?? [];

    expect(err1).toStrictEqual({
      sourceRef: {
        apiGroup: 'v1',
        kind: 'Pod',
        name: 'dice-roller-canary-7d64cd756c-55rfq',
        namespace: 'default',
      },
      message:
        'back-off 5m0s restarting failed container=other-side-car pod=dice-roller-canary-7d64cd756c-55rfq_default(65ad28e3-5d51-4b4b-9bf8-4cb069803034)',
      severity: 4,
      proposedFix: {
        container: 'other-side-car',
        errorType: 'CrashLoopBackOff',
        possibleFixes: ['Check the crash logs for stacktraces'],
        rootCauseExplanation:
          'The container other-side-car has crashed many times, it will be exponentially restarted until it stops crashing',
        type: 'logs',
      },
      occuranceCount: 1,
      type: 'container-waiting',
    });

    expect(err2).toStrictEqual({
      sourceRef: {
        apiGroup: 'v1',
        kind: 'Pod',
        name: 'dice-roller-canary-7d64cd756c-55rfq',
        namespace: 'default',
      },
      proposedFix: {
        container: 'other-side-car',
        errorType: 'CrashLoopBackOff',
        possibleFixes: ['Check the crash logs for stacktraces'],
        rootCauseExplanation:
          'The container other-side-car has crashed many times, it will be exponentially restarted until it stops crashing',
        type: 'logs',
      },
      message:
        'back-off 5m0s restarting failed container=side-car pod=dice-roller-canary-7d64cd756c-55rfq_default(65ad28e3-5d51-4b4b-9bf8-4cb069803034)',
      severity: 4,
      occuranceCount: 1,
      type: 'container-waiting',
    });

    expect(err3).toStrictEqual({
      sourceRef: {
        apiGroup: 'v1',
        kind: 'Pod',
        name: 'dice-roller-canary-7d64cd756c-55rfq',
        namespace: 'default',
      },
      message: 'container=other-side-car restarted 123 times',
      severity: 4,
      occuranceCount: 123,
      proposedFix: {
        container: 'other-side-car',
        errorType: 'Error',
        possibleFixes: ['Check the crash logs for stacktraces'],
        rootCauseExplanation:
          'This container has exited with a non-zero exit code (1)',
        type: 'logs',
      },
      type: 'containers-restarting',
    });

    expect(err4).toStrictEqual({
      sourceRef: {
        apiGroup: 'v1',
        kind: 'Pod',
        name: 'dice-roller-canary-7d64cd756c-55rfq',
        namespace: 'default',
      },
      proposedFix: {
        container: 'other-side-car',
        errorType: 'Error',
        possibleFixes: ['Check the crash logs for stacktraces'],
        rootCauseExplanation:
          'This container has exited with a non-zero exit code (1)',
        type: 'logs',
      },
      message: 'container=side-car restarted 38 times',
      severity: 4,
      occuranceCount: 38,
      type: 'containers-restarting',
    });
  });
  it('should detect errors in pod with missing Config Map', () => {
    const result = detectErrors(onePod(podMissingCm as any));

    expect(result.size).toBe(1);

    const errors = result.get(CLUSTER_NAME);

    expect(errors).toBeDefined();
    expect(errors).toHaveLength(1);

    const [err1] = errors ?? [];

    expect(err1).toStrictEqual({
      message: 'configmap "some-cm" not found',
      occuranceCount: 1,
      proposedFix: {
        docsLink: '',
        errorType: 'CreateContainerConfigError',
        possibleFixes: [
          'Ensure ConfigMaps references in the Deployment manifest are correct and the keys exist',
          'Ensure Secrets references in the Deployment manifest are correct and the keys exist',
        ],
        rootCauseExplanation:
          'There is missing or mismatching configuration required to start the container',
        type: 'docs',
      },
      severity: 4,
      sourceRef: {
        apiGroup: 'v1',
        kind: 'Pod',
        name: 'dice-roller-bad-cm-855bf85464-mg6xb',
        namespace: 'default',
      },
      type: 'container-waiting',
    });
  });
  it('should detect no errors in healthy deployment', () => {
    const result = detectErrors(oneDeployment(healthyDeploy as any));

    expect(result.size).toBe(1);

    const errors = result.get(CLUSTER_NAME);

    expect(errors).toBeDefined();
    expect(errors).toHaveLength(0);
  });
  it('should detect in deployment which cannot progress', () => {
    const result = detectErrors(oneDeployment(failingDeploy as any));

    expect(result.size).toBe(1);

    const errors = result.get(CLUSTER_NAME);

    expect(errors).toBeDefined();
    expect(errors).toHaveLength(1);

    const [err1] = errors ?? [];

    expect(err1).toStrictEqual({
      sourceRef: {
        apiGroup: 'apps/v1',
        kind: 'Deployment',
        name: 'dice-roller-canary',
        namespace: 'default',
      },
      message: 'Deployment does not have minimum availability.',
      severity: 6,
      occuranceCount: 1,
      type: 'condition-message-present',
    });
  });
  it('should detect no errors in healthy hpa', () => {
    const result = detectErrors(oneHpa(healthyHpa as any));

    expect(result.size).toBe(1);

    const errors = result.get(CLUSTER_NAME);

    expect(errors).toBeDefined();
    expect(errors).toHaveLength(0);
  });
  it('should detect in maxed out hpa', () => {
    const result = detectErrors(oneHpa(maxedOutHpa as any));

    expect(result.size).toBe(1);

    const errors = result.get(CLUSTER_NAME);

    expect(errors).toBeDefined();
    expect(errors).toHaveLength(1);

    const [err1] = errors ?? [];

    expect(err1).toStrictEqual({
      sourceRef: {
        apiGroup: 'autoscaling/v1',
        kind: 'HorizontalPodAutoscaler',
        name: 'dice-roller',
        namespace: 'default',
      },
      message:
        'Current number of replicas (10) is equal to the configured max number of replicas (10)',
      severity: 8,
      occuranceCount: 1,
      type: 'hpa-max-current-replicas',
    });
  });
  it('pending pod is not an error', async () => {
    const expiredReadiness = new Date();
    expiredReadiness.setFullYear(expiredReadiness.getFullYear() - 1);
    const result = await detectErrors(
      onePod({
        spec: {
          containers: [
            {
              name: 'some-container',
              readinessProbe: {
                initialDelaySeconds: 20000,
                failureThreshold: 5,
                periodSeconds: 5,
              },
            },
          ],
        },
        status: {
          containerStatuses: [
            {
              name: 'some-container',
              image: 'some-image',
              imageID: 'some-image-id',
              restartCount: 0,
              containerID: 'running-container',
              ready: false,
              state: {
                running: {
                  startedAt: new Date().toISOString() as any,
                },
              },
            },
          ],
          message: 'Container running',
        },
      }),
    );

    const errors = result.get(CLUSTER_NAME);

    expect(errors).toBeDefined();
    expect(errors).toHaveLength(0);
  });
  it('no probe pod has no errors', async () => {
    const expiredReadiness = new Date();
    expiredReadiness.setFullYear(expiredReadiness.getFullYear() - 1);
    const result = await detectErrors(
      onePod({
        spec: {
          containers: [
            {
              name: 'some-container',
            },
          ],
        },
        status: {
          containerStatuses: [
            {
              name: 'some-container',
              image: 'some-image',
              imageID: 'some-image-id',
              restartCount: 0,
              containerID: 'running-container',
              ready: false,
              state: {
                running: {
                  startedAt: new Date().toISOString() as any,
                },
              },
            },
          ],
          message: 'Container running',
        },
      }),
    );

    const errors = result.get(CLUSTER_NAME);

    expect(errors).toBeDefined();
    expect(errors).toHaveLength(0);
  });
  it('readiness probe failure results in error', async () => {
    const expiredReadiness = new Date();
    expiredReadiness.setFullYear(expiredReadiness.getFullYear() - 1);
    const result = await detectErrors(
      onePod({
        spec: {
          containers: [
            {
              name: 'some-container',
              readinessProbe: {
                initialDelaySeconds: 20,
                failureThreshold: 5,
                periodSeconds: 5,
              },
            },
          ],
        },
        status: {
          containerStatuses: [
            {
              name: 'some-container',
              image: 'some-image',
              imageID: 'some-image-id',
              restartCount: 0,
              containerID: 'running-container',
              ready: false,
              state: {
                running: {
                  startedAt: expiredReadiness.toISOString() as any,
                },
              },
            },
          ],
          message: 'Container running',
        },
      }),
    );

    const errors = result.get(CLUSTER_NAME);

    expect(errors).toBeDefined();
    expect(errors).toHaveLength(1);

    const [err1] = errors ?? [];

    expect(err1).toStrictEqual({
      message:
        'The container some-container failed to start properly, but is not crashing',
      occuranceCount: 1,
      proposedFix: {
        docsLink: 'TODO',
        errorType: 'ReadinessProbeFailed',
        podName: '',
        possibleFixes: [
          'Ensure that the container starts correctly locally',
          "Check the container's logs looking for error during startup",
        ],
        rootCauseExplanation:
          'The container some-container failed to start properly, but is not crashing',
        type: 'events',
      },
      severity: 4,
      sourceRef: {
        apiGroup: 'v1',
        kind: 'Pod',
        name: 'unknown pod',
        namespace: 'unknown namespace',
      },
      type: 'readiness-probe-taking-too-long',
    });
  });
});
