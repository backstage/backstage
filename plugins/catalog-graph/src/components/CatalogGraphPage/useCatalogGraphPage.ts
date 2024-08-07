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
import { useLocation, useSearchParams } from 'react-router-dom';
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
  const [_, setSearchParams] = useSearchParams();
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

  const rootEntityNames = useMemo(
    () =>
      (Array.isArray(query.rootEntityRefs)
        ? query.rootEntityRefs
        : initialState?.rootEntityRefs ?? []
      ).map(r => parseEntityRef(r)),
    [initialState?.rootEntityRefs, query.rootEntityRefs],
  );

  const setRootEntityNames = useCallback(
    (value: React.SetStateAction<CompoundEntityRef[]>) => {
      const prev = Array.isArray(query.rootEntityRefs)
        ? query.rootEntityRefs
        : [];

      const hasChanged =
        Array.isArray(value) &&
        (value.length !== prev.length ||
          value.some((r, i) => stringifyEntityRef(r) !== prev[i]));

      if (!hasChanged) {
        return;
      }

      setSearchParams(params => {
        const rootEntityRefs = Array.isArray(value)
          ? value.map(r => stringifyEntityRef(r))
          : [];

        params.delete('rootEntityRefs[]');

        rootEntityRefs.forEach(r => {
          params.set('rootEntityRefs[]', r);
        });

        return params;
      });
    },
    [query.rootEntityRefs, setSearchParams],
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

  const [curve, setCurve] = useState<'curveStepBefore' | 'curveMonotoneX'>(() =>
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

  useEffect(() => {
    const newParams = qs.stringify(
      {
        maxDepth: isFinite(maxDepth) ? maxDepth : '∞',
        selectedKinds,
        selectedRelations,
        unidirectional,
        mergeRelations,
        direction,
        showFilters,
        curve,
      },
      { arrayFormat: 'brackets', addQueryPrefix: true },
    );

    const searchParams = new URLSearchParams(newParams);

    setSearchParams(
      params => {
        searchParams.forEach((value, key) => {
          params.set(key, value);
        });

        return params;
      },
      { replace: true },
    );
  }, [
    maxDepth,
    curve,
    selectedKinds,
    selectedRelations,
    unidirectional,
    mergeRelations,
    direction,
    showFilters,
    setSearchParams,
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
