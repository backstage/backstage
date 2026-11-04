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

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useApiHolder } from '@backstage/frontend-plugin-api';
import { documentTitleApiRef } from '@backstage/frontend-plugin-api/alpha';
import {
  createVersionedContext,
  createVersionedValueMap,
} from '@backstage/version-bridge';

interface Registration {
  update(title: string): void;
  unregister(): void;
}

interface TitleRecord {
  title: string;
  depth: number;
}

type ContextMap = {
  1: { register(entry: TitleRecord): Registration };
};

const PageTitleContext =
  createVersionedContext<ContextMap>('page-title-context');

/**
 * Collects the page title segments registered with `PageTitle` and
 * `usePageTitle` from `@backstage/frontend-plugin-api`, and forwards them to
 * the `DocumentTitleApi` whenever they change.
 *
 * @internal
 */
export function PageTitleRegistryProvider(props: { children: ReactNode }) {
  const documentTitleApi = useApiHolder().get(documentTitleApiRef);
  const [records, setRecords] = useState<TitleRecord[]>([]);

  // The registry never changes, so the context value is created only once
  const value = useMemo(
    () =>
      createVersionedValueMap({
        1: {
          register(entry: TitleRecord): Registration {
            const record = { ...entry };
            // The sort is stable, so segments at the same depth keep their mount order
            setRecords(prev =>
              [...prev, record].sort((a, b) => a.depth - b.depth),
            );
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
    const segments = records.map(r => r.title);
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

  return (
    <PageTitleContext.Provider value={value}>
      {props.children}
    </PageTitleContext.Provider>
  );
}
