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

import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import { Box, CircularProgress } from '@material-ui/core';
import { useApi } from '@backstage/core';
import { costInsightsApiRef } from '../../api';
import { ProductInsightsCard } from './ProductInsightsCard';
import { Duration, Entity, Maybe, Product } from '../../types';
import { DefaultLoadingAction } from '../../utils/loading';
import {
  useFilters,
  useLoading,
  useLastCompleteBillingDate,
  MapLoadingToProps,
} from '../../hooks';

type State = {
  [kind: string]: ProductState;
};

type ProductState = {
  product: Product;
  entity: Maybe<Entity>;
  duration: Duration;
};

type LoadingProps = (isLoading: boolean) => void;

type ProductInsightsCardListProps = {
  products: Product[];
};

const DEFAULT_DURATION = Duration.P30D;

function totalAggregationSort(a: ProductState, b: ProductState): number {
  const [prevA, currA] = a.entity?.aggregation ?? [0, 0];
  const [prevB, currB] = b.entity?.aggregation ?? [0, 0];
  return prevB + currB - (prevA + currA);
}

const mapLoadingToProps: MapLoadingToProps<LoadingProps> = ({ dispatch }) => (
  isLoading: boolean,
) => dispatch({ [DefaultLoadingAction.CostInsightsProducts]: isLoading });

function reducer(prevState: State, action: State): State {
  return {
    ...prevState,
    ...action,
  };
}

export const ProductInsightsCardList = ({
  products,
}: ProductInsightsCardListProps) => {
  const onceRef = useRef(false);
  const client = useApi(costInsightsApiRef);
  const filters = useFilters(p => p.pageFilters);
  const [state, dispatch] = useReducer(reducer, {});
  const lastCompleteBillingDate = useLastCompleteBillingDate();
  const dispatchLoading = useLoading(mapLoadingToProps);

  /* eslint-disable react-hooks/exhaustive-deps */
  // See @CostInsightsPage
  const dispatchLoadingProducts = useCallback(dispatchLoading, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  const initialProductStates = onceRef.current
    ? Object.values(state).sort(totalAggregationSort)
    : Object.values(state);

  const onSelectAsyncMemo = useCallback(
    async function onSelectAsync(
      product: Product,
      duration: Duration,
    ): Promise<Entity> {
      if (filters.group) {
        return client.getProductInsights({
          group: filters.group,
          project: filters.project,
          product: product.kind,
          duration: duration,
          lastCompleteBillingDate: lastCompleteBillingDate,
        });
      }
      return Promise.reject(
        new Error(
          `Cannot fetch insights for ${product.name}: Expected to have a group but found none.`,
        ),
      );
    },
    [client, filters.group, filters.project, lastCompleteBillingDate],
  );

  useEffect(() => {
    async function getAllProductInsights(
      products: Product[],
      group: string,
      project: Maybe<string>,
      lastCompleteBillingDate: string,
    ) {
      const requests = products.map(product =>
        client.getProductInsights({
          group: group,
          project: project,
          product: product.kind,
          duration: DEFAULT_DURATION,
          lastCompleteBillingDate: lastCompleteBillingDate,
        }),
      );

      try {
        dispatchLoadingProducts(true);
        const responses = await Promise.allSettled(requests);
        const results = responses.map(response =>
          response.status === 'fulfilled' ? response.value : null,
        );
        const initialState = results.reduce((acc, entity, index) => {
          const product = products[index];
          return {
            ...acc,
            [product.kind]: {
              product: product,
              entity: entity,
              duration: DEFAULT_DURATION,
            },
          };
        }, {});
        dispatch(initialState);
      } finally {
        dispatchLoadingProducts(false);
      }
    }

    if (filters.group) {
      onceRef.current = true;
      getAllProductInsights(
        products,
        filters.group,
        filters.project,
        lastCompleteBillingDate,
      );
    }
  }, [
    client,
    products,
    filters.group,
    filters.project,
    lastCompleteBillingDate,
    dispatchLoadingProducts,
  ]);

  if (!initialProductStates.length) {
    return <CircularProgress />;
  }

  return (
    <>
      {initialProductStates.map(({ product, entity, duration }) => (
        <Box
          key={product.kind}
          mb={6}
          position="relative"
          data-testid={`product-list-item-${product.kind}`}
        >
          <ProductInsightsCard
            product={product}
            onSelectAsync={onSelectAsyncMemo}
            initialState={{ entity: entity, duration: duration }}
          />
        </Box>
      ))}
    </>
  );
};
