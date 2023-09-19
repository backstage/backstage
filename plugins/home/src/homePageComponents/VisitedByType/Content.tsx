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
import { VisitedByType } from './VisitedByType';
import { Visit, pageVisitsApiRef } from '../../api/PageVisitsApi';
import { ContextValueOnly, useContext } from './Context';
import { useApi } from '@backstage/core-plugin-api';
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

  // Fetches data from pageVisitsApi in case visits and loading are not provided
  const pageVisitsApi = useApi(pageVisitsApiRef);
  const { loading: reqLoading } = useAsync(async () => {
    if (!visits && !loading && kind === 'recent') {
      return await pageVisitsApi
        .list({
          limit: numVisitsTotal ?? 8,
          orderBy: [{ field: 'timestamp', direction: 'desc' }],
        })
        .then(setVisits);
    }
    if (!visits && !loading && kind === 'top') {
      return await pageVisitsApi
        .list({
          limit: numVisitsTotal ?? 8,
          orderBy: [{ field: 'hits', direction: 'desc' }],
        })
        .then(setVisits);
    }
    return undefined;
  }, [pageVisitsApi, visits, loading, setVisits]);
  useEffect(() => {
    if (!loading) {
      setLoading(reqLoading);
    }
  }, [loading, setLoading, reqLoading]);

  return <VisitedByType />;
};
