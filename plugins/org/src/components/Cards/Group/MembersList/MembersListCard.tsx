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
import { catalogApiRef, useEntity } from '@backstage/plugin-catalog-react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import { ChangeEvent, useState } from 'react';
import useAsync from 'react-use/esm/useAsync';

import {
  Avatar,
  InfoCard,
  Progress,
  ResponseErrorPanel,
  Link,
  OverflowTooltip,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import {
  getAllDesendantMembersForGroupEntity,
  removeDuplicateEntitiesFrom,
} from '../../../../helpers/helpers';
import { EntityRefLink } from '@backstage/plugin-catalog-react';
import { EntityRelationAggregation } from '../../types';

/** @public */
export type MemberComponentClassKey = 'card' | 'avatar';

const useStyles = makeStyles(
  (theme: Theme) =>
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
      avatar: {
        position: 'absolute',
        top: '-2rem',
      },
    }),
  { name: 'PluginOrgMemberComponent' },
);

const MemberComponent = (props: { member: UserEntity }) => {
  const classes = useStyles();
  const {
    metadata: { name: metaName, description },
    spec: { profile },
  } = props.member;
  const displayName = profile?.displayName ?? metaName;

  return (
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
          classes={classes}
        />
        <Box
          pt={2}
          sx={{
            width: '100%',
          }}
          textAlign="center"
        >
          <Typography variant="h6">
            <EntityRefLink
              data-testid="user-link"
              entityRef={props.member}
              title={displayName}
            />
          </Typography>
          {profile?.email && (
            <Link to={`mailto:${profile.email}`}>
              <OverflowTooltip text={profile.email} />
            </Link>
          )}
          {description && (
            <Typography variant="subtitle2">
              <OverflowTooltip text={description} line={5} />
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

/** @public */
export type MembersListCardClassKey = 'root' | 'cardContent' | 'memberList';

const useListStyles = makeStyles(
  theme => ({
    root: {
      height: '100%',
    },
    cardContent: {
      overflow: 'auto',
    },
    memberList: {
      display: 'grid',
      gap: theme.spacing(1.5),
      gridTemplateColumns: `repeat(auto-fit, minmax(auto, ${theme.spacing(
        34,
      )}px))`,
    },
  }),
  { name: 'PluginOrgMembersListCardComponent' },
);

/** @public */
export const MembersListCard = (props: {
  memberDisplayTitle?: string;
  pageSize?: number;
  showAggregateMembersToggle?: boolean;
  relationType?: string;
  /** @deprecated Please use `relationAggregation` instead */
  relationsType?: EntityRelationAggregation;
  relationAggregation?: EntityRelationAggregation;
}) => {
  const {
    memberDisplayTitle = 'Members',
    pageSize = 50,
    showAggregateMembersToggle,
    relationType = 'memberof',
  } = props;
  const relationAggregation =
    props.relationAggregation ?? props.relationsType ?? 'direct';
  const classes = useListStyles();

  const { entity: groupEntity } = useEntity<GroupEntity>();
  const {
    metadata: { name: groupName, namespace: grpNamespace },
    spec: { profile },
  } = groupEntity;
  const catalogApi = useApi(catalogApiRef);

  const displayName = profile?.displayName ?? groupName;

  const groupNamespace = grpNamespace || DEFAULT_NAMESPACE;

  const [page, setPage] = useState(1);
  const pageChange = (_: ChangeEvent<unknown>, pageIndex: number) => {
    setPage(pageIndex);
  };

  const [showAggregateMembers, setShowAggregateMembers] = useState(
    relationAggregation === 'aggregated',
  );

  const { loading: loadingDescendantMembers, value: descendantMembers } =
    useAsync(async () => {
      if (!showAggregateMembers) {
        return [] as UserEntity[];
      }

      return await getAllDesendantMembersForGroupEntity(
        groupEntity,
        catalogApi,
        relationType,
      );
    }, [catalogApi, groupEntity, showAggregateMembers]);
  const {
    loading,
    error,
    value: directMembers,
  } = useAsync(async () => {
    const membersList = await catalogApi.getEntities({
      filter: {
        kind: 'User',
        [`relations.${relationType.toLocaleLowerCase('en-US')}`]: [
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

  const members = removeDuplicateEntitiesFrom(
    [
      ...(directMembers ?? []),
      ...(descendantMembers && showAggregateMembers ? descendantMembers : []),
    ].sort((a, b) =>
      stringifyEntityRef(a).localeCompare(stringifyEntityRef(b)),
    ),
  ) as UserEntity[];

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

  let memberList: JSX.Element;
  if (members && members.length > 0) {
    memberList = (
      <Box className={classes.memberList}>
        {members.slice(pageSize * (page - 1), pageSize * page).map(member => (
          <MemberComponent member={member} key={stringifyEntityRef(member)} />
        ))}
      </Box>
    );
  } else {
    memberList = (
      <Box p={2}>
        <Typography>
          This group has no {memberDisplayTitle.toLocaleLowerCase()}.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid item className={classes.root}>
      <InfoCard
        title={`${memberDisplayTitle} (${
          members?.length || 0
        }${paginationLabel})`}
        subheader={`of ${displayName}`}
        {...(nbPages <= 1 ? {} : { actions: pagination })}
        className={classes.root}
        cardClassName={classes.cardContent}
      >
        {showAggregateMembersToggle && (
          <>
            Direct Members
            <Switch
              color="primary"
              checked={showAggregateMembers}
              onChange={() => {
                setShowAggregateMembers(!showAggregateMembers);
              }}
              inputProps={{ 'aria-label': 'Users Type Switch' }}
            />
            Aggregated Members
          </>
        )}
        {showAggregateMembers && loadingDescendantMembers ? (
          <Progress />
        ) : (
          memberList
        )}
      </InfoCard>
    </Grid>
  );
};
