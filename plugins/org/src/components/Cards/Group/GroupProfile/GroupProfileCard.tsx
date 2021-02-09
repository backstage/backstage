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
import { useEntity, entityRouteParams } from '@backstage/plugin-catalog-react';
import { Box, Grid, Link, Tooltip, Typography } from '@material-ui/core';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import EmailIcon from '@material-ui/icons/Email';
import GroupIcon from '@material-ui/icons/Group';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import { generatePath, Link as RouterLink } from 'react-router-dom';

const GroupLink = ({
  groupName,
  index = 0,
}: {
  groupName: string;
  index?: number;
  /** @deprecated The entity is now grabbed from context instead */
  entity?: Entity;
}) => {
  const { entity } = useEntity();

  return (
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
};
const CardTitle = ({ title }: { title: string }) => (
  <Box display="flex" alignItems="center">
    <GroupIcon fontSize="inherit" />
    <Box ml={1}>{title}</Box>
  </Box>
);

export const GroupProfileCard = ({
  variant,
}: {
  /** @deprecated The entity is now grabbed from context instead */
  entity?: GroupEntity;
  variant: string;
}) => {
  const group = useEntity().entity as GroupEntity;
  const {
    metadata: { name, description },
    spec: { profile },
  } = group;
  const parent = group?.relations
    ?.filter(r => r.type === RELATION_CHILD_OF)
    ?.map(groupItem => groupItem.target.name)
    .toString();

  const childrens = group?.relations
    ?.filter(r => r.type === RELATION_PARENT_OF)
    ?.map(groupItem => groupItem.target.name);

  const displayName = profile?.displayName ?? name;

  if (!group) return <Alert severity="error">User not found</Alert>;

  return (
    <InfoCard
      title={<CardTitle title={displayName} />}
      subheader={description}
      variant={variant}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={2} xl={1}>
          <Box
            display="flex"
            alignItems="flex-start"
            justifyContent="center"
            height="100%"
            width="100%"
          >
            <Avatar displayName={displayName} picture={profile?.picture} />
          </Box>
        </Grid>
        <Grid item md={10} xl={11}>
          {profile?.email && (
            <Typography variant="subtitle1">
              <Box display="flex" alignItems="center">
                <Tooltip title="Email">
                  <EmailIcon fontSize="inherit" />
                </Tooltip>

                <Box ml={1} display="inline">
                  {profile.email}
                </Box>
              </Box>
            </Typography>
          )}
          {parent ? (
            <Typography variant="subtitle1">
              <Box display="flex" alignItems="center">
                <Tooltip title="Group Parent">
                  <AccountTreeIcon fontSize="inherit" />
                </Tooltip>
                <Box ml={1} display="inline">
                  <GroupLink groupName={parent} entity={group} />
                </Box>
              </Box>
            </Typography>
          ) : null}
          {childrens?.length ? (
            <Typography variant="subtitle1">
              <Box display="flex" alignItems="center">
                <Tooltip title="Parent of">
                  <GroupIcon fontSize="inherit" />
                </Tooltip>
                <Box ml={1} display="inline">
                  {childrens.map((children, index) => (
                    <GroupLink
                      groupName={children}
                      entity={group}
                      index={index}
                      key={children}
                    />
                  ))}
                </Box>
              </Box>
            </Typography>
          ) : null}
        </Grid>
      </Grid>
    </InfoCard>
  );
};
