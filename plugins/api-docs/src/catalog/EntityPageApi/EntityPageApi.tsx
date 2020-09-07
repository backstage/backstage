/*
 * Copyright 2020 Spotify AB
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

import { ComponentEntity, Entity } from '@backstage/catalog-model';
import { Progress } from '@backstage/core';
import React, { FC } from 'react';
import { Grid } from '@material-ui/core';
import {
  ApiDefinitionCard,
  useComponentApiEntities,
  useComponentApiNames,
} from '../../components';

export const EntityPageApi: FC<{ entity: Entity }> = ({ entity }) => {
  const apiNames = useComponentApiNames(entity as ComponentEntity);

  const { apiEntities, loading } = useComponentApiEntities({
    entity: entity as ComponentEntity,
  });

  if (loading) {
    return <Progress />;
  }

  return (
    <Grid container spacing={3}>
      {apiNames.map(api => (
        <Grid item xs={12} key={api}>
          <ApiDefinitionCard title={api} apiEntity={apiEntities!.get(api)} />
        </Grid>
      ))}
    </Grid>
  );
};
