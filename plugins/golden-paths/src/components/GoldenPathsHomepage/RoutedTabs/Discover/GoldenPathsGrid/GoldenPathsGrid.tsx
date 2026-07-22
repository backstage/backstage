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
  ItemCardGrid,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { EntityProvider, useEntityList } from '@backstage/plugin-catalog-react';
import { Typography } from '@material-ui/core';

import { GoldenPathCard } from '../GoldenPathCard';
import { GoldenPathsPagination } from '../GoldenPathsPagination';

export const GoldenPathsGrid = () => {
  const { loading, error, entities } = useEntityList();

  if (loading) return <Progress />;

  if (error) return <ResponseErrorPanel error={error} />;

  if (!entities || entities.length === 0) {
    return (
      <Typography>No Golden Paths found that match your filter.</Typography>
    );
  }

  return (
    <>
      <ItemCardGrid>
        {entities.map((goldenPath, index) => (
          <EntityProvider
            entity={goldenPath}
            key={`golden-paths-card-${index}`}
          >
            <GoldenPathCard />
          </EntityProvider>
        ))}
      </ItemCardGrid>

      <br />

      <GoldenPathsPagination />
    </>
  );
};
