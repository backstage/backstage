/*
 * Copyright 2021 The Backstage Authors
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
  CompoundEntityRef,
  parseEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import qs from 'qs';
import {
  Dispatch,
  DispatchWithoutAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import usePrevious from 'react-use/esm/usePrevious';
import { Direction } from '../EntityRelationsGraph';

export type CatalogGraphPageValue = {
  rootEntityNames: CompoundEntityRef[];
  setRootEntityNames: Dispatch<React.SetStateAction<CompoundEntityRef[]>>;
  maxDepth: number;
  setMaxDepth: Dispatch<React.SetStateAction<number>>;
  selectedRelations: string[] | undefined;
  setSelectedRelations: Dispatch<React.SetStateAction<string[] | undefined>>;
  selectedKinds: string[] | undefined;
  setSelectedKinds: Dispatch<React.SetStateAction<string[] | undefined>>;
  unidirectional: boolean;
  setUnidirectional: Dispatch<React.SetStateAction<boolean>>;
  mergeRelations: boolean;
  setMergeRelations: Dispatch<React.SetStateAction<boolean>>;
  direction: Direction;
  setDirection: Dispatch<React.SetStateAction<Direction>>;
  curve: 'curveStepBefore' | 'curveMonotoneX';
  setCurve: Dispatch<
    React.SetStateAction<'curveStepBefore' | 'curveMonotoneX'>
  >;
  showFilters: boolean;
  toggleShowFilters: DispatchWithoutAction;
};

export function useCatalogGraphPage({
  initialState = {},
}: {
  initialState?: {
    selectedRelations?: string[] | undefined;
    selectedKinds?: string[] | undefined;
    rootEntityRefs?: string[];
    maxDepth?: number;
    unidirectional?: boolean;
    mergeRelations?: boolean;
    direction?: Direction;
    showFilters?: boolean;
    curve?: 'curveStepBefore' | 'curveMonotoneX';
  };
}): CatalogGraphPageValue {
  const location = useLocation();
  const query = useMemo(
    () =>
      (qs.parse(location.search, { arrayLimit: 0, ignoreQueryPrefix: true }) ||
        {}) as {
        selectedRelations?: string[] | string;
        selectedKinds?: string[] | string;
        rootEntityRefs?: string[] | string;
        maxDepth?: string[] | string;
        unidirectional?: string[] | string;
        mergeRelations?: string[] | string;
        direction?: string[] | Direction;
        showFilters?: string[] | string;
        curve?: string[] | 'curveStepBefore' | 'curveMonotoneX';
      },
    [location.search],
  );

  // Initial state
  const [rootEntityNames, setRootEntityNames] = useState<CompoundEntityRef[]>(
    () =>
      (Array.isArray(query.rootEntityRefs)
        ? query.rootEntityRefs
        : initialState?.rootEntityRefs ?? []
      ).map(r => parseEntityRef(r)),
  );
  const [maxDepth, setMaxDepth] = useState<number>(() =>
    typeof query.maxDepth === 'string'
      ? parseMaxDepth(query.maxDepth)
      : initialState?.maxDepth ?? Number.POSITIVE_INFINITY,
  );
  const [selectedRelations, setSelectedRelations] = useState<
    string[] | undefined
  >(() =>
    Array.isArray(query.selectedRelations)
      ? query.selectedRelations
      : initialState?.selectedRelations,
  );
  const [selectedKinds, setSelectedKinds] = useState<string[] | undefined>(() =>
    (Array.isArray(query.selectedKinds)
      ? query.selectedKinds
      : initialState?.selectedKinds
    )?.map(k => k.toLocaleLowerCase('en-US')),
  );
  const [unidirectional, setUnidirectional] = useState<boolean>(() =>
    typeof query.unidirectional === 'string'
      ? query.unidirectional === 'true'
      : initialState?.unidirectional ?? true,
  );
  const [mergeRelations, setMergeRelations] = useState<boolean>(() =>
    typeof query.mergeRelations === 'string'
      ? query.mergeRelations === 'true'
      : initialState?.mergeRelations ?? true,
  );
  const [direction, setDirection] = useState<Direction>(() =>
    typeof query.direction === 'string'
      ? query.direction
      : initialState?.direction ?? Direction.LEFT_RIGHT,
  );
  const [curve, setCurve] = useState<'curveStepBefore' | 'curveMonotoneX'>(
    () =>
      typeof query.curve === 'string'
        ? query.curve
        : initialState?.curve ?? 'curveMonotoneX',
  );
  const [showFilters, setShowFilters] = useState<boolean>(() =>
    typeof query.showFilters === 'string'
      ? query.showFilters === 'true'
      : initialState?.showFilters ?? true,
  );
  const toggleShowFilters = useCallback(
    () => setShowFilters(s => !s),
    [setShowFilters],
  );

  // Update from query parameters
  const prevQueryParams = usePrevious(location.search);
  useEffect(() => {
    // Only respond to changes to url query params
    if (location.search === prevQueryParams) {
      return;
    }

    if (Array.isArray(query.rootEntityRefs)) {
      setRootEntityNames(query.rootEntityRefs.map(r => parseEntityRef(r)));
    }

    if (typeof query.maxDepth === 'string') {
      setMaxDepth(parseMaxDepth(query.maxDepth));
    }

    if (Array.isArray(query.selectedKinds)) {
      setSelectedKinds(query.selectedKinds);
    }

    if (Array.isArray(query.selectedRelations)) {
      setSelectedRelations(query.selectedRelations);
    }

    if (typeof query.unidirectional === 'string') {
      setUnidirectional(query.unidirectional === 'true');
    }

    if (typeof query.mergeRelations === 'string') {
      setMergeRelations(query.mergeRelations === 'true');
    }

    if (typeof query.direction === 'string') {
      setDirection(query.direction);
    }

    if (typeof query.showFilters === 'string') {
      setShowFilters(query.showFilters === 'true');
    }
  }, [
    prevQueryParams,
    location.search,
    query,
    setRootEntityNames,
    setMaxDepth,
    setSelectedKinds,
    setSelectedRelations,
    setUnidirectional,
    setMergeRelations,
    setDirection,
    setShowFilters,
  ]);

  // Update query parameters
  const previousRootEntityRefs = usePrevious(
    rootEntityNames.map(e => stringifyEntityRef(e)),
  );

  useEffect(() => {
    const rootEntityRefs = rootEntityNames.map(e => stringifyEntityRef(e));
    const newParams = qs.stringify(
      {
        rootEntityRefs,
        maxDepth: isFinite(maxDepth) ? maxDepth : '∞',
        selectedKinds,
        selectedRelations,
        unidirectional,
        mergeRelations,
        direction,
        showFilters,
      },
      { arrayFormat: 'brackets', addQueryPrefix: true },
    );
    const newUrl = `${window.location.pathname}${newParams}`;

    // We directly manipulate window history here in order to not re-render
    // infinitely (state => location => state => etc). The intention of this
    // code is just to ensure the right query/filters are loaded when a user
    // clicks the "back" button after clicking a result.
    // Only push a new history entry if we switched to another entity, but not
    // if we just changed a viewer setting.
    if (
      !previousRootEntityRefs ||
      (rootEntityRefs.length === previousRootEntityRefs.length &&
        rootEntityRefs.every((v, i) => v === previousRootEntityRefs[i]))
    ) {
      window.history.replaceState(null, document.title, newUrl);
    } else {
      window.history.pushState(null, document.title, newUrl);
    }
  }, [
    rootEntityNames,
    maxDepth,
    selectedKinds,
    selectedRelations,
    unidirectional,
    mergeRelations,
    direction,
    showFilters,
    previousRootEntityRefs,
  ]);

  return {
    rootEntityNames,
    setRootEntityNames,
    maxDepth,
    setMaxDepth,
    selectedRelations,
    setSelectedRelations,
    selectedKinds,
    setSelectedKinds,
    unidirectional,
    setUnidirectional,
    mergeRelations,
    setMergeRelations,
    direction,
    setDirection,
    curve,
    setCurve,
    showFilters,
    toggleShowFilters,
  };
}

function parseMaxDepth(value: string): number {
  return value === '∞' ? Number.POSITIVE_INFINITY : Number(value);
}
