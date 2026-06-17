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

import { useEffect, useRef, useState } from 'react';
import { useSearch } from '@backstage/plugin-search-react';
import { CompoundEntityRef } from '@backstage/catalog-model';
import { ResultHighlight } from '@backstage/plugin-search-common';

export type TechDocsDoc = {
  namespace: string;
  kind: string;
  name: string;
  path: string;
  location: string;
  title: string;
  text: string;
};

export type TechDocsSearchResult = {
  type: string;
  document: TechDocsDoc;
  highlight?: ResultHighlight;
};

/**
 * Shared hook for TechDocs search logic.
 * Encapsulates entity filter sync, results slicing,
 * and deferred loading state.
 */
export function useTechDocsSearch(entityId: CompoundEntityRef) {
  const {
    setFilters,
    setTerm,
    term,
    result: { loading, value: searchVal },
  } = useSearch();
  const [results, setResults] = useState<TechDocsSearchResult[]>([]);
  const [deferredLoading, setDeferredLoading] = useState(false);
  const loadingTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (searchVal) {
      setResults(searchVal.results.slice(0, 10) as TechDocsSearchResult[]);
    }
  }, [loading, searchVal]);

  useEffect(() => {
    clearTimeout(loadingTimer.current);
    setDeferredLoading(false);
    if (loading) {
      loadingTimer.current = setTimeout(() => setDeferredLoading(true), 200);
    }
    return () => clearTimeout(loadingTimer.current);
  }, [term, loading]);

  const { kind, name, namespace } = entityId;
  useEffect(() => {
    setFilters(prevFilters => ({
      ...prevFilters,
      kind,
      namespace,
      name,
    }));
  }, [kind, namespace, name, setFilters]);

  return {
    results,
    term,
    setTerm,
    loading,
    deferredLoading,
  };
}
