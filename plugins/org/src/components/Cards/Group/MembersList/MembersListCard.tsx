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
  DEFAULT_NAMESPACE,
  GroupEntity,
  UserEntity,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import {
  catalogApiRef,
  entityRouteParams,
  useEntity,
} from '@backstage/plugin-catalog-react';
import {
  Box,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import React from 'react';
import { generatePath } from 'react-router-dom';
import useAsync from 'react-use/lib/useAsync';

import {
  Avatar,
  InfoCard,
  Progress,
  ResponseErrorPanel,
  Link,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: theme.shadows[2],
      borderRadius: '4px',
      overflow: 'visible',
      position: 'relative',
      margin: theme.spacing(4, 1, 1),
      flex: '1',
      minWidth: '0px',
    },
  }),
);

const MemberComponent = (props: { member: UserEntity }) => {
  const classes = useStyles();
  const {
    metadata: { name: metaName, description },
    spec: { profile },
  } = props.member;
  const displayName = profile?.displayName ?? metaName;

  return (
    <Grid item container xs={12} sm={6} md={4} xl={2}>
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
                to={generatePath(
                  `/catalog/:namespace/user/${metaName}`,
                  entityRouteParams(props.member),
                )}
              >
                {displayName}
              </Link>
            </Typography>
            {profile?.email && (
              <Link to={`mailto:${profile.email}`}>{profile.email}</Link>
            )}
            {description && (
              <Typography variant="subtitle2">{description}</Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};

/** @public */
export const MembersListCard = (props: {
  memberDisplayTitle?: string;
  pageSize?: number;
}) => {
  const { memberDisplayTitle = 'Members', pageSize = 50 } = props;

  const { entity: groupEntity } = useEntity<GroupEntity>();
  const {
    metadata: { name: groupName, namespace: grpNamespace },
    spec: { profile },
  } = groupEntity;
  const catalogApi = useApi(catalogApiRef);

  const displayName = profile?.displayName ?? groupName;

  const groupNamespace = grpNamespace || DEFAULT_NAMESPACE;

  const [page, setPage] = React.useState(1);
  const pageChange = (_: React.ChangeEvent<unknown>, pageIndex: number) => {
    setPage(pageIndex);
  };

  const {
    loading,
    error,
    value: members,
  } = useAsync(async () => {
    const membersList = await catalogApi.getEntities({
      filter: {
        kind: 'User',
        'relations.memberof': [
          stringifyEntityRef({
            kind: 'group',
            namespace: groupNamespace.toLocaleLowerCase('en-US'),
            name: groupName.toLocaleLowerCase('en-US'),
          }),
        ],
      },
    });

    return membersList.items as UserEntity[];
  }, [catalogApi, groupEntity]);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  const nbPages = Math.ceil((members?.length || 0) / pageSize);
  const paginationLabel = nbPages < 2 ? '' : `, page ${page} of ${nbPages}`;

  const pagination = (
    <Pagination
      count={nbPages}
      page={page}
      onChange={pageChange}
      showFirstButton
      showLastButton
    />
  );

  return (
    <Grid item>
      <InfoCard
        title={`${memberDisplayTitle} (${
          members?.length || 0
        }${paginationLabel})`}
        subheader={`of ${displayName}`}
        {...(nbPages <= 1 ? {} : { actions: pagination })}
      >
        <Grid container spacing={3}>
          {members && members.length > 0 ? (
            members
              .slice(pageSize * (page - 1), pageSize * page)
              .map(member => (
                <MemberComponent member={member} key={member.metadata.uid} />
              ))
          ) : (
            <Box p={2}>
              <Typography>
                This group has no {memberDisplayTitle.toLocaleLowerCase()}.
              </Typography>
            </Box>
          )}
        </Grid>
      </InfoCard>
    </Grid>
  );
};
