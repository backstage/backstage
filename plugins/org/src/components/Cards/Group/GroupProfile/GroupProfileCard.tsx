/*
 * Copyright 2020 The Backstage Authors
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
  GroupEntity,
  RELATION_CHILD_OF,
  RELATION_PARENT_OF,
  ANNOTATION_LOCATION,
  stringifyEntityRef,
  ANNOTATION_EDIT_URL,
} from '@backstage/catalog-model';
import {
  catalogApiRef,
  EntityRefLinks,
  getEntityRelations,
  useEntity,
} from '@backstage/plugin-catalog-react';
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import EmailIcon from '@material-ui/icons/Email';
import GroupIcon from '@material-ui/icons/Group';
import EditIcon from '@material-ui/icons/Edit';
import CachedIcon from '@material-ui/icons/Cached';
import Alert from '@material-ui/lab/Alert';
import React, { useCallback } from 'react';
import {
  Avatar,
  InfoCard,
  InfoCardVariants,
  Link,
} from '@backstage/core-components';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';

const CardTitle = (props: { title: string }) => (
  <Box display="flex" alignItems="center">
    <GroupIcon fontSize="inherit" />
    <Box ml={1}>{props.title}</Box>
  </Box>
);

/** @public */
export const GroupProfileCard = (props: { variant?: InfoCardVariants }) => {
  const catalogApi = useApi(catalogApiRef);
  const alertApi = useApi(alertApiRef);
  const { entity: group } = useEntity<GroupEntity>();

  const refreshEntity = useCallback(async () => {
    await catalogApi.refreshEntity(stringifyEntityRef(group));
    alertApi.post({ message: 'Refresh scheduled', severity: 'info' });
  }, [catalogApi, alertApi, group]);

  if (!group) {
    return <Alert severity="error">Group not found</Alert>;
  }

  const {
    metadata: { name, description, annotations },
    spec: { profile },
  } = group;

  const childRelations = getEntityRelations(group, RELATION_PARENT_OF, {
    kind: 'Group',
  });
  const parentRelations = getEntityRelations(group, RELATION_CHILD_OF, {
    kind: 'group',
  });

  const entityLocation = annotations?.[ANNOTATION_LOCATION];
  const allowRefresh =
    entityLocation?.startsWith('url:') || entityLocation?.startsWith('file:');

  const entityMetadataEditUrl =
    group.metadata.annotations?.[ANNOTATION_EDIT_URL];

  const displayName = profile?.displayName ?? name;
  const emailHref = profile?.email ? `mailto:${profile.email}` : '#';
  const infoCardAction = entityMetadataEditUrl ? (
    <IconButton
      aria-label="Edit"
      title="Edit Metadata"
      component={Link}
      to={entityMetadataEditUrl}
    >
      <EditIcon />
    </IconButton>
  ) : (
    <IconButton aria-label="Edit" disabled title="Edit Metadata">
      <EditIcon />
    </IconButton>
  );

  return (
    <InfoCard
      title={<CardTitle title={displayName} />}
      subheader={description}
      variant={props.variant}
      action={
        <>
          {allowRefresh && (
            <IconButton
              aria-label="Refresh"
              title="Schedule entity refresh"
              onClick={refreshEntity}
            >
              <CachedIcon />
            </IconButton>
          )}
          {infoCardAction}
        </>
      }
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={2} xl={1}>
          <Avatar displayName={displayName} picture={profile?.picture} />
        </Grid>
        <Grid item md={10} xl={11}>
          <List>
            {profile?.email && (
              <ListItem>
                <ListItemIcon>
                  <Tooltip title="Email">
                    <EmailIcon />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText>
                  <Link to={emailHref}>{profile.email}</Link>
                </ListItemText>
              </ListItem>
            )}

            {parentRelations.length ? (
              <ListItem>
                <ListItemIcon>
                  <Tooltip title="Parent Group">
                    <AccountTreeIcon />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText>
                  <EntityRefLinks
                    entityRefs={parentRelations}
                    defaultKind="Group"
                  />
                </ListItemText>
              </ListItem>
            ) : null}

            {childRelations.length ? (
              <ListItem>
                <ListItemIcon>
                  <Tooltip title="Child Groups">
                    <GroupIcon />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText>
                  <EntityRefLinks
                    entityRefs={childRelations}
                    defaultKind="Group"
                  />
                </ListItemText>
              </ListItem>
            ) : null}
          </List>
        </Grid>
      </Grid>
    </InfoCard>
  );
};
