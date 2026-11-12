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

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AppNode,
  coreApis,
  useApiHolder,
} from '@backstage/frontend-plugin-api';
import {
  createVersionedContext,
  createVersionedValueMap,
} from '@backstage/version-bridge';

interface Registration {
  update(title: string): void;
  unregister(): void;
}

interface TitleRecord {
  node: AppNode;
  title: string;
  kind: 'default' | 'custom';
}

type ContextMap = {
  1: { register(entry: TitleRecord): Registration };
};

export const PageTitleContext =
  createVersionedContext<ContextMap>('page-title-context');

function getDepth(node: AppNode): number {
  let depth = 0;
  for (let n = node.edges.attachedTo?.node; n; n = n.edges.attachedTo?.node) {
    depth += 1;
  }
  return depth;
}

/**
 * Turns the registered titles into one segment per app node, ordered by
 * their position in the app tree. A custom title replaces the default title
 * of the same node.
 */
function toSegments(records: TitleRecord[]): string[] {
  const byNode = new Map<AppNode, { default?: string; custom?: string }>();
  for (const record of records) {
    const entry = byNode.get(record.node) ?? {};
    entry[record.kind] = record.title;
    byNode.set(record.node, entry);
  }
  // The sort is stable, so nodes at the same depth keep their mount order
  return Array.from(byNode, ([node, entry]) => ({
    depth: getDepth(node),
    title: entry.custom ?? entry.default!,
  }))
    .sort((a, b) => a.depth - b.depth)
    .map(s => s.title);
}

/**
 * Collects the page titles registered by the page blueprints, extension
 * boundaries and `usePageTitle` from `@backstage/frontend-plugin-api`, and
 * forwards them to the `DocumentTitleApi` whenever they change. Used by
 * {@link PageRegistryProvider}.
 *
 * @internal
 */
export function usePageTitleRegistry() {
  const documentTitleApi = useApiHolder().get(coreApis.documentTitle);
  const [records, setRecords] = useState<TitleRecord[]>([]);

  // The registry never changes, so the context value is created only once
  const value = useMemo(
    () =>
      createVersionedValueMap({
        1: {
          register(entry: TitleRecord): Registration {
            const record = { ...entry };
            setRecords(prev => [...prev, record]);
            return {
              update(title: string) {
                if (record.title === title) return;
                record.title = title;
                setRecords(prev => [...prev]);
              },
              unregister() {
                setRecords(prev => prev.filter(r => r !== record));
              },
            };
          },
        },
      }),
    [],
  );

  // Only forward the segments when they have actually changed, since the
  // records are also replaced when for example a segment is removed and added
  // back with the same title
  const lastSegmentsRef = useRef<string[] | undefined>(undefined);
  useEffect(() => {
    if (!documentTitleApi) {
      return;
    }
    const segments = toSegments(records);
    const last = lastSegmentsRef.current;
    if (
      last &&
      last.length === segments.length &&
      last.every((segment, index) => segment === segments[index])
    ) {
      return;
    }
    lastSegmentsRef.current = segments;
    documentTitleApi.setTitle({ segments });
  }, [documentTitleApi, records]);

  return value;
}
