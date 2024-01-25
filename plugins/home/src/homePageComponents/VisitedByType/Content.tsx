/*
 * Copyright 2023 The Backstage Authors
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

import React, { useEffect } from 'react';
import { createFilterByQueryParamFromConfig } from '../../api/config';
import { VisitedByType } from './VisitedByType';
import { Visit, visitsApiRef } from '../../api';
import { ContextValueOnly, useContext } from './Context';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';

/** @public */
export type VisitedByTypeKind = 'recent' | 'top';

/** @public */
export type VisitedByTypeProps = {
  visits?: Array<Visit>;
  numVisitsOpen?: number;
  numVisitsTotal?: number;
  loading?: boolean;
  kind: VisitedByTypeKind;
};

/**
 * Display recently visited pages for the homepage
 * @public
 */
export const Content = ({
  visits,
  numVisitsOpen,
  numVisitsTotal,
  loading,
  kind,
}: VisitedByTypeProps) => {
  const { setContext, setVisits, setLoading } = useContext();
  // Allows behavior override from properties
  useEffect(() => {
    const context: Partial<ContextValueOnly> = {};
    context.kind = kind;
    if (visits) {
      context.visits = visits;
      context.loading = false;
    } else if (loading) {
      context.loading = loading;
    }
    if (numVisitsOpen) context.numVisitsOpen = numVisitsOpen;
    if (numVisitsTotal) context.numVisitsTotal = numVisitsTotal;
    setContext(state => ({ ...state, ...context }));
  }, [setContext, kind, visits, loading, numVisitsOpen, numVisitsTotal]);

  const config = useApi(configApiRef);
  // Fetches data from visitsApi in case visits and loading are not provided
  const visitsApi = useApi(visitsApiRef);
  const { loading: reqLoading } = useAsync(async () => {
    if (!visits && !loading && kind === 'recent') {
      const filterBy = createFilterByQueryParamFromConfig(
        config.getOptionalConfigArray('home.recentVisits.filterBy') ?? [],
      );
      return await visitsApi
        .list({
          limit: numVisitsTotal ?? 8,
          orderBy: [{ field: 'timestamp', direction: 'desc' }],
          ...(filterBy && { filterBy }),
        })
        .then(setVisits);
    }
    if (!visits && !loading && kind === 'top') {
      const filterBy = createFilterByQueryParamFromConfig(
        config.getOptionalConfigArray('home.topVisits.filterBy') ?? [],
      );
      return await visitsApi
        .list({
          limit: numVisitsTotal ?? 8,
          orderBy: [{ field: 'hits', direction: 'desc' }],
          ...(filterBy && { filterBy }),
        })
        .then(setVisits);
    }
    return undefined;
  }, [visitsApi, visits, loading, setVisits]);
  useEffect(() => {
    if (!loading) {
      setLoading(reqLoading);
    }
  }, [loading, setLoading, reqLoading]);

  return <VisitedByType />;
};
