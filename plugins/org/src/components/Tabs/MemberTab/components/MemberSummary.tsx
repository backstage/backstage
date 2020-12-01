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
import React from 'react';
import { Box, Grid, Link, Tooltip, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { InfoCard } from '@backstage/core';
import { entityRouteParams } from '@backstage/plugin-catalog';
import { Entity, UserEntity } from '@backstage/catalog-model';
import EmailIcon from '@material-ui/icons/Email';
import GroupIcon from '@material-ui/icons/Group';
import { Link as RouterLink, generatePath } from 'react-router-dom';
import { Avatar } from '../../../Avatar';

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

export const MemberSummary = ({ entity: member }: { entity: Entity }) => {
  const {
    spec: { profile, memberOf: groupNames },
  } = member as UserEntity;

  if (!member)
    return (
      <Alert severity="error">Member: {profile?.displayName} not found</Alert>
    );

  return (
    <InfoCard title={profile?.displayName}>
      <Grid container spacing={3}>
        <Grid item md={2} xl={1}>
          <Box
            display="flex"
            alignItems="flex-start"
            justifyContent="center"
            height="100%"
          >
            <Avatar
              displayName={profile?.displayName}
              picture={profile?.picture}
            />
          </Box>
        </Grid>
        <Grid item md={10} xl={11}>
          <Typography variant="subtitle1">
            <Box display="flex" alignItems="center">
              <Tooltip title="Email">
                <EmailIcon fontSize="inherit" />
              </Tooltip>
              <Box ml={1} display="inline">
                {profile?.email}
              </Box>
            </Box>
          </Typography>
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
                    entity={member}
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
