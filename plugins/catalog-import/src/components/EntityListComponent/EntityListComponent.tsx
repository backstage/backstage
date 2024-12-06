/*
 * Copyright 2021 The Backstage Authors
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
  Entity,
  CompoundEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import {
  EntityDisplayName,
  EntityRefLink,
  entityPresentationApiRef,
} from '@backstage/plugin-catalog-react';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ReactElement, Fragment, useState } from 'react';

const useStyles = makeStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

/**
 * Props for {@link EntityListComponent}.
 *
 * @public
 */
export interface EntityListComponentProps {
  locations: Array<{
    target: string;
    entities: (Entity | CompoundEntityRef)[];
  }>;
  locationListItemIcon: (target: string) => ReactElement;
  collapsed?: boolean;
  firstListItem?: ReactElement;
  onItemClick?: (target: string) => void;
  withLinks?: boolean;
}

/**
 * Shows a result list of entities.
 *
 * @public
 */
export const EntityListComponent = (props: EntityListComponentProps) => {
  const {
    locations,
    collapsed = false,
    locationListItemIcon,
    onItemClick,
    firstListItem,
    withLinks = false,
  } = props;

  const classes = useStyles();
  const entityPresentationApi = useApi(entityPresentationApiRef);
  const [expandedUrls, setExpandedUrls] = useState<string[]>([]);

  const handleClick = (url: string) => {
    setExpandedUrls(urls =>
      urls.includes(url) ? urls.filter(u => u !== url) : urls.concat(url),
    );
  };

  function sortEntities(entities: Array<CompoundEntityRef | Entity>) {
    return entities.sort((a, b) =>
      entityPresentationApi
        .forEntity(stringifyEntityRef(a))
        .snapshot.entityRef.localeCompare(
          entityPresentationApi.forEntity(stringifyEntityRef(b)).snapshot
            .entityRef,
        ),
    );
  }

  return (
    <List>
      {firstListItem}
      {locations.map(r => (
        <Fragment key={r.target}>
          <ListItem
            dense
            button={Boolean(onItemClick) as any}
            onClick={() => onItemClick?.(r.target)}
          >
            <ListItemIcon>{locationListItemIcon(r.target)}</ListItemIcon>

            <ListItemText
              primary={r.target}
              secondary={`Entities: ${r.entities.length}`}
            />

            {collapsed && (
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleClick(r.target)}>
                  {expandedUrls.includes(r.target) ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </ListItemSecondaryAction>
            )}
          </ListItem>

          <Collapse
            in={!collapsed || expandedUrls.includes(r.target)}
            timeout="auto"
            unmountOnExit
          >
            <List component="div" disablePadding dense>
              {sortEntities(r.entities).map(entity => {
                return (
                  <ListItem
                    key={stringifyEntityRef(entity)}
                    className={classes.nested}
                    {...(withLinks
                      ? {
                          component: EntityRefLink,
                          entityRef: entity,
                          button: withLinks as any,
                        }
                      : {})}
                  >
                    <ListItemText
                      primary={<EntityDisplayName entityRef={entity} />}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
        </Fragment>
      ))}
    </List>
  );
};
