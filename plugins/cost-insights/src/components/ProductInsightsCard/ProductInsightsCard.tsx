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
import { Box } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { costInsightsApiRef } from '../../api';
import PeriodSelect from '../PeriodSelect';
import ResourceGrowthBarChart from '../ResourceGrowthBarChart';
import ResourceGrowthBarChartLegend from '../ResourceGrowthBarChartLegend';
import { useFilters, useLoading, useScroll } from '../../hooks';
import { useProductInsightsCardStyles as useStyles } from '../../utils/styles';
import { mapFiltersToProps, mapLoadingToProps } from './selector';
import { Duration, Maybe, Product, ProductCost } from '../../types';
import { pluralOf } from '../../utils/grammar';

type ProductInsightsCardProps = {
  product: Product;
};

const ProductInsightsCard = ({ product }: ProductInsightsCardProps) => {
  const client = useApi(costInsightsApiRef);
  const classes = useStyles();
  const { ScrollAnchor } = useScroll(product.kind);
  const [resource, setResource] = useState<Maybe<ProductCost>>(null);
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

  const amount = resource?.entities?.length || 0;
  const hasCostsWithinTimeframe = resource?.change && amount;

  const subheader = amount
    ? `${amount} ${pluralOf(amount, 'entity', 'entities')}, sorted by cost`
    : `There are no ${product.name} costs within this timeframe for your team's projects.`;

  const costStart = resource?.aggregation[0] || 0;
  const costEnd = resource?.aggregation[1] || 0;

  useEffect(() => {
    async function load() {
      if (loadingProduct) {
        try {
          const p: ProductCost = await client.getProductInsights(
            product.kind,
            group!,
            productFilter!.duration,
            project,
          );
          setResource(p);
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
    setResource,
    loadingProduct,
    dispatchLoadingProduct,
    productFilter,
    group,
    product.kind,
    project,
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

  if (!resource) {
    return null;
  }

  return (
    <InfoCard title={product.name} subheader={subheader} {...infoCardProps}>
      <ScrollAnchor behavior="smooth" top={-12} />
      {hasCostsWithinTimeframe && (
        <>
          <Box display="flex" flexDirection="column">
            <Box pb={2}>
              <ResourceGrowthBarChartLegend
                duration={productFilter.duration}
                change={resource.change!}
                costStart={costStart}
                costEnd={costEnd}
              />
            </Box>
            <ResourceGrowthBarChart
              duration={productFilter.duration}
              resources={resource.entities || []}
            />
          </Box>
        </>
      )}
    </InfoCard>
  );
};

export default ProductInsightsCard;
