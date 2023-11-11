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

import React from 'react';
import { VisitList } from '../../components/VisitList';
import { useContext } from './Context';

export const VisitedByType = () => {
  const { collapsed, numVisitsOpen, numVisitsTotal, visits, loading, kind } =
    useContext();

  return (
    <VisitList
      visits={visits}
      title={kind === 'top' ? 'Top Visited' : 'Recently Visited'}
      detailType={kind === 'top' ? 'hits' : 'time-ago'}
      collapsed={collapsed}
      numVisitsOpen={numVisitsOpen}
      numVisitsTotal={numVisitsTotal}
      loading={loading}
    />
  );
};
