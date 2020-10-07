/*
 * Copyright 2020 Spotify AB
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

import { GroupEntity } from '@backstage/catalog-model';

export function buildOrgHierarchy(groups: GroupEntity[]) {
  const groupsByName = new Map(groups.map(g => [g.metadata.name, g]));

  //
  // Make sure that g.parent.children contain g
  //

  for (const group of groups) {
    const selfName = group.metadata.name;
    const parentName = group.spec.parent;
    if (parentName) {
      const parent = groupsByName.get(parentName);
      if (parent && !parent.spec.children.includes(selfName)) {
        parent.spec.children.push(selfName);
      }
    }
  }

  //
  // Make sure that g.descendants is complete
  //

  function visitDescendants(current: GroupEntity): string[] {
    if (current.spec.descendants.length) {
      return current.spec.descendants;
    }

    const accumulator = new Set<string>();
    for (const childName of current.spec.children) {
      accumulator.add(childName);
      const child = groupsByName.get(childName);
      if (child) {
        for (const d of visitDescendants(child)) {
          accumulator.add(d);
        }
      }
    }

    const descendants = Array.from(accumulator);
    current.spec.descendants = descendants;
    return descendants;
  }

  for (const group of groups) {
    visitDescendants(group);
  }

  //
  // Make sure that g.ancestors is complete
  //

  function visitAncestors(current: GroupEntity): string[] {
    if (current.spec.ancestors.length) {
      return current.spec.ancestors;
    }

    let ancestors: string[];
    const parentName = current.spec.parent;
    if (!parentName) {
      ancestors = [];
    } else {
      const parent = groupsByName.get(parentName);
      if (parent) {
        ancestors = [parentName, ...visitAncestors(parent)];
      } else {
        ancestors = [parentName];
      }
    }

    current.spec.ancestors = ancestors;
    return ancestors;
  }

  for (const group of groups) {
    visitAncestors(group);
  }
}
