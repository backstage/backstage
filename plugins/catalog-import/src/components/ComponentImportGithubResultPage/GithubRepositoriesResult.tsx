/*
 * Copyright 2022 The Backstage Authors
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
import LanguageIcon from '@material-ui/icons/Language';
import { Entity, getCompoundEntityRef } from '@backstage/catalog-model';
import { useApp, useRouteRef } from '@backstage/core-plugin-api';
import { entityRouteRef } from '@backstage/plugin-catalog-react';
import { Grid, Typography } from '@material-ui/core';
import { Link } from '@backstage/core-components';

type GithubRepositoryResultProps = {
  entities: Entity[];
};

export const GithubRepositoryResult = ({
  entities,
}: GithubRepositoryResultProps) => {
  const app = useApp();
  const entityRoute = useRouteRef(entityRouteRef);
  function iconResolver(key: string): JSX.Element {
    const Icon = app.getSystemIcon(key) ?? LanguageIcon;
    return <Icon style={{ verticalAlign: 'middle', marginRight: 8 }} />;
  }

  const displayedEntities = entities.filter(
    e => e.kind !== 'Location' || !e.metadata.name.startsWith('generated-'),
  );
  return (
    <Grid container>
      <Grid item xs={8}>
        <Typography>
          These software components were added to the catalog:
        </Typography>
      </Grid>
      <Grid item xs={8}>
        {displayedEntities
          .map(entity => {
            const entityRef = getCompoundEntityRef(entity);
            const target = entityRoute(entityRef);
            return {
              url: target,
              title: entityRef.name,
              icon: `kind:${entity.kind.toLocaleLowerCase('en-US')}`,
            };
          })
          .map(({ url, title, icon }, i) => (
            <Typography paragraph key={i}>
              {iconResolver(icon)}
              <Link to={url}>{title}</Link>
            </Typography>
          ))}
      </Grid>
    </Grid>
  );
};
