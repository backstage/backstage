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
  RELATION_MEMBER_OF,
  UserEntity,
} from '@backstage/catalog-model';
import { Avatar, InfoCard, Progress, useApi } from '@backstage/core';
import {
  useEntity,
  catalogApiRef,
  entityRouteParams,
} from '@backstage/plugin-catalog-react';
import {
  Box,
  createStyles,
  Grid,
  Link,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import { generatePath, Link as RouterLink } from 'react-router-dom';
import { useAsync } from 'react-use';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: theme.shadows[2],
      borderRadius: '4px',
      overflow: 'visible',
      position: 'relative',
      margin: theme.spacing(3, 0, 1),
      flex: '1',
      minWidth: '0px',
    },
  }),
);

const MemberComponent = ({
  member,
  groupEntity,
}: {
  member: UserEntity;
  groupEntity: Entity;
}) => {
  const classes = useStyles();
  const {
    metadata: { name: metaName },
    spec: { profile },
  } = member;
  const displayName = profile?.displayName ?? metaName;

  return (
    <Grid item container xs={12} sm={6} md={3} xl={2}>
      <Box className={classes.card}>
        <Box
          display="flex"
          flexDirection="column"
          m={3}
          alignItems="center"
          justifyContent="center"
        >
          <Avatar
            displayName={displayName}
            picture={profile?.picture}
            customStyles={{
              position: 'absolute',
              top: '-2rem',
            }}
          />
          <Box pt={2} textAlign="center">
            <Typography variant="h5">
              <Link
                component={RouterLink}
                to={generatePath(
                  `/catalog/:namespace/user/${metaName}`,
                  entityRouteParams(groupEntity),
                )}
              >
                {displayName}
              </Link>
            </Typography>
            <Typography variant="caption">{profile?.email}</Typography>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};

export const MembersListCard = (_props: {
  /** @deprecated The entity is now grabbed from context instead */
  entity?: GroupEntity;
}) => {
  const groupEntity = useEntity().entity as GroupEntity;
  const {
    metadata: { name: groupName },
    spec: { profile },
  } = groupEntity;
  const catalogApi = useApi(catalogApiRef);

  const displayName = profile?.displayName ?? groupName;

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
        r =>
          r.type === RELATION_MEMBER_OF &&
          r.target.name.toLowerCase() === groupName.toLowerCase(),
      ),
    );
    return groupMembersList;
  }, [catalogApi]);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <Grid item>
      <InfoCard
        title={`Members (${members?.length || 0})`}
        subheader={`of ${displayName}`}
      >
        <Grid container spacing={3}>
          {members && members.length ? (
            members.map(member => (
              <MemberComponent
                member={member}
                groupEntity={groupEntity}
                key={member.metadata.uid}
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
