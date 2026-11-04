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

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { coreApis, useApiHolder } from '@backstage/frontend-plugin-api';
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
  const documentTitleApi = useApiHolder().get(coreApis.documentTitle);
  const [records, setRecords] = useState<TitleRecord[]>([]);

  const register = useCallback((entry: TitleRecord): Registration => {
    const record = { ...entry };
    // The sort is stable, so segments at the same depth keep their mount order
    setRecords(prev => [...prev, record].sort((a, b) => a.depth - b.depth));
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
  }, []);

  useEffect(() => {
    documentTitleApi?.setTitle({ segments: records.map(r => r.title) });
  }, [documentTitleApi, records]);

  const value = useMemo(
    () => createVersionedValueMap({ 1: { register } }),
    [register],
  );

  return (
    <PageTitleContext.Provider value={value}>
      {props.children}
    </PageTitleContext.Provider>
  );
}
