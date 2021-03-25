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

import React, { useEffect } from 'react';
import { Progress, useApi, errorApiRef, ErrorApi } from '@backstage/core';
import { useAsync } from 'react-use';
import Radar from '../components/Radar';
import { TechRadarComponentProps, TechRadarLoaderResponse } from '../api';
import getSampleData from '../sampleData';
import { Entry } from '../utils/types';

const useTechRadarLoader = (props: TechRadarComponentProps) => {
  const errorApi = useApi<ErrorApi>(errorApiRef);

  const { getData } = props;

  const state = useAsync(async () => {
    if (getData) {
      const response: TechRadarLoaderResponse = await getData();
      return response;
    }
    return undefined;
  }, [getData, errorApi]);

  useEffect(() => {
    const { error } = state;
    if (error) {
      errorApi.post(error);
    }
  }, [errorApi, state]);

  return state;
};

const RadarComponent = (props: TechRadarComponentProps): JSX.Element => {
  const { loading, error, value: data } = useTechRadarLoader(props);

  const mapToEntries = (
    loaderResponse: TechRadarLoaderResponse | undefined,
  ): Array<Entry> => {
    return loaderResponse!.entries.map(entry => {
      return {
        id: entry.key,
        quadrant: loaderResponse!.quadrants.find(q => q.id === entry.quadrant)!,
        title: entry.title,
        ring: loaderResponse!.rings.find(
          r => r.id === entry.timeline[0].ringId,
        )!,
        timeline: entry.timeline.map(e => {
          return {
            date: e.date,
            ring: loaderResponse!.rings.find(a => a.id === e.ringId)!,
            description: e.description,
            moved: e.moved,
          };
        }),
        moved: entry.timeline[0].moved,
        description: entry.description || entry.timeline[0].description,
        url: entry.url,
      };
    });
  };

  return (
    <>
      {loading && <Progress />}
      {!loading && !error && (
        <Radar
          {...props}
          rings={data!.rings}
          quadrants={data!.quadrants}
          entries={mapToEntries(data)}
        />
      )}
    </>
  );
};

RadarComponent.defaultProps = {
  getData: getSampleData,
};

export default RadarComponent;
