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

import {
  catalogApiRef,
  useStarredEntities,
} from '@backstage/plugin-catalog-react';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import { Progress, ResponseErrorPanel } from '@backstage/core-components';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import React from 'react';
import useAsync from 'react-use/esm/useAsync';
import { StarredEntityListItem } from '../../components/StarredEntityListItem/StarredEntityListItem';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  tabs: {
    marginBottom: theme.spacing(1),
  },
  list: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

/**
 * Props for the StarredEntities component
 *
 * @public
 */
export type StarredEntitiesProps = {
  noStarredEntitiesMessage?: React.ReactNode | undefined;
  groupByKind?: boolean;
};

/**
 * A component to display a list of starred entities for the user.
 *
 * @public
 */
export const Content = ({
  noStarredEntitiesMessage,
  groupByKind,
}: StarredEntitiesProps) => {
  const classes = useStyles();
  const catalogApi = useApi(catalogApiRef);
  const { starredEntities, toggleStarredEntity } = useStarredEntities();
  const [activeTab, setActiveTab] = React.useState(0);

  // Grab starred entities from catalog to ensure they still exist and also retrieve display titles
  const entities = useAsync(async () => {
    if (!starredEntities.size) {
      return [];
    }

    return (
      await catalogApi.getEntitiesByRefs({
        entityRefs: [...starredEntities],
        fields: [
          'kind',
          'metadata.namespace',
          'metadata.name',
          'spec.type',
          'metadata.title',
          'spec.profile.displayName',
        ],
      })
    ).items.filter((e): e is Entity => !!e);
  }, [catalogApi, starredEntities]);

  if (starredEntities.size === 0)
    return (
      <Typography variant="body1">
        {noStarredEntitiesMessage ||
          'Click the star beside an entity name to add it to this list!'}
      </Typography>
    );

  if (entities.loading) {
    return <Progress />;
  }

  const groupedEntities: { [kind: string]: Entity[] } = {};
  entities.value?.forEach(entity => {
    const kind = entity.kind;
    if (!groupedEntities[kind]) {
      groupedEntities[kind] = [];
    }
    groupedEntities[kind].push(entity);
  });

  const groupByKindEntries = Object.entries(groupedEntities);

  return entities.error ? (
    <ResponseErrorPanel error={entities.error} />
  ) : (
    <div>
      {!groupByKind && (
        <List className={classes.list}>
          {entities.value
            ?.sort((a, b) =>
              (a.metadata.title ?? a.metadata.name).localeCompare(
                b.metadata.title ?? b.metadata.name,
              ),
            )
            .map(entity => (
              <StarredEntityListItem
                key={stringifyEntityRef(entity)}
                entity={entity}
                onToggleStarredEntity={toggleStarredEntity}
                showKind
              />
            ))}
        </List>
      )}

      {groupByKind && (
        <Tabs
          className={classes.tabs}
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="entity-tabs"
        >
          {groupByKindEntries.map(([kind]) => (
            <Tab key={kind} label={kind} />
          ))}
        </Tabs>
      )}

      {groupByKind &&
        groupByKindEntries.map(([kind, entitiesByKind], index) => (
          <div key={kind} hidden={groupByKind && activeTab !== index}>
            <List className={classes.list}>
              {entitiesByKind
                ?.sort((a, b) =>
                  (a.metadata.title ?? a.metadata.name).localeCompare(
                    b.metadata.title ?? b.metadata.name,
                  ),
                )
                .map(entity => (
                  <StarredEntityListItem
                    key={stringifyEntityRef(entity)}
                    entity={entity}
                    onToggleStarredEntity={toggleStarredEntity}
                    showKind={false}
                  />
                ))}
            </List>
          </div>
        ))}
    </div>
  );
};
