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
import { InfoCard } from '@backstage/core';
import { default as Alert } from '@material-ui/lab/Alert';
import { PeriodSelect } from '../PeriodSelect';
import { useScroll } from '../../hooks';
import { useProductInsightsCardStyles as useStyles } from '../../utils/styles';
import { Duration, Product } from '../../types';

export type ProductInsightsErrorCardProps = {
  product: Product;
  duration: Duration;
  onSelect: (duration: Duration) => void;
};

export const ProductInsightsErrorCard = ({
  product,
  duration,
  onSelect,
}: ProductInsightsErrorCardProps) => {
  const classes = useStyles();
  const { ScrollAnchor } = useScroll(product.kind);

  const headerProps = {
    classes: classes,
    action: <PeriodSelect duration={duration} onSelect={onSelect} />,
  };

  return (
    <InfoCard title={product.name} headerProps={headerProps}>
      <ScrollAnchor behavior="smooth" top={-12} />
      <Alert severity="error">{`Error: Could not fetch product insights for ${product.name}`}</Alert>
    </InfoCard>
  );
};
