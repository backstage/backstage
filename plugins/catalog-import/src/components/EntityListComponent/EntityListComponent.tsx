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

import { Entity, CompoundEntityRef } from '@backstage/catalog-model';
import { useApp } from '@backstage/core-plugin-api';
import {
  EntityRefLink,
  humanizeEntityRef,
} from '@backstage/plugin-catalog-react';
import {
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { useState } from 'react';

const useStyles = makeStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

function sortEntities(entities: Array<CompoundEntityRef | Entity>) {
  return entities.sort((a, b) =>
    humanizeEntityRef(a).localeCompare(humanizeEntityRef(b)),
  );
}

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
  locationListItemIcon: (target: string) => React.ReactElement;
  collapsed?: boolean;
  firstListItem?: React.ReactElement;
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

  const app = useApp();
  const classes = useStyles();

  const [expandedUrls, setExpandedUrls] = useState<string[]>([]);

  const handleClick = (url: string) => {
    setExpandedUrls(urls =>
      urls.includes(url) ? urls.filter(u => u !== url) : urls.concat(url),
    );
  };

  return (
    <List>
      {firstListItem}
      {locations.map(r => (
        <React.Fragment key={r.target}>
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
                const Icon = app.getSystemIcon(
                  `kind:${entity.kind.toLocaleLowerCase('en-US')}`,
                );
                return (
                  <ListItem
                    key={humanizeEntityRef(entity)}
                    className={classes.nested}
                    {...(withLinks
                      ? {
                          component: EntityRefLink,
                          entityRef: entity,
                          button: withLinks as any,
                        }
                      : {})}
                  >
                    <ListItemIcon>{Icon && <Icon />}</ListItemIcon>
                    <ListItemText primary={humanizeEntityRef(entity)} />
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
        </React.Fragment>
      ))}
    </List>
  );
};
