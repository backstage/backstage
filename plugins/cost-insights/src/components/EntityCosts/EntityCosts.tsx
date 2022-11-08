/*
 * Copyright 2022 The Backstage Authors
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
import { CostOverviewCard } from '../CostOverviewCard';
import {
  BillingDateProvider,
  ConfigProvider,
  CurrencyProvider,
  FilterProvider,
  GroupsProvider,
  LoadingProvider,
  ScrollProvider,
  useFilters,
  useLastCompleteBillingDate,
  useLoading,
} from '../../hooks';
import { CostInsightsThemeProvider } from '../CostInsightsPage/CostInsightsThemeProvider';
import { Progress, WarningPanel } from '@backstage/core-components';
import { default as MaterialAlert } from '@material-ui/lab/Alert';
import { mapLoadingToProps } from '../CostInsightsPage/selector';
import { intervalsOf } from '../../utils/duration';
import { costInsightsApiRef } from '../../api';
import { useApi } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Cost, Maybe } from '@backstage/plugin-cost-insights-common';
import { stringifyEntityRef } from '@backstage/catalog-model';

export const EntityCostsCard = () => {
  const client = useApi(costInsightsApiRef);
  const { entity } = useEntity();

  const {
    loadingActions,
    loadingGroups,
    loadingBillingDate,
    loadingInitial,
    dispatchInitial,
    dispatchInsights,
    dispatchNone,
  } = useLoading(mapLoadingToProps);

  /* eslint-disable react-hooks/exhaustive-deps */
  // The dispatchLoading functions are derived from loading state using mapLoadingToProps, to
  // provide nicer props for the component. These are re-derived whenever loading state changes,
  // which causes an infinite loop as product panels load and re-trigger the useEffect below.
  // Since the functions don't change, we can memoize - but we trigger the same loop if we satisfy
  // exhaustive-deps by including the function itself in dependencies.

  const dispatchLoadingInitial = useCallback(dispatchInitial, []);
  const dispatchLoadingInsights = useCallback(dispatchInsights, []);
  const dispatchLoadingNone = useCallback(dispatchNone, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  const lastCompleteBillingDate = useLastCompleteBillingDate();
  const [dailyCost, setDailyCost] = useState<Maybe<Cost>>(null);
  const [error, setError] = useState<Maybe<Error>>(null);
  const { pageFilters } = useFilters(p => p);

  useEffect(() => {
    async function getInsights() {
      setError(null);
      try {
        dispatchLoadingInsights(true);
        const intervals = intervalsOf(
          pageFilters.duration,
          lastCompleteBillingDate,
        );

        const fetchedDailyCost = await client.getCatalogEntityDailyCost!(
          stringifyEntityRef(entity),
          intervals,
        );
        setDailyCost(fetchedDailyCost);
      } catch (e) {
        setError(e);
        dispatchLoadingNone(loadingActions);
      } finally {
        dispatchLoadingNone(loadingActions);
        dispatchLoadingInitial(false);
        dispatchLoadingInsights(false);
      }
    }

    // Wait for metadata to finish loading
    if (!loadingBillingDate) {
      getInsights();
    }
  }, [
    client,
    entity,
    pageFilters,
    loadingActions,
    loadingGroups,
    loadingBillingDate,
    dispatchLoadingInsights,
    dispatchLoadingInitial,
    dispatchLoadingNone,
    lastCompleteBillingDate,
  ]);

  if (loadingInitial) {
    return <Progress />;
  }

  if (error) {
    return <MaterialAlert severity="error">{error.message}</MaterialAlert>;
  }

  if (!dailyCost) {
    return <MaterialAlert severity="error">No daily costs</MaterialAlert>;
  }

  return <CostOverviewCard dailyCostData={dailyCost} metricData={null} />;
};

export const EntityCosts = () => {
  const client = useApi(costInsightsApiRef);

  if (!client.getCatalogEntityDailyCost) {
    return (
      <WarningPanel
        title="Could display costs for entity"
        message="The getCatalogEntityDailyCost() method is not implemented by the costInsightsApi."
      />
    );
  }

  return (
    <CostInsightsThemeProvider>
      <ConfigProvider>
        <LoadingProvider>
          <GroupsProvider>
            <BillingDateProvider>
              <FilterProvider>
                <ScrollProvider>
                  <CurrencyProvider>
                    <EntityCostsCard />
                  </CurrencyProvider>
                </ScrollProvider>
              </FilterProvider>
            </BillingDateProvider>
          </GroupsProvider>
        </LoadingProvider>
      </ConfigProvider>
    </CostInsightsThemeProvider>
  );
};
