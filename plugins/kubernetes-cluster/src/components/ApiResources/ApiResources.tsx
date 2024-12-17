/*
 * Copyright 2023 The Backstage Authors
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
import { useApiResources } from './useApiResources';
import { useCallback, useEffect } from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Table, TableColumn } from '@backstage/core-components';
import { IAPIGroup } from '@kubernetes-models/apimachinery/apis/meta/v1';
import { useKubernetesClusterError } from '../KubernetesClusterErrorContext/KubernetesClusterErrorContext';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  empty: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}));

const defaultColumns: TableColumn<IAPIGroup>[] = [
  {
    title: 'Name',
    highlight: true,
    render: (apiGroup: IAPIGroup) => {
      return apiGroup.name;
    },
  },
  {
    title: 'Preferred Version',
    highlight: true,
    render: (apiGroup: IAPIGroup) => {
      return apiGroup.preferredVersion?.groupVersion;
    },
  },
];

export const ApiResources = () => {
  const classes = useStyles();
  const { entity } = useEntity();
  const { setError } = useKubernetesClusterError();
  const setErrorCallback = useCallback(setError, [setError]);
  const { value, error, loading } = useApiResources({
    clusterName: entity.metadata.name,
  });

  useEffect(() => {
    if (error) {
      setErrorCallback(error.message);
    }
  }, [error, setErrorCallback]);

  return (
    <Table
      title="API Resources"
      options={{ paging: true, search: false, emptyRowsWhenPaging: false }}
      isLoading={!value && loading}
      data={value?.groups ?? []}
      emptyContent={
        <div className={classes.empty}>
          {error !== undefined
            ? 'Error loading API Resources'
            : 'No API Resources found'}
        </div>
      }
      columns={defaultColumns}
    />
  );
};
