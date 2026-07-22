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
import { ErrorPanel, Progress } from '@backstage/core-components';

import { ContentCard } from './ContentCard';
import { useGoldenPathParameterSchema } from './ContentCard.utils';

export const ContentCardWrapper = () => {
  const { error, loading, manifest } = useGoldenPathParameterSchema();

  if (loading) return <Progress />;

  if (error) return <ErrorPanel error={error} />;

  if (!manifest)
    return (
      <ErrorPanel
        error={new Error('Failed to load Golden Path parameters schema!')}
      />
    );

  return <ContentCard manifest={manifest} />;
};
