/*
 * Copyright 2024 The Backstage Authors
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
import React, { useCallback, useState } from 'react';
import { Typography, Grid, makeStyles } from '@material-ui/core';
import SubdirectoryArrowLeftIcon from '@material-ui/icons/SubdirectoryArrowLeft';
import GetAppIcon from '@material-ui/icons/GetApp';
import {
  Content,
  EmptyState,
  Table,
  TableColumn,
  Progress,
  Select,
} from '@backstage/core-components';
import { azureStorageApiRef } from '../../api';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import { Alert } from '@material-ui/lab';

interface ColumnData {
  filename: string;
  contentType: string;
}
const useStyle = makeStyles(theme => ({
  container: {
    width: 850,
  },
  empty: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}));

export const AzureStorageContent = () => {
  const classes = useStyle();

  const [accountName, setAccountName] = useState('');
  const [containerName, setContainerName] = useState('');
  const [folderStack, setFolderStack] = useState<string[]>([]);

  const [tableData, setTableData] = useState([]);
  const [istableLoading, setTableLoading] = useState(false);
  const [containerList, setContainerList] = useState([]);

  const azureStorageApi = useApi(azureStorageApiRef);

  const handleContainerChange = useCallback(
    async (cName: string, prefix: string) => {
      setTableLoading(true);
      setFolderStack([]);
      setContainerName(cName);
      const data = await azureStorageApi.listContainerBlobs(
        accountName,
        cName,
        prefix,
      );
      setTableData(data);
      setTableLoading(false);
    },
    [azureStorageApi, accountName],
  );

  const handleAccountChange = useCallback(
    async (aName: string) => {
      setTableData([]);
      setFolderStack([]);
      setAccountName(aName);
      const data = await azureStorageApi.listContainers(aName);
      setContainerList(
        data.map((item: string) => ({ label: item, value: item })),
      );
    },
    [azureStorageApi],
  );

  const columns: TableColumn<ColumnData>[] = [
    {
      title: 'File Name',
      field: 'filename',
      render: row => (
        <Typography
          onClick={async () => {
            if (row.contentType === 'Folder') {
              handleContainerChange(
                containerName,
                folderStack
                  ? folderStack.join('').concat(row.filename)
                  : row.filename,
              );
              setFolderStack([...folderStack, row.filename]);
            }
          }}
          style={{
            cursor: 'pointer',
            color: '#1F5493',
            fontWeight: row.contentType === 'Folder' ? 'bold' : '500',
          }}
        >
          {row.filename}
        </Typography>
      ),
    },
    {
      title: 'Type',
      field: 'contentType',
    },
    {
      title: 'Size',
      field: 'contentLength',
    },
    {
      title: 'Last Modified',
      field: 'lastModified',
    },
    {
      title: 'Created On',
      field: 'createdOn',
    },
  ];

  const downloadBlob = async (blobName: string, blobType: string) => {
    azureStorageApi.downloadBlob(
      accountName,
      containerName,
      blobName,
      blobType,
      folderStack.join(),
    );
  };

  const { value, loading, error } = useAsync(async () => {
    const data: string[] = await azureStorageApi.listStorageAccounts();
    return data.map(aName => ({ label: aName, value: aName }));
  }, []);

  if (loading) {
    return <Progress />;
  } else if (!value) {
    return (
      <EmptyState
        missing="info"
        title="No information to display"
        description="There is no available!"
      />
    );
  } else if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const handleBackClicked = async (_event: any) => {
    folderStack.pop();
    const prefix = folderStack.join('');
    handleContainerChange(containerName, prefix);
    setFolderStack([...folderStack]);
  };

  return (
    <Content>
      <Grid container spacing={1}>
        <Grid item xs={2}>
          <Select
            label="Account"
            items={value}
            onChange={v => handleAccountChange(String(v))}
          />

          <Select
            label="Container"
            items={containerList}
            onChange={v => handleContainerChange(String(v), '')}
          />
        </Grid>
        <Grid item xs={10}>
          <Table<ColumnData>
            options={{ paging: true, pageSize: 10, actionsColumnIndex: -1 }}
            isLoading={istableLoading}
            data={tableData}
            columns={columns}
            emptyContent={
              <div className={classes.empty}>No data was added yet</div>
            }
            title={`/${folderStack.join('')}`}
            actions={[
              {
                icon: () => <SubdirectoryArrowLeftIcon />,
                disabled: !folderStack.length,
                tooltip: 'Back',
                isFreeAction: true,
                onClick: handleBackClicked,
              },
              rowData => {
                return {
                  icon: () => <GetAppIcon />,
                  tooltip: 'Download',
                  isFreeAction: false,
                  onClick: () => {
                    downloadBlob(rowData.filename, rowData.contentType);
                  },
                  hidden: rowData.contentType === 'Folder' ? true : false,
                };
              },
            ]}
          />
        </Grid>
      </Grid>
    </Content>
  );
};
