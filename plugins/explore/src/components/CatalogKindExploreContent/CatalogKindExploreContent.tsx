/*
 * Copyright 2021 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { Button } from '@material-ui/core';
import React from 'react';
import useAsync from 'react-use/lib/useAsync';
import { EntityCard } from '../EntityCard';
import {
  Content,
  ContentHeader,
  EmptyState,
  ItemCardGrid,
  Progress,
  SupportButton,
  WarningPanel,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import pluralize from 'pluralize';

const Body = (props: { kind: string }) => {
  const { kind } = props;
  const kindPlural = pluralize(kind);
  const catalogApi = useApi(catalogApiRef);
  const {
    value: entities,
    loading,
    error,
  } = useAsync(async () => {
    const response = await catalogApi.getEntities({
      filter: { kind },
    });
    return response.items as Entity[];
  }, [kind]);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return (
      <WarningPanel severity="error" title={`Could not load ${kindPlural}.`}>
        {error.message}
      </WarningPanel>
    );
  }

  if (!entities?.length) {
    return (
      <EmptyState
        missing="info"
        title={`No ${kindPlural} to display`}
        description={`You haven't added any ${kindPlural} yet.`}
        action={
          <Button
            variant="contained"
            color="primary"
            href={`https://backstage.io/docs/features/software-catalog/descriptor-format#kind-${kind}`}
          >
            Read more
          </Button>
        }
      />
    );
  }

  return (
    <ItemCardGrid>
      {entities.map((entity, index) => (
        <EntityCard key={index} entity={entity} />
      ))}
    </ItemCardGrid>
  );
};

/** @public */
export const CatalogKindExploreContent = (props: {
  title?: string;
  kind: string;
}) => {
  const { kind, title } = props;
  const kindLowercase = kind.toLocaleLowerCase();
  const kindCapitalized = `${kind[0].toLocaleUpperCase()}${kind.substring(1)}`;
  return (
    <Content noPadding>
      <ContentHeader title={title || `${pluralize(kindCapitalized)}`}>
        <SupportButton>
          <>Discover the {pluralize(kindLowercase)} in your ecosystem.</>
        </SupportButton>
      </ContentHeader>
      <Body kind={kindLowercase} />
    </Content>
  );
};
