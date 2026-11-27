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

import { KubernetesProxyRequest } from '@backstage/plugin-kubernetes-node';
import {
  isCluster,
  isNamespace,
  isResourceType,
  isAction,
  isVerb,
} from './rules';

const baseRequest: KubernetesProxyRequest = {
  cluster: 'production',
  verb: 'get',
  action: 'read',
  resourceType: 'pods',
  namespace: 'default',
  subresource: undefined,
  apiGroup: '',
};

describe('permission rules', () => {
  describe('isCluster', () => {
    it('allows matching cluster', () => {
      expect(isCluster.apply(baseRequest, { clusters: ['production'] })).toBe(
        true,
      );
    });

    it('allows case-insensitive match', () => {
      expect(isCluster.apply(baseRequest, { clusters: ['Production'] })).toBe(
        true,
      );
    });

    it('denies non-matching cluster', () => {
      expect(isCluster.apply(baseRequest, { clusters: ['staging'] })).toBe(
        false,
      );
    });

    it('allows when any cluster in list matches', () => {
      expect(
        isCluster.apply(baseRequest, {
          clusters: ['staging', 'production', 'dev'],
        }),
      ).toBe(true);
    });
  });

  describe('isNamespace', () => {
    it('allows matching namespace', () => {
      expect(isNamespace.apply(baseRequest, { namespaces: ['default'] })).toBe(
        true,
      );
    });

    it('allows case-insensitive match', () => {
      expect(isNamespace.apply(baseRequest, { namespaces: ['Default'] })).toBe(
        true,
      );
    });

    it('denies non-matching namespace', () => {
      expect(
        isNamespace.apply(baseRequest, { namespaces: ['kube-system'] }),
      ).toBe(false);
    });

    it('denies cluster-scoped requests (no namespace)', () => {
      const clusterScoped = { ...baseRequest, namespace: undefined };
      expect(
        isNamespace.apply(clusterScoped, { namespaces: ['default'] }),
      ).toBe(false);
    });
  });

  describe('isResourceType', () => {
    it('allows matching resource type', () => {
      expect(
        isResourceType.apply(baseRequest, { resourceTypes: ['pods'] }),
      ).toBe(true);
    });

    it('allows case-insensitive match', () => {
      expect(
        isResourceType.apply(baseRequest, { resourceTypes: ['Pods'] }),
      ).toBe(true);
    });

    it('denies non-matching resource type', () => {
      expect(
        isResourceType.apply(baseRequest, { resourceTypes: ['secrets'] }),
      ).toBe(false);
    });

    it('denies when resourceType is undefined', () => {
      const noResource = { ...baseRequest, resourceType: undefined };
      expect(
        isResourceType.apply(noResource, { resourceTypes: ['pods'] }),
      ).toBe(false);
    });

    it('allows when any resource type matches', () => {
      expect(
        isResourceType.apply(baseRequest, {
          resourceTypes: ['secrets', 'pods', 'deployments'],
        }),
      ).toBe(true);
    });
  });

  describe('isAction', () => {
    it('allows matching action', () => {
      expect(isAction.apply(baseRequest, { actions: ['read'] })).toBe(true);
    });

    it('denies non-matching action', () => {
      expect(isAction.apply(baseRequest, { actions: ['write'] })).toBe(false);
    });

    it('allows when any action matches', () => {
      expect(isAction.apply(baseRequest, { actions: ['write', 'read'] })).toBe(
        true,
      );
    });

    it('matches exec action for pod exec', () => {
      const execRequest = { ...baseRequest, action: 'exec' as const };
      expect(isAction.apply(execRequest, { actions: ['exec'] })).toBe(true);
    });

    it('matches delete action', () => {
      const deleteRequest = { ...baseRequest, action: 'delete' as const };
      expect(isAction.apply(deleteRequest, { actions: ['delete'] })).toBe(true);
    });
  });

  describe('isVerb', () => {
    it('allows matching verb', () => {
      expect(isVerb.apply(baseRequest, { verbs: ['get'] })).toBe(true);
    });

    it('allows case-insensitive match', () => {
      expect(isVerb.apply(baseRequest, { verbs: ['GET'] })).toBe(true);
    });

    it('denies non-matching verb', () => {
      expect(isVerb.apply(baseRequest, { verbs: ['create'] })).toBe(false);
    });

    it('allows when any verb matches', () => {
      expect(
        isVerb.apply(baseRequest, { verbs: ['list', 'get', 'watch'] }),
      ).toBe(true);
    });

    it('matches deletecollection verb', () => {
      const req = { ...baseRequest, verb: 'deletecollection' };
      expect(isVerb.apply(req, { verbs: ['deletecollection'] })).toBe(true);
    });
  });
});
