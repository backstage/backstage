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
import { useAsync } from 'react-use';

import HeaderComponent from '../../components/shared/HeaderComponent';
import {
  PerformanceFetchComponent,
  LogsFetchComponent,
} from '../../components/PerformanceComponents';
import { Container } from '../../components/styles';
import { Progress } from '@backstage/core';
import { Alert } from '@material-ui/lab';

const MonitoringPage: React.FC<{}> = () => {
  const { value, loading, error } = useAsync(async (): Promise<any> => {
    const response = await fetch(
      'https://private-aa6799-zaradardfds.apiary-mock.com/monitoring/1234',
    );
    const data = await response.json();
    return data;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  return (
    <React.Fragment>
      <HeaderComponent title="Monitoring" />
      <Container>
        <PerformanceFetchComponent
          cpuData={[]}
          memoryData={[]}
          diskIoData={[]}
          networkIoData={[]}
        />
        <LogsFetchComponent data={value.log_tail} />
      </Container>
    </React.Fragment>
  );
};

export default MonitoringPage;
