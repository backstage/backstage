import { Dispatch, SetStateAction } from 'react';

// @ts-ignore
import { EstimationResult } from '@cloud-carbon-footprint/common';
import { useFilterDataFromEstimates } from '@cloud-carbon-footprint/client/dist/utils/helpers';
import { EmissionsFilters } from '@cloud-carbon-footprint/client/dist/pages/EmissionsMetricsPage/EmissionsFilterBar/utils/EmissionsFilters';
import {
  EmissionsAndRecommendationResults,
  FilterResultResponse,
} from '@cloud-carbon-footprint/client/dist/Types';
import useFilters from '@cloud-carbon-footprint/client/dist/common/FilterBar/utils/FilterHook';
import {
  useRemoteRecommendationsService,
  useRemoteService,
} from '@cloud-carbon-footprint/client/dist/utils/hooks';
import moment from 'moment';
import { useFilterDataFromRecommendations } from '@cloud-carbon-footprint/client/dist/utils/helpers/transformData';
import { RecommendationsFilters } from '@cloud-carbon-footprint/client/dist/pages/RecommendationsPage/RecommendationsFilterBar/utils/RecommendationsFilters';
import { Filters } from '@cloud-carbon-footprint/client/dist/common/FilterBar/utils/Filters';

interface EmissionsHookResults {
  data: EstimationResult[];
  filteredData: EstimationResult[];
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  filterOptions: FilterResultResponse;
}

export const useEmissionsData = (
  baseUrl: string | undefined,
  startDate: moment.Moment,
  endDate: moment.Moment,
): EmissionsHookResults => {
  const { data } = useRemoteService(
    [],
    startDate,
    endDate,
    false,
    undefined,
    baseUrl,
  );

  const filterOptions: FilterResultResponse = useFilterDataFromEstimates(data);

  const buildFilters = (filteredResponse: FilterResultResponse) => {
    const updatedConfig = EmissionsFilters.generateConfig(filteredResponse);
    return new EmissionsFilters(updatedConfig);
  };

  const { filteredData, filters, setFilters } = useFilters(
    data,
    buildFilters,
    filterOptions,
  );

  return {
    data,
    filterOptions,
    filters,
    setFilters,
    filteredData: filteredData as EstimationResult[],
  };
};

export const useRecommendationsData = (
  baseUrl: string | undefined,
  emissionData: EstimationResult[],
) => {
  // TODO pre-filter 30 days of data

  const { data: recommendationData } = useRemoteRecommendationsService(
    undefined,
    baseUrl,
  );

  const combinedData: EmissionsAndRecommendationResults = {
    recommendations: recommendationData,
    emissions: emissionData.flatMap(
      estimationResult => estimationResult.serviceEstimates,
    ),
  };

  const isEmissionsDataLoaded = combinedData.emissions.length > 0;
  const filterOptions: FilterResultResponse =
    useFilterDataFromRecommendations(combinedData);

  const buildFilters = (filteredResponse: FilterResultResponse) => {
    const updatedConfig =
      RecommendationsFilters.generateConfig(filteredResponse);
    return new RecommendationsFilters(updatedConfig);
  };

  const { filteredData, filters, setFilters } = useFilters(
    combinedData,
    buildFilters,
    filterOptions,
    isEmissionsDataLoaded,
  );
  const {
    recommendations: filteredRecommendationData,
    emissions: filteredEmissionsData,
  } = filteredData as EmissionsAndRecommendationResults;

  return {
    filterOptions,
    filteredRecommendationData,
    filteredEmissionsData,
    filters,
    setFilters,
  };
};
