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

import {
  Entity,
  GroupEntity,
  RELATION_CHILD_OF,
  RELATION_PARENT_OF,
} from '@backstage/catalog-model';
import { Avatar, InfoCard } from '@backstage/core';
import { entityRouteParams } from '@backstage/plugin-catalog-react';
import {
  Box,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@material-ui/core';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import EmailIcon from '@material-ui/icons/Email';
import GroupIcon from '@material-ui/icons/Group';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import { generatePath, Link as RouterLink } from 'react-router-dom';

const GroupLink = ({
  groupName,
  index = 0,
  entity,
}: {
  groupName: string;
  index?: number;
  entity: Entity;
}) => (
  <>
    {index >= 1 ? ', ' : ''}
    <Link
      component={RouterLink}
      to={generatePath(
        `/catalog/:namespace/group/${groupName}`,
        entityRouteParams(entity),
      )}
    >
      [{groupName}]
    </Link>
  </>
);

const CardTitle = ({ title }: { title: string }) => (
  <Box display="flex" alignItems="center">
    <GroupIcon fontSize="inherit" />
    <Box ml={1}>{title}</Box>
  </Box>
);

export const GroupProfileCard = ({
  entity: group,
  variant,
}: {
  entity: GroupEntity;
  variant: string;
}) => {
  const {
    metadata: { name, description },
    spec: { profile },
  } = group;
  const parent = group?.relations
    ?.filter(r => r.type === RELATION_CHILD_OF)
    ?.map(groupItem => groupItem.target.name)
    .toString();

  const childRelations = group?.relations
    ?.filter(r => r.type === RELATION_PARENT_OF)
    ?.map(groupItem => groupItem.target.name);

  const displayName = profile?.displayName ?? name;
  const descriptionHeading = description ?? name;

  if (!group) return <Alert severity="error">User not found</Alert>;

  return (
    <InfoCard
      title={<CardTitle title={descriptionHeading} />}
      variant={variant}
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
                    <EmailIcon fontSize="inherit" />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText>{profile.email}</ListItemText>
              </ListItem>
            )}
            {parent ? (
              <ListItem>
                <ListItemIcon>
                  <Tooltip title="Parent Group">
                    <AccountTreeIcon />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText>
                  <GroupLink groupName={parent} entity={group} />
                </ListItemText>
              </ListItem>
            ) : null}
            {childRelations?.length ? (
              <ListItem>
                <ListItemIcon>
                  <Tooltip title="Child Groups">
                    <GroupIcon />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText>
                  {childRelations.map((children, index) => (
                    <GroupLink
                      groupName={children}
                      entity={group}
                      index={index}
                      key={children}
                    />
                  ))}
                </ListItemText>
              </ListItem>
            ) : null}
          </List>
        </Grid>
      </Grid>
    </InfoCard>
  );
};
