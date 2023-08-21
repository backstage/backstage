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
import { RecentlyVisited } from './RecentlyVisited';
import { Visit, visitsApiRef } from '../../api/VisitsApi';
import { useContext } from './Context';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';

export type RecentlyVisitedProps = {
  visits?: Array<Visit>;
  numVisitsOpen?: number;
  numVisitsTotal?: number;
  loading?: boolean;
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
}: RecentlyVisitedProps) => {
  const { setVisits, setNumVisitsOpen, setNumVisitsTotal, setLoading } =
    useContext();
  // Allows behavior override from properties
  useEffect(() => {
    if (visits) {
      setVisits(visits);
      setLoading(false);
    } else if (loading) {
      setLoading(loading);
    }
    if (numVisitsOpen) setNumVisitsOpen(numVisitsOpen);
    if (numVisitsTotal) setNumVisitsTotal(numVisitsTotal);
  }, [
    visits,
    numVisitsOpen,
    numVisitsTotal,
    loading,
    setVisits,
    setNumVisitsOpen,
    setNumVisitsTotal,
    setLoading,
  ]);
  // Fetches data from visitsApi in case visits and loading are not provided
  const visitsApi = useApi(visitsApiRef);
  const { loading: reqLoading } = useAsync(async () => {
    if (!visits && !loading) {
      await visitsApi
        .listUserVisits({
          limit: numVisitsTotal ?? 8,
          orderBy: { timestamp: 'desc' },
        })
        .then(setVisits);
    }
  }, [visitsApi, visits, loading, setVisits]);
  useEffect(() => {
    if (!loading) {
      setLoading(reqLoading);
    }
  }, [loading, setLoading, reqLoading]);

  return <RecentlyVisited />;
};
