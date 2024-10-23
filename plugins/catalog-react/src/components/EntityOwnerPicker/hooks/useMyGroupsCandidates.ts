/*
 * Copyright 2024 The Backstage Authors
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

import { Entity, parseEntityRef } from '@backstage/catalog-model';
import {
  errorApiRef,
  identityApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { ForwardedError } from '@backstage/errors';
import { useIsMounted } from '@react-hookz/web';
import uniq from 'lodash/uniq';
import { useEffect, useRef, useState } from 'react';
import { catalogApiRef } from '../../../api';
import { Owner } from './types';

// Loads you, your ownership refs, the groups you are a member of, and the
// members of the aforementioned groups. These are more likely to be interesting
// for you to select in an owner picker.
export function useMyGroupsCandidates(active: boolean): {
  loading: boolean;
  candidates: Owner[];
} {
  const catalogApi = useApi(catalogApiRef);
  const identityApi = useApi(identityApiRef);
  const errorApi = useApi(errorApiRef);
  const mounted = useIsMounted();
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<Owner[]>([]);
  const state = useRef<'initial' | 'loading' | 'loaded'>('initial');

  useEffect(() => {
    if (!active || state.current !== 'initial' || !mounted()) {
      return;
    }

    setLoading(true);
    state.current = 'loading';

    (async () => {
      try {
        const fields = [
          'kind',
          'metadata.name',
          'metadata.namespace',
          'metadata.title',
          'relations',
        ];
        const result: Owner[] = [];

        // First find the identity of your user, and all of the users and groups
        // that you claim ownership through
        const identity = await identityApi.getBackstageIdentity();
        const identityEntityRefs = uniq([
          identity.userEntityRef,
          ...identity.ownershipEntityRefs,
        ]);
        const userEntityRefs = identityEntityRefs.filter(ref =>
          ref.startsWith('user:'),
        );
        const groupEntityRefs = identityEntityRefs.filter(ref =>
          ref.startsWith('group:'),
        );

        // Load all users and add them
        const userEntities = await catalogApi
          .getEntitiesByRefs({ entityRefs: userEntityRefs, fields })
          .then(r => r.items);
        for (const [index, ref] of userEntityRefs.entries()) {
          result.push(
            toOwner(ref, userEntities[index], { order: 0, label: 'You' }),
          );
        }

        if (!mounted()) {
          return;
        }
        setCandidates(result);

        // Expand the group refs list with the groups that you are member of, so
        // that the picker contains both your membership groups and your
        // ownership groups. Then load them all and add them
        for (const relation of userEntities.flatMap(e => e?.relations ?? [])) {
          if (
            relation.type === 'memberOf' &&
            relation.targetRef.startsWith('group:') &&
            !groupEntityRefs.includes(relation.targetRef)
          ) {
            groupEntityRefs.push(relation.targetRef);
          }
        }
        const groupEntities = await catalogApi
          .getEntitiesByRefs({ entityRefs: groupEntityRefs, fields })
          .then(r => r.items);
        for (const [index, ref] of groupEntityRefs.entries()) {
          result.push(
            toOwner(ref, groupEntities[index], {
              order: 1,
              label: 'Your groups',
            }),
          );
        }

        if (!mounted()) {
          return;
        }
        setCandidates(result);

        // Finally find all of the members of all of those groups, and add them
        const groupMemberEntityRefs: string[] = [];
        for (const group of groupEntities) {
          for (const relation of group?.relations ?? []) {
            if (
              relation.type === 'hasMember' &&
              relation.targetRef.startsWith('user:') &&
              !identityEntityRefs.includes(relation.targetRef) &&
              !groupMemberEntityRefs.includes(relation.targetRef)
            ) {
              groupMemberEntityRefs.push(relation.targetRef);
            }
          }
        }
        const groupMemberEntities = await catalogApi
          .getEntitiesByRefs({ entityRefs: groupMemberEntityRefs, fields })
          .then(r => r.items);
        for (const [index, ref] of groupMemberEntityRefs.entries()) {
          result.push(
            toOwner(ref, groupMemberEntities[index], {
              order: 2,
              label: 'Your group members',
            }),
          );
        }

        if (!mounted()) {
          return;
        }

        setCandidates(result);
        setLoading(false);
        state.current = 'loaded';
      } catch (error) {
        if (!mounted()) {
          return;
        }

        errorApi.post(new ForwardedError('Failed to load your groups', error));
        setLoading(false);
      }
    })();
  }, [active, loading, mounted, catalogApi, identityApi, errorApi]);

  return { loading, candidates };
}

function toOwner(
  entityRef: string,
  entity?: Entity,
  group?: { order: number; label: string },
): Owner {
  if (!entity) {
    // be forgiving of bad inputs
    try {
      const parsed = parseEntityRef(entityRef, {
        defaultNamespace: 'default',
        defaultKind: 'user',
      });
      return {
        entityRef,
        label: parsed.name,
        filterString: entityRef,
        group,
      };
    } catch {
      return {
        entityRef,
        label: entityRef,
        filterString: entityRef,
        group,
      };
    }
  }

  return {
    entityRef,
    label: entity.metadata.name,
    filterString: [entity.metadata.name, entity.metadata.title]
      .filter(Boolean)
      .join(' '),
    group,
  };
}
