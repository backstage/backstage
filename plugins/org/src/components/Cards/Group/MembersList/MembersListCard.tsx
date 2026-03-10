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
  useEntity,
  EntityInfoCard,
  useEntityRefLink,
} from '@backstage/plugin-catalog-react';
import { makeStyles } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';
import useAsync from 'react-use/esm/useAsync';

import { Progress, ResponseErrorPanel } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import {
  getAllDesendantMembersForGroupEntity,
  removeDuplicateEntitiesFrom,
} from '../../../../helpers/helpers';
import { EntityRelationAggregation } from '../../types';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { orgTranslationRef } from '../../../../translation';
import {
  Avatar,
  Box,
  Card,
  Flex,
  Link,
  SearchField,
  Switch,
  TablePagination,
  Text,
} from '@backstage/ui';

const useMemberStyles = makeStyles({
  card: {
    display: 'flex',
    gap: 'var(--bui-space-3)',
    padding: 'var(--bui-space-3)',
    alignItems: 'flex-start',
    flexDirection: 'row',
    height: 140,
    overflow: 'hidden',
  },
  avatar: {
    flexShrink: 0,
  },
  cardTextContainer: {
    overflow: 'hidden',
  },
  singlelineEllipsis: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  multilineEllipsis: {
    display: '-webkit-box',
    '-webkit-line-clamp': '3',
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
  },
});

const MemberComponent = (props: { member: UserEntity }) => {
  const { t } = useTranslationRef(orgTranslationRef);
  const classes = useMemberStyles();
  const {
    metadata: { name: metaName, description },
    spec: { profile },
  } = props.member;
  const displayName = profile?.displayName ?? metaName;
  const entityLink = useEntityRefLink();

  return (
    <Card
      className={classes.card}
      href={entityLink(props.member)}
      label={t('membersListCard.cardLabel', { memberName: displayName })}
    >
      <Avatar
        className={classes.avatar}
        name={displayName}
        src={profile?.picture ?? ''}
        purpose="decoration"
        size="x-large"
      />
      <Flex className={classes.cardTextContainer} direction="column" gap="1">
        <Text variant="body-large" as="h4">
          {displayName}
        </Text>
        {profile?.email && (
          <Link
            className={classes.singlelineEllipsis}
            href={`mailto:${profile.email}`}
          >
            {profile.email}
          </Link>
        )}
        {description && (
          <Text className={classes.multilineEllipsis}>{description}</Text>
        )}
      </Flex>
    </Card>
  );
};

/** @public */
export type MembersListCardClassKey = 'memberList';

const useListStyles = makeStyles(
  () => ({
    memberList: {
      display: 'grid',
      gap: 'var(--bui-space-3)',
      gridTemplateColumns: `repeat(auto-fit, minmax(275px, 1fr))`,
      gridAutoRows: '1fr',
      margin: 0,
      padding: 0,
      paddingTop: 'var(--bui-space-3)',
      listStyle: 'none',
    },
    memberListItem: {
      display: 'contents',
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
  const { t } = useTranslationRef(orgTranslationRef);
  const {
    memberDisplayTitle,
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
  const cardTitle =
    memberDisplayTitle ??
    t('membersListCard.title', { groupName: displayName });

  const groupNamespace = grpNamespace || DEFAULT_NAMESPACE;

  const [offset, setOffset] = useState(0);

  const [showAggregateMembers, setShowAggregateMembers] = useState(
    relationAggregation === 'aggregated',
  );

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setOffset(0);
  }, [searchTerm, showAggregateMembers]);

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

  const filteredMembers = members.filter(member => {
    const fields = [
      member.metadata.name,
      member.metadata.title,
      member.spec?.profile?.displayName,
      member.spec?.profile?.email,
    ];
    return fields.some(val =>
      val
        ?.toLocaleLowerCase('en-US')
        .includes(searchTerm.toLocaleLowerCase('en-US')),
    );
  });

  const membersToRender = searchTerm ? filteredMembers : members;
  const totalCount = membersToRender.length;
  const hasNextPage = offset + pageSize < totalCount;
  const hasPreviousPage = offset > 0;

  const pagination =
    totalCount > pageSize ? (
      <TablePagination
        showPageSizeOptions={false}
        pageSizeOptions={[pageSize]}
        pageSize={pageSize}
        offset={offset}
        totalCount={totalCount}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        onNextPage={() => setOffset(prev => prev + pageSize)}
        onPreviousPage={() => setOffset(prev => Math.max(0, prev - pageSize))}
      />
    ) : undefined;

  let memberList: JSX.Element;
  if (membersToRender.length > 0) {
    memberList = (
      <ul className={classes.memberList}>
        {membersToRender.slice(offset, offset + pageSize).map(member => (
          <li
            className={classes.memberListItem}
            key={stringifyEntityRef(member)}
          >
            <MemberComponent member={member} />
          </li>
        ))}
      </ul>
    );
  } else {
    memberList = (
      <Box p="2">
        <Text as="p">
          {searchTerm
            ? t('membersListCard.noSearchResult', { searchTerm })
            : t('membersListCard.noMembersDescription')}
        </Text>
      </Box>
    );
  }

  return (
    <EntityInfoCard
      title={`${cardTitle} (${filteredMembers.length} of ${members.length})`}
      headerActions={
        showAggregateMembersToggle && (
          <Switch
            isSelected={showAggregateMembers}
            onChange={setShowAggregateMembers}
            label={t('membersListCard.aggregateMembersToggle.label')}
          />
        )
      }
      footerActions={pagination}
    >
      {showAggregateMembers && loadingDescendantMembers ? (
        <Progress />
      ) : (
        <>
          <SearchField
            aria-label="Search members"
            placeholder="Search members..."
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm('')}
          />
          {memberList}
        </>
      )}
    </EntityInfoCard>
  );
};
