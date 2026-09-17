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

import { PackageGraphNode } from '@backstage/cli-node';

/**
 * Groups packages into topological layers based on their published local
 * dependencies. Packages in the same layer have no inter-dependencies and
 * can be safely packed in parallel. Each successive layer depends only on
 * packages in earlier (already-packed) layers.
 *
 * If a dependency cycle is detected the remaining packages are returned as
 * a single final layer — this matches the previous behaviour of packing
 * everything in parallel and avoids blocking the build entirely.
 */
export function computeTopologicalLayers(
  packages: PackageGraphNode[],
): PackageGraphNode[][] {
  const remaining = new Map(packages.map(p => [p.name, p]));
  const layers: PackageGraphNode[][] = [];

  while (remaining.size > 0) {
    const layer: PackageGraphNode[] = [];

    for (const [, pkg] of remaining) {
      // A package is ready when none of its published local deps are still
      // waiting to be packed.
      const blocked = Array.from(pkg.publishedLocalDependencies.keys()).some(
        dep => remaining.has(dep),
      );
      if (!blocked) {
        layer.push(pkg);
      }
    }

    if (layer.length === 0) {
      // Circular dependency — fall back to packing the remaining packages
      // sequentially as single-package layers to avoid parallel races.
      for (const pkg of remaining.values()) {
        layers.push([pkg]);
      }
      remaining.clear();
      break;
    }

    for (const pkg of layer) {
      remaining.delete(pkg.name);
    }
    layers.push(layer);
  }

  return layers;
}
