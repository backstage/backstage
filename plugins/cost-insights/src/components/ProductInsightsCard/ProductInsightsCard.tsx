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

import React, { useCallback, useEffect, useState } from 'react';
import { InfoCard, useApi } from '@backstage/core';
import Alert from '@material-ui/lab/Alert';
import { Typography } from '@material-ui/core';
import { costInsightsApiRef } from '../../api';
import { ProductInsightsChart } from './ProductInsightsChart';
import { PeriodSelect } from '../PeriodSelect';
import {
  useFilters,
  useLastCompleteBillingDate,
  useLoading,
  useScroll,
} from '../../hooks';
import { useProductInsightsCardStyles as useStyles } from '../../utils/styles';
import { mapFiltersToProps, mapLoadingToProps } from './selector';
import { Duration, Maybe, Product, Entity } from '../../types';
import { pluralOf } from '../../utils/grammar';

type ProductInsightsCardProps = {
  product: Product;
};

export const ProductInsightsCard = ({ product }: ProductInsightsCardProps) => {
  const client = useApi(costInsightsApiRef);
  const classes = useStyles();
  const { ScrollAnchor } = useScroll(product.kind);
  const lastCompleteBillingDate = useLastCompleteBillingDate();
  const [entity, setEntity] = useState<Maybe<Entity>>(null);
  const [error, setError] = useState<Maybe<Error>>(null);

  const { group, product: productFilter, setProduct, project } = useFilters(
    mapFiltersToProps(product.kind),
  );
  const { loadingProduct, dispatchLoading } = useLoading(
    mapLoadingToProps(product.kind),
  );

  // @see CostInsightsPage
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dispatchLoadingProduct = useCallback(dispatchLoading, [product.kind]);

  const amount = entity?.entities?.length || 0;
  const hasCostsWithinTimeframe = !!(entity?.change && amount);

  const subheader = hasCostsWithinTimeframe
    ? `${amount} ${pluralOf(amount, 'entity', 'entities')}, sorted by cost`
    : null;

  useEffect(() => {
    async function load() {
      if (loadingProduct) {
        try {
          const e: Entity = await client.getProductInsights({
            product: product.kind,
            group: group!,
            duration: productFilter!.duration,
            lastCompleteBillingDate,
            project,
          });
          setEntity(e);
        } catch (e) {
          setError(e);
        } finally {
          dispatchLoadingProduct(false);
        }
      }
    }
    load();
  }, [
    client,
    product,
    setEntity,
    loadingProduct,
    dispatchLoadingProduct,
    productFilter,
    group,
    product.kind,
    project,
    lastCompleteBillingDate,
  ]);

  const onPeriodSelect = (duration: Duration) => {
    dispatchLoadingProduct(true);
    setProduct(duration);
  };

  const infoCardProps = {
    headerProps: {
      classes: classes,
      action: (
        <PeriodSelect
          duration={productFilter.duration}
          onSelect={onPeriodSelect}
        />
      ),
    },
  };

  if (error) {
    return (
      <InfoCard title={product.name} {...infoCardProps}>
        <ScrollAnchor behavior="smooth" top={-12} />
        <Alert severity="error">{`Error: Could not fetch product insights for ${product.name}`}</Alert>
      </InfoCard>
    );
  }

  if (!entity) {
    return null;
  }

  return (
    <InfoCard title={product.name} subheader={subheader} {...infoCardProps}>
      <ScrollAnchor behavior="smooth" top={-12} />
      {hasCostsWithinTimeframe ? (
        <ProductInsightsChart
          billingDate={lastCompleteBillingDate}
          duration={productFilter.duration}
          entity={entity}
        />
      ) : (
        <Typography>
          There are no {product.name} costs within this timeframe for your
          team's projects.
        </Typography>
      )}
    </InfoCard>
  );
};
