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
  Divider,
} from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import EmailIcon from '@material-ui/icons/Email';
import GroupIcon from '@material-ui/icons/Group';
import LinkIcon from '@material-ui/icons/Link';
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

const staticProfileKeys = ['displayName', 'email', 'picture'];

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
    metadata: { name, description, annotations, links },
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

  const profileKeys =
    profile !== undefined
      ? Object.keys(profile).filter(key => !staticProfileKeys.includes(key))
      : [];

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
                <ListItemText
                  primary={<Link to={emailHref}>{profile.email}</Link>}
                  secondary="Email"
                />
              </ListItem>
            )}
            <ListItem>
              <ListItemIcon>
                <Tooltip title="Parent Group">
                  <AccountTreeIcon />
                </Tooltip>
              </ListItemIcon>
              <ListItemText
                primary={
                  parentRelations.length ? (
                    <EntityRefLinks
                      entityRefs={parentRelations}
                      defaultKind="Group"
                    />
                  ) : (
                    'N/A'
                  )
                }
                secondary="Parent Group"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Tooltip title="Child Groups">
                  <GroupIcon />
                </Tooltip>
              </ListItemIcon>
              <ListItemText
                primary={
                  childRelations.length ? (
                    <EntityRefLinks
                      entityRefs={childRelations}
                      defaultKind="Group"
                    />
                  ) : (
                    'N/A'
                  )
                }
                secondary="Child Groups"
              />
            </ListItem>
            {links !== undefined && <Divider />}
            {links !== undefined &&
              links.map(link => {
                return (
                  <ListItem button component="a" key={link.url} href={link.url}>
                    {link.icon ? (
                      <ListItemIcon>
                        <Tooltip title={link.icon}>
                          <Icon>{link.icon}</Icon>
                        </Tooltip>
                      </ListItemIcon>
                    ) : (
                      <ListItemIcon>
                        <LinkIcon />
                      </ListItemIcon>
                    )}
                    <ListItemText>{link.title}</ListItemText>
                  </ListItem>
                );
              })}
            {profile !== undefined && profileKeys.length > 0 && <Divider />}
            {profile !== undefined &&
              profileKeys.length > 0 &&
              profileKeys.map(key => {
                const value = profile[key];

                return (
                  <ListItem key={key}>
                    <ListItemText style={{ width: '25%', flexGrow: 0 }}>
                      {key}
                    </ListItemText>

                    <ListItemText>{value}</ListItemText>
                  </ListItem>
                );
              })}
          </List>
        </Grid>
      </Grid>
    </InfoCard>
  );
};
