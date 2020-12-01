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
import Alert from '@material-ui/lab/Alert';
import {
  Box,
  createStyles,
  Grid,
  Link,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { InfoCard, Progress, useApi } from '@backstage/core';
import {
  UserEntity,
  RELATION_MEMBER_OF,
  Entity,
} from '@backstage/catalog-model';
import { Link as RouterLink, generatePath } from 'react-router-dom';
import { catalogApiRef, entityRouteParams } from '@backstage/plugin-catalog';
import { useAsync } from 'react-use';
import { Avatar } from '../../Avatar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: theme.shadows[2],
      borderRadius: '4px',
      overflow: 'visible',
      position: 'relative',
      margin: theme.spacing(3, 0, 0),
    },
  }),
);

const MemberComponent = ({
  member,
  entity,
}: {
  member: UserEntity;
  entity: Entity;
}) => {
  const classes = useStyles();
  const { name: metaName } = member.metadata;
  const { profile } = member.spec;
  return (
    <Grid item md={3}>
      <Box className={classes.card}>
        <Box
          display="flex"
          flexDirection="column"
          m={3}
          alignItems="center"
          justifyContent="center"
        >
          <Avatar
            displayName={profile?.displayName}
            picture={profile?.picture}
            customStyles={{
              position: 'absolute',
              top: '-25px',
            }}
          />
          <Box pt={2} textAlign="center">
            <Typography variant="h5">
              <Link
                component={RouterLink}
                to={generatePath(
                  `/catalog/:namespace/user/${metaName}`,
                  entityRouteParams(entity),
                )}
              >
                {profile?.displayName}
              </Link>
            </Typography>
            <Typography variant="caption">{profile?.email}</Typography>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};

export const MembersTab = ({ entity }: { entity: Entity }) => {
  const {
    metadata: { name: groupName },
  } = entity;
  const catalogApi = useApi(catalogApiRef);

  const { loading, error, value: members } = useAsync(async () => {
    const membersList = await catalogApi.getEntities({
      filter: {
        kind: 'User',
      },
    });
    const groupMembersList = ((membersList.items as unknown) as Array<
      UserEntity
    >).filter(member =>
      member?.relations?.some(
        r => r.type === RELATION_MEMBER_OF && r.target.name === groupName,
      ),
    );
    return groupMembersList;
  }, [catalogApi]);

  if (loading) return <Progress />;
  else if (error) return <Alert severity="error">{error.message}</Alert>;

  return (
    <Grid item>
      <InfoCard title="Members" subheader={`of ${groupName}`}>
        <Grid container spacing={3}>
          {members && members.length ? (
            members.map(member => (
              <MemberComponent
                member={member}
                key={member.metadata.uid}
                entity={entity}
              />
            ))
          ) : (
            <Box p={2}>
              <Typography>This group has no members.</Typography>
            </Box>
          )}
        </Grid>
      </InfoCard>
    </Grid>
  );
};
