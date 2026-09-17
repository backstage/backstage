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

import { createCatalogModelLayer } from '../model/createCatalogModelLayer';

/*
Naming rules for relations in priority order:

1. Use at most two words. One main verb and a specifier, e.g. "ownerOf"
2. Reading out "<source-kind> <type> <target-kind>" should make sense in English.
3. Maintain symmetry between pairs, e.g. "ownedBy" and "ownerOf" rather than "owns".
*/

/**
 * An ownership relation where the owner is usually an organizational
 * entity (user or group), and the other entity can be anything. Reversed
 * direction of {@link RELATION_OWNER_OF}.
 *
 * @public
 */
export const RELATION_OWNED_BY = 'ownedBy';

/**
 * A relationship from an owner to the owned entity. Reversed direction of
 * {@link RELATION_OWNED_BY}.
 *
 * @public
 */
export const RELATION_OWNER_OF = 'ownerOf';

/**
 * A relation with an API entity, typically from a component. Reversed direction of
 * {@link RELATION_API_CONSUMED_BY}.
 *
 * @public
 */
export const RELATION_CONSUMES_API = 'consumesApi';

/**
 * A relation of an API being consumed, typically by a component. Reversed direction of
 * {@link RELATION_CONSUMES_API}.
 *
 * @public
 */
export const RELATION_API_CONSUMED_BY = 'apiConsumedBy';

/**
 * A relation from an API provider entity (typically a component) to the API. Reversed direction of
 * {@link RELATION_API_PROVIDED_BY}.
 *
 * @public
 */
export const RELATION_PROVIDES_API = 'providesApi';

/**
 * A relation from an API to its provider entity (typically a component). Reversed direction of
 * {@link RELATION_PROVIDES_API}.
 *
 * @public
 */
export const RELATION_API_PROVIDED_BY = 'apiProvidedBy';

/**
 * A relation denoting a dependency on another entity. Reversed direction of
 * {@link RELATION_DEPENDENCY_OF}.
 *
 * @public
 */
export const RELATION_DEPENDS_ON = 'dependsOn';

/**
 * A relation denoting a reverse dependency by another entity. Reversed direction of
 * {@link RELATION_DEPENDS_ON}.
 *
 * @public
 */
export const RELATION_DEPENDENCY_OF = 'dependencyOf';

/**
 * A parent/child relation to build up a tree, used for example to describe
 * the organizational structure between groups. Reversed direction of
 * {@link RELATION_CHILD_OF}.
 *
 * @public
 */
export const RELATION_PARENT_OF = 'parentOf';

/**
 * A relation from a child to a parent entity, used for example to describe
 * the organizational structure between groups. Reversed direction of
 * {@link RELATION_PARENT_OF}.
 *
 * @public
 */
export const RELATION_CHILD_OF = 'childOf';

/**
 * A membership relation, typically for users in a group. Reversed direction of
 * {@link RELATION_HAS_MEMBER}.
 *
 * @public
 */
export const RELATION_MEMBER_OF = 'memberOf';

/**
 * A relation from a group to its member, typically a user in a group. Reversed direction of
 * {@link RELATION_MEMBER_OF}.
 *
 * @public
 */
export const RELATION_HAS_MEMBER = 'hasMember';

/**
 * A part/whole relation, typically for components in a system and systems
 * in a domain. Reversed direction of {@link RELATION_HAS_PART}.
 *
 * @public
 */
export const RELATION_PART_OF = 'partOf';

/**
 * A relation from a containing entity to a contained entity. Reversed direction of
 * {@link RELATION_PART_OF}.
 *
 * @public
 */
export const RELATION_HAS_PART = 'hasPart';

/**
 * Extends the catalog model with the well-known Backstage relation pairs.
 */
export const wellKnownRelationsModel = createCatalogModelLayer({
  layerId: 'catalog.backstage.io/well-known-relations',
  builder: model => {
    model.addRelationPair({
      fromKind: [
        'API',
        'Component',
        'Domain',
        'Group',
        'Location',
        'Resource',
        'System',
        'User',
      ],
      toKind: ['Group', 'User'],
      description:
        'An ownership relation where the owner is usually an organizational entity (user or group), and the other entity can be anything.',
      forward: { type: 'ownedBy', title: 'owned by' },
      reverse: { type: 'ownerOf', title: 'owner of' },
    });

    model.addRelationPair({
      fromKind: 'Component',
      toKind: 'API',
      description:
        'A relation from a component to an API it provides for consumption by others.',
      forward: { type: 'providesApi', title: 'provides API' },
      reverse: { type: 'apiProvidedBy', title: 'API provided by' },
    });

    model.addRelationPair({
      fromKind: 'Component',
      toKind: 'API',
      description: 'A relation from a component to an API it consumes.',
      forward: { type: 'consumesApi', title: 'consumes API' },
      reverse: { type: 'apiConsumedBy', title: 'API consumed by' },
    });

    model.addRelationPair({
      fromKind: ['Component', 'Resource'],
      toKind: ['Component', 'Resource'],
      description:
        'A dependency relation expressing that an entity needs another entity to function.',
      forward: { type: 'dependsOn', title: 'depends on' },
      reverse: { type: 'dependencyOf', title: 'dependency of' },
    });

    model.addRelationPair({
      fromKind: 'Group',
      toKind: 'Group',
      description:
        'A parent/child relation to build up a tree, used for example to describe the organizational structure between groups.',
      forward: { type: 'parentOf', title: 'parent of' },
      reverse: { type: 'childOf', title: 'child of' },
    });

    model.addRelationPair({
      fromKind: 'User',
      toKind: 'Group',
      description: 'A membership relation, typically for users in a group.',
      forward: { type: 'memberOf', title: 'member of' },
      reverse: { type: 'hasMember', title: 'has member' },
    });

    model.addRelationPair({
      fromKind: ['Component', 'API', 'Resource'],
      toKind: ['Component', 'System'],
      description:
        'A part/whole relation where a component, API, or resource belongs to a system or a component is a subcomponent of another.',
      forward: { type: 'partOf', title: 'part of' },
      reverse: { type: 'hasPart', title: 'has part' },
    });

    model.addRelationPair({
      fromKind: 'System',
      toKind: 'Domain',
      description: 'A part/whole relation where a system belongs to a domain.',
      forward: { type: 'partOf', title: 'part of' },
      reverse: { type: 'hasPart', title: 'has part' },
    });

    model.addRelationPair({
      fromKind: 'Domain',
      toKind: 'Domain',
      description:
        'A part/whole relation where a domain is a subdomain of another domain.',
      forward: { type: 'partOf', title: 'part of' },
      reverse: { type: 'hasPart', title: 'has part' },
    });
  },
});
