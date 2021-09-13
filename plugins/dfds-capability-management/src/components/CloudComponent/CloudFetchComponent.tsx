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
import React, { FC, useState, useEffect } from 'react';
import { Table, TableColumn, Progress } from '@backstage/core';
import { Alert, Autocomplete } from '@material-ui/lab';
import { TextField, Box, Tooltip } from '@material-ui/core';
import { useAsync } from 'react-use';
import { StatusColor } from '../styles';
import { css, cx } from '@emotion/css';

type DenseTableProps = {
  dataSource: any[];
};

export const DenseTable: FC<DenseTableProps> = props => {
  const columns: TableColumn[] = [
    { title: 'Name', field: 'name' },
    { title: 'Kind', field: 'kind' },
    { title: 'API Version', field: 'apiVersion' },
    { title: 'Status', field: 'status' },
    { title: 'Properties', field: 'properties' },
  ];

  const sizes = css`
    width: 1.5rem;
    height: 1.5rem;
  `;

  const cloudData = props.dataSource.map(entry => {
    const status = (e: any) => {
      if (e.status.value === 'Green') {
        return (
          <a href={e.status.reasonUri} target="_blank">
            <Tooltip title={e.status.reasonPhrase}>
              <StatusColor
                className={cx(sizes)}
                style={{ backgroundColor: 'rgb(20, 177, 171)' }} // green
              />
            </Tooltip>
          </a>
        );
      } else if (e.status.value === 'Yellow') {
        return (
          <a href={e.status.reasonUri} target="_blank">
            <Tooltip title={e.status.reasonPhrase}>
              <StatusColor
                className={cx(sizes)}
                style={{ backgroundColor: 'rgb(249, 213, 110)' }} // yellow
              />
            </Tooltip>
          </a>
        );
      }
      return (
        <a href={e.status.reasonUri} target="_blank">
          <Tooltip title={e.status.reasonPhrase}>
            <StatusColor
              className={cx(sizes)}
              style={{ backgroundColor: 'rgb(232, 80, 91)' }} // red
            />
          </Tooltip>
        </a>
      );
    };
    return {
      name: `${entry.name}`,
      kind: `${entry.kind}`,
      apiVersion: `${entry.apiVersion}`,
      status: status(entry),
      properties: entry.properties.map((e: any) => `${e.key} - ${e.value} / `),
    };
  });

  return (
    <Table
      title="Cloud"
      options={{ search: false, paging: true, pageSize: 10 }}
      columns={columns}
      data={cloudData}
    />
  );
};

const CloudFetchComponent: FC<{}> = () => {
  const { value, loading, error } = useAsync(async (): Promise<any> => {
    const response = await fetch(
      'https://private-aa6799-zaradardfds.apiary-mock.com/servicebroker/1234',
    );
    const data = await response.json();
    return data.data;
  }, []);
  const [options, setOptions] = useState([value]);

  useEffect(() => {
    setOptions(value);
  }, [value]);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <React.Fragment>
      <Box width="auto" mb="2rem">
        <Autocomplete
          options={options}
          getOptionLabel={option => option.name}
          renderInput={params => (
            <TextField {...params} label="Search ..." variant="outlined" />
          )}
        />
      </Box>
      <DenseTable dataSource={value || []} />
    </React.Fragment>
  );
};

export default CloudFetchComponent;
