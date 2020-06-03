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

import React, { useEffect, useState, FC } from 'react';
import { Progress, useApi, errorApiRef, ErrorApi } from '@backstage/core';
import Radar from '../components/Radar';
import { TechRadarComponentProps, TechRadarLoaderResponse } from '../api';
import getSampleData from '../sampleData';

const useTechRadarLoader = (props: TechRadarComponentProps) => {
  const errorApi = useApi<ErrorApi>(errorApiRef);
  const [state, setState] = useState<{
    loading: boolean;
    error?: Error;
    data?: TechRadarLoaderResponse;
  }>({
    loading: true,
    error: undefined,
    data: undefined,
  });

  const { getData } = props;

  useEffect(() => {
    if (!getData) {
      return;
    }

    getData()
      .then((payload: TechRadarLoaderResponse) => {
        setState({ loading: false, error: undefined, data: payload });
      })
      .catch((err: Error) => {
        errorApi.post(err);
        setState({
          loading: false,
          error: err,
          data: undefined,
        });
      });
  }, [getData, errorApi]);

  return state;
};

const RadarComponent: FC<TechRadarComponentProps> = props => {
  const { loading, error, data } = useTechRadarLoader(props);

  return (
    <>
      {loading && <Progress />}
      {!loading && !error && (
        <Radar
          {...props}
          rings={data!.rings}
          quadrants={data!.quadrants}
          entries={data!.entries}
        />
      )}
    </>
  );
};

RadarComponent.defaultProps = {
  getData: getSampleData,
};

export default RadarComponent;
