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

import { parseKubernetesPath } from './parseKubernetesPath';

describe('parseKubernetesPath', () => {
  describe('core API paths', () => {
    it('parses a namespace-scoped GET of a single pod', () => {
      const result = parseKubernetesPath(
        '/api/v1/namespaces/default/pods/my-pod',
        'GET',
      );
      expect(result).toEqual({
        verb: 'get',
        action: 'read',
        resourceType: 'pods',
        namespace: 'default',
        subresource: undefined,
        apiGroup: '',
      });
    });

    it('parses a namespace-scoped list of pods', () => {
      const result = parseKubernetesPath(
        '/api/v1/namespaces/kube-system/pods',
        'GET',
      );
      expect(result).toEqual({
        verb: 'list',
        action: 'read',
        resourceType: 'pods',
        namespace: 'kube-system',
        subresource: undefined,
        apiGroup: '',
      });
    });

    it('parses a cluster-scoped list of namespaces', () => {
      const result = parseKubernetesPath('/api/v1/namespaces', 'GET');
      expect(result).toEqual({
        verb: 'list',
        action: 'read',
        resourceType: 'namespaces',
        namespace: undefined,
        subresource: undefined,
        apiGroup: '',
      });
    });

    it('parses a cluster-scoped GET of a single namespace', () => {
      const result = parseKubernetesPath('/api/v1/namespaces/default', 'GET');
      expect(result).toEqual({
        verb: 'get',
        action: 'read',
        resourceType: 'namespaces',
        namespace: undefined,
        subresource: undefined,
        apiGroup: '',
      });
    });

    it('parses pod exec subresource as exec action', () => {
      const result = parseKubernetesPath(
        '/api/v1/namespaces/default/pods/my-pod/exec',
        'POST',
      );
      expect(result).toEqual({
        verb: 'create',
        action: 'exec',
        resourceType: 'pods',
        namespace: 'default',
        subresource: 'exec',
        apiGroup: '',
      });
    });

    it('parses pod attach subresource as exec action', () => {
      const result = parseKubernetesPath(
        '/api/v1/namespaces/default/pods/my-pod/attach',
        'POST',
      );
      expect(result).toEqual({
        verb: 'create',
        action: 'exec',
        resourceType: 'pods',
        namespace: 'default',
        subresource: 'attach',
        apiGroup: '',
      });
    });

    it('parses pod portforward as exec action', () => {
      const result = parseKubernetesPath(
        '/api/v1/namespaces/default/pods/my-pod/portforward',
        'POST',
      );
      expect(result).toEqual({
        verb: 'create',
        action: 'exec',
        resourceType: 'pods',
        namespace: 'default',
        subresource: 'portforward',
        apiGroup: '',
      });
    });

    it('parses pod log subresource as read action regardless of method', () => {
      const result = parseKubernetesPath(
        '/api/v1/namespaces/default/pods/my-pod/log',
        'GET',
      );
      expect(result).toEqual({
        verb: 'get',
        action: 'read',
        resourceType: 'pods',
        namespace: 'default',
        subresource: 'log',
        apiGroup: '',
      });
    });

    it('parses DELETE of a pod', () => {
      const result = parseKubernetesPath(
        '/api/v1/namespaces/default/pods/my-pod',
        'DELETE',
      );
      expect(result).toEqual({
        verb: 'delete',
        action: 'delete',
        resourceType: 'pods',
        namespace: 'default',
        subresource: undefined,
        apiGroup: '',
      });
    });

    it('parses a collection DELETE (deletecollection)', () => {
      const result = parseKubernetesPath(
        '/api/v1/namespaces/default/pods',
        'DELETE',
      );
      expect(result).toEqual({
        verb: 'deletecollection',
        action: 'delete',
        resourceType: 'pods',
        namespace: 'default',
        subresource: undefined,
        apiGroup: '',
      });
    });

    it('parses a POST (create)', () => {
      const result = parseKubernetesPath(
        '/api/v1/namespaces/default/pods',
        'POST',
      );
      expect(result).toEqual({
        verb: 'create',
        action: 'write',
        resourceType: 'pods',
        namespace: 'default',
        subresource: undefined,
        apiGroup: '',
      });
    });

    it('parses a PUT (update)', () => {
      const result = parseKubernetesPath(
        '/api/v1/namespaces/default/pods/my-pod',
        'PUT',
      );
      expect(result).toEqual({
        verb: 'update',
        action: 'write',
        resourceType: 'pods',
        namespace: 'default',
        subresource: undefined,
        apiGroup: '',
      });
    });

    it('parses a PATCH', () => {
      const result = parseKubernetesPath(
        '/api/v1/namespaces/default/pods/my-pod',
        'PATCH',
      );
      expect(result).toEqual({
        verb: 'patch',
        action: 'write',
        resourceType: 'pods',
        namespace: 'default',
        subresource: undefined,
        apiGroup: '',
      });
    });

    it('detects watch via query parameter', () => {
      const result = parseKubernetesPath(
        '/api/v1/namespaces/default/pods',
        'GET',
        'watch=true',
      );
      expect(result).toEqual({
        verb: 'watch',
        action: 'read',
        resourceType: 'pods',
        namespace: 'default',
        subresource: undefined,
        apiGroup: '',
      });
    });

    it('parses secrets access', () => {
      const result = parseKubernetesPath(
        '/api/v1/namespaces/default/secrets/my-secret',
        'GET',
      );
      expect(result).toEqual({
        verb: 'get',
        action: 'read',
        resourceType: 'secrets',
        namespace: 'default',
        subresource: undefined,
        apiGroup: '',
      });
    });
  });

  describe('API group paths', () => {
    it('parses a deployment in apps group', () => {
      const result = parseKubernetesPath(
        '/apis/apps/v1/namespaces/default/deployments/my-deploy',
        'GET',
      );
      expect(result).toEqual({
        verb: 'get',
        action: 'read',
        resourceType: 'deployments',
        namespace: 'default',
        subresource: undefined,
        apiGroup: 'apps',
      });
    });

    it('parses cluster-scoped custom resource', () => {
      const result = parseKubernetesPath(
        '/apis/rbac.authorization.k8s.io/v1/clusterroles/admin',
        'GET',
      );
      expect(result).toEqual({
        verb: 'get',
        action: 'read',
        resourceType: 'clusterroles',
        namespace: undefined,
        subresource: undefined,
        apiGroup: 'rbac.authorization.k8s.io',
      });
    });

    it('parses a CRD list', () => {
      const result = parseKubernetesPath(
        '/apis/tekton.dev/v1beta1/namespaces/ci/pipelineruns',
        'GET',
      );
      expect(result).toEqual({
        verb: 'list',
        action: 'read',
        resourceType: 'pipelineruns',
        namespace: 'ci',
        subresource: undefined,
        apiGroup: 'tekton.dev',
      });
    });

    it('parses status subresource as read', () => {
      const result = parseKubernetesPath(
        '/apis/apps/v1/namespaces/default/deployments/my-deploy/status',
        'GET',
      );
      expect(result).toEqual({
        verb: 'get',
        action: 'read',
        resourceType: 'deployments',
        namespace: 'default',
        subresource: 'status',
        apiGroup: 'apps',
      });
    });
  });

  describe('non-resource paths', () => {
    it('returns undefined for healthz', () => {
      expect(parseKubernetesPath('/healthz', 'GET')).toBeUndefined();
    });

    it('returns undefined for version', () => {
      expect(parseKubernetesPath('/version', 'GET')).toBeUndefined();
    });

    it('returns undefined for openapi', () => {
      expect(parseKubernetesPath('/openapi/v2', 'GET')).toBeUndefined();
    });

    it('returns undefined for empty path', () => {
      expect(parseKubernetesPath('/', 'GET')).toBeUndefined();
    });

    it('returns undefined for bare /api/v1', () => {
      expect(parseKubernetesPath('/api/v1', 'GET')).toBeUndefined();
    });

    it('returns undefined for bare /apis/apps', () => {
      expect(parseKubernetesPath('/apis/apps', 'GET')).toBeUndefined();
    });
  });
});
