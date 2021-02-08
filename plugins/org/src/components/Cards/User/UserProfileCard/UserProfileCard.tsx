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
  RELATION_MEMBER_OF,
  UserEntity,
} from '@backstage/catalog-model';
import { Avatar, InfoCard } from '@backstage/core';
import { useEntity, entityRouteParams } from '@backstage/plugin-catalog-react';
import { Box, Grid, Link, Tooltip, Typography } from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import GroupIcon from '@material-ui/icons/Group';
import PersonIcon from '@material-ui/icons/Person';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import { generatePath, Link as RouterLink } from 'react-router-dom';

const GroupLink = ({
  groupName,
  index,
  entity,
}: {
  groupName: string;
  index: number;
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

const CardTitle = ({ title }: { title?: string }) =>
  title ? (
    <Box display="flex" alignItems="center">
      <PersonIcon fontSize="inherit" />
      <Box ml={1}>{title}</Box>
    </Box>
  ) : null;

export const UserProfileCard = ({
  variant,
}: {
  /** @deprecated The entity is now grabbed from context instead */
  entity?: UserEntity;
  variant: string;
}) => {
  const user = useEntity().entity as UserEntity;
  const {
    metadata: { name: metaName },
    spec: { profile },
  } = user;
  const groupNames =
    user?.relations
      ?.filter(r => r.type === RELATION_MEMBER_OF)
      ?.map(group => group.target.name) || [];
  const displayName = profile?.displayName ?? metaName;

  if (!user) {
    return <Alert severity="error">User not found</Alert>;
  }

  return (
    <InfoCard title={<CardTitle title={displayName} />} variant={variant}>
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
          <Typography variant="subtitle1">
            <Box display="flex" alignItems="center">
              <Tooltip title="Member of">
                <GroupIcon />
              </Tooltip>
              <Box ml={1} display="inline">
                {groupNames.map((groupName, index) => (
                  <GroupLink
                    groupName={groupName}
                    index={index}
                    key={groupName}
                    entity={user}
                  />
                ))}
              </Box>
            </Box>
          </Typography>
        </Grid>
      </Grid>
    </InfoCard>
  );
};
