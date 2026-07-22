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
import { useEffect } from 'react';
import { ErrorPanel, Progress } from '@backstage/core-components';

import { ExecutionStatuses } from './ExecutionStatuses';
import { useGoldenPathTaskContext } from '../../useGoldenPathTaskContext';

export const ExecutionStatusesWrapper = () => {
  const {
    value: {
      goldenPathStatuses: { error, loading, value },
      fetchGoldenPathStatuses,
    },
  } = useGoldenPathTaskContext();

  useEffect(() => {
    fetchGoldenPathStatuses();
  }, [fetchGoldenPathStatuses]);

  if (loading) return <Progress />;

  if (error) return <ErrorPanel error={error} />;

  if (!value)
    return (
      <ErrorPanel error={new Error('Golden Path Status was failed to load!')} />
    );

  return <ExecutionStatuses />;
};
