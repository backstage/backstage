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
import { Box, Typography, Grid } from '@material-ui/core';
import ProductInsightsCard from '../ProductInsightsCard';
import { useConfig } from '../../hooks';

const ProductInsights = ({}) => {
  const { products } = useConfig();

  return (
    <>
      <Box mt={0} mb={5} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Your team's product usage
        </Typography>
      </Box>
      <Grid container direction="column">
        {products.map(product => (
          <Grid item key={product.kind} style={{ position: 'relative' }}>
            <ProductInsightsCard product={product} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default ProductInsights;
