/*
 * Copyright 2023 The Backstage Authors
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

import { parseEntityRef } from '@backstage/catalog-model';
import { ErrorPanel, SubvalueCell, Table } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { EntityRefLink } from '@backstage/plugin-catalog-react';
import { EntityRatingsData } from '@backstage/plugin-entity-feedback-common';
import React from 'react';
import useAsync from 'react-use/lib/useAsync';

import { entityFeedbackApiRef } from '../../api';

interface FeedbackRatingsTableProps {
  allEntities?: boolean;
  ownerRef?: string;
  ratingValues: string[];
  title?: string;
}

export const FeedbackRatingsTable = (props: FeedbackRatingsTableProps) => {
  const {
    allEntities,
    ownerRef,
    ratingValues,
    title = 'Entity Ratings',
  } = props;
  const feedbackApi = useApi(entityFeedbackApiRef);

  const {
    error,
    loading,
    value: ratings,
  } = useAsync(async () => {
    if (allEntities) {
      return feedbackApi.getAllRatings();
    }

    if (!ownerRef) {
      return [];
    }

    return feedbackApi.getOwnedRatings(ownerRef);
  }, [allEntities, feedbackApi, ownerRef]);

  const columns = [
    { title: 'Title', field: 'entityTitle', hidden: true, searchable: true },
    {
      title: 'Entity',
      field: 'entityRef',
      highlight: true,
      customSort: (a: EntityRatingsData, b: EntityRatingsData) => {
        const titleA = a.entityTitle ?? parseEntityRef(a.entityRef).name;
        const titleB = b.entityTitle ?? parseEntityRef(b.entityRef).name;
        return titleA.localeCompare(titleB);
      },
      render: (rating: EntityRatingsData) => {
        const compoundRef = parseEntityRef(rating.entityRef);
        return (
          <SubvalueCell
            value={
              <EntityRefLink
                entityRef={rating.entityRef}
                defaultKind={compoundRef.kind}
                title={rating.entityTitle}
              />
            }
            subvalue={compoundRef.kind}
          />
        );
      },
    },
    ...ratingValues.map(ratingVal => ({
      title: ratingVal,
      field: `ratings.${ratingVal}`,
    })),
  ];

  // Exclude entities that don't have applicable ratings
  const ratingsRows = ratings?.filter(r =>
    Object.keys(r.ratings).some(v => ratingValues.includes(v)),
  );

  if (error) {
    return (
      <ErrorPanel
        defaultExpanded
        title="Failed to load feedback ratings"
        error={error}
      />
    );
  }

  return (
    <Table<EntityRatingsData>
      columns={columns}
      data={ratingsRows ?? []}
      isLoading={loading}
      options={{
        emptyRowsWhenPaging: false,
        loadingType: 'linear',
        pageSize: 20,
        pageSizeOptions: [20, 50, 100],
        paging: true,
        showEmptyDataSourceMessage: !loading,
      }}
      title={title}
    />
  );
};
