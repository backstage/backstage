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
import React, { FC } from 'react';
import {
  PieChart,
  Pie,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
} from 'recharts';
import { InfoCard } from '@backstage/core';
import { Typography } from '@material-ui/core';
import styled from '@emotion/styled';
import { css, cx } from '@emotion/css';

type PerformanceFetchComponentProps = {
  cpuData?: any[];
  memoryData?: any[];
  diskIoData?: any[];
  networkIoData?: any[];
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  grid-gap: 2rem;
  height: 100%;

  @media screen and (max-width: 1280px) {
    grid-template-columns: 1fr;
    justify-items: center;
    align-items: center;
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const titleStyle = css`
  text-align: center;
`;

const marginAuto = css`
  margin: auto;
`;

const PerformanceFetchComponent: FC<PerformanceFetchComponentProps> = ({
  cpuData,
  networkIoData,
  memoryData,
  diskIoData,
}) => {
  const totalNameSpace = '(total/namespace)';
  return (
    <InfoCard title="Performance">
      <Wrapper>
        <Container>
          <Typography className={cx(titleStyle)} variant="body1">
            CPU {totalNameSpace}
          </Typography>
          <ResponsiveContainer
            width="90%"
            height={300}
            className={cx(marginAuto)}
          >
            <LineChart
              data={cpuData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="toolTip" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="something"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="somethingElse" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </Container>
        <Container>
          <Typography className={cx(titleStyle)} variant="body1">
            Memory {totalNameSpace}
          </Typography>
          <ResponsiveContainer
            width="90%"
            height={300}
            className={cx(marginAuto)}
          >
            <PieChart>
              <Pie
                data={memoryData}
                nameKey="toolTip"
                dataKey="value"
                outerRadius={100}
                fill="#8884d8"
                label
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Container>
        <Container>
          <Typography className={cx(titleStyle)} variant="body1">
            Disk IO {totalNameSpace}
          </Typography>
          <ResponsiveContainer
            width="90%"
            height={300}
            className={cx(marginAuto)}
          >
            <BarChart width={400} height={300} data={diskIoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="toolTip" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="something" fill="#8884d8" />
              <Bar dataKey="somethingElse" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Container>
        <Container>
          <Typography className={cx(titleStyle)} variant="body1">
            Network IO {totalNameSpace}
          </Typography>
          <ResponsiveContainer
            width="90%"
            height={300}
            className={cx(marginAuto)}
          >
            <LineChart width={400} height={300} data={networkIoData}>
              <XAxis dataKey="toolTip" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="something"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="somethingElse" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </Container>
      </Wrapper>
    </InfoCard>
  );
};

export default PerformanceFetchComponent;
