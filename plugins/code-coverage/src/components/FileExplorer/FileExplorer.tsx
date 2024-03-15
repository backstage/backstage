/*
 * Copyright 2020 The Backstage Authors
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

import { humanizeEntityRef, useEntity } from '@backstage/plugin-catalog-react';
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import FolderIcon from '@material-ui/icons/Folder';
import FileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import Alert from '@material-ui/lab/Alert';
import React, { Fragment, useEffect, useState } from 'react';
import useAsync from 'react-use/esm/useAsync';
import { codeCoverageApiRef } from '../../api';
import { FileEntry } from '../../types';
import { FileContent } from './FileContent';
import {
  Progress,
  ResponseErrorPanel,
  Table,
  TableColumn,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(2),
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  link: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
  },
}));

type FileStructureObject = Record<string, any>;

type CoverageTableRow = {
  filename?: string;
  files: CoverageTableRow[];
  coverage: number;
  missing: number;
  tracked: number;
  path: string;
  tableData?: { id: number };
};

export const groupByPath = (files: CoverageTableRow[]) => {
  const acc: FileStructureObject = {};
  files.forEach(file => {
    const filename = file.filename;
    if (!file.filename) return;
    const pathArray = filename?.split('/').filter(el => el !== '');
    if (pathArray) {
      if (!acc.hasOwnProperty(pathArray[0])) {
        acc[pathArray[0]] = [];
      }
      acc[pathArray[0]].push(file);
    }
  });
  return acc;
};

const removeVisitedPathGroup = (
  files: CoverageTableRow[],
  pathGroup: string,
) => {
  return files.map(file => {
    return {
      ...file,
      filename: file.filename
        ? file.filename.substring(
            file.filename?.indexOf(pathGroup) + pathGroup.length + 1,
          )
        : file.filename,
    };
  });
};

export const buildFileStructure = (row: CoverageTableRow) => {
  const dataGroupedByPath: FileStructureObject = groupByPath(row.files);
  row.files = Object.keys(dataGroupedByPath).map(pathGroup => {
    return buildFileStructure({
      path: pathGroup,
      files: dataGroupedByPath.hasOwnProperty('files')
        ? removeVisitedPathGroup(dataGroupedByPath.files, pathGroup)
        : removeVisitedPathGroup(dataGroupedByPath[pathGroup], pathGroup),
      coverage:
        dataGroupedByPath[pathGroup].reduce(
          (acc: number, cur: CoverageTableRow) => acc + cur.coverage,
          0,
        ) / dataGroupedByPath[pathGroup].length,
      missing: dataGroupedByPath[pathGroup].reduce(
        (acc: number, cur: CoverageTableRow) => acc + cur.missing,
        0,
      ),
      tracked: dataGroupedByPath[pathGroup].reduce(
        (acc: number, cur: CoverageTableRow) => acc + cur.tracked,
        0,
      ),
    });
  });
  return row;
};

const formatInitialData = (value: any) => {
  return buildFileStructure({
    path: '',
    coverage: value.aggregate.line.percentage,
    missing: value.aggregate.line.missed,
    tracked: value.aggregate.line.available,
    files: value.files.map((fc: FileEntry) => {
      return {
        path: '',
        filename: fc.filename,
        coverage: Math.floor(
          (Object.values(fc.lineHits).filter((hits: number) => hits > 0)
            .length /
            Object.values(fc.lineHits).length) *
            100,
        ),
        missing: Object.values(fc.lineHits).filter(hits => !hits).length,
        tracked: Object.values(fc.lineHits).length,
      };
    }),
  });
};

export const getObjectsAtPath = (
  curData: CoverageTableRow | undefined,
  path: string[],
): CoverageTableRow[] | undefined => {
  let data = curData?.files;
  for (const fragment of path) {
    data = data?.find(d => d.path === fragment)?.files;
  }
  return data;
};

export const FileExplorer = () => {
  const styles = useStyles();
  const { entity } = useEntity();
  const [curData, setCurData] = useState<CoverageTableRow | undefined>();
  const [tableData, setTableData] = useState<CoverageTableRow[] | undefined>();
  const [curPath, setCurPath] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [curFile, setCurFile] = useState('');
  const codeCoverageApi = useApi(codeCoverageApiRef);
  const { loading, error, value } = useAsync(
    async () =>
      await codeCoverageApi.getCoverageForEntity({
        kind: entity.kind,
        namespace: entity.metadata.namespace || 'default',
        name: entity.metadata.name,
      }),
  );

  useEffect(() => {
    if (!value) return;
    const data = formatInitialData(value);
    setCurData(data);
    if (data.files) setTableData(data.files);
  }, [value]);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }
  if (!value) {
    return (
      <Alert severity="warning">
        No code coverage found for {humanizeEntityRef(entity)}
      </Alert>
    );
  }

  const moveDownIntoPath = (path: string) => {
    const nextPathData = tableData!.find(
      (d: CoverageTableRow) => d.path === path,
    );
    if (nextPathData && nextPathData.files) {
      setTableData(nextPathData.files);
    }
  };

  const moveUpIntoPath = (idx: number) => {
    const path = curPath.split('/').slice(0, idx + 1);
    setCurFile('');
    setCurPath(path.join('/'));
    setTableData(getObjectsAtPath(curData, path.slice(1)));
  };

  const columns: TableColumn<CoverageTableRow>[] = [
    {
      title: 'Path',
      type: 'string',
      field: 'path',
      render: (row: CoverageTableRow) => (
        <Box
          display="flex"
          alignItems="center"
          role="button"
          tabIndex={row.tableData!.id}
          className={styles.link}
          onClick={() => {
            if (row.files?.length) {
              setCurPath(`${curPath}/${row.path}`);
              moveDownIntoPath(row.path);
            } else {
              setCurFile(`${curPath.slice(1)}/${row.path}`);
              setModalOpen(true);
            }
          }}
        >
          {row.files?.length > 0 && (
            <FolderIcon fontSize="small" className={styles.icon} />
          )}
          {row.files?.length === 0 && (
            <FileOutlinedIcon fontSize="small" className={styles.icon} />
          )}
          {row.path}
        </Box>
      ),
    },
    {
      title: 'Coverage',
      type: 'numeric',
      field: 'coverage',
      render: (row: CoverageTableRow) => `${row.coverage.toFixed(2)}%`,
    },
    {
      title: 'Missing lines',
      type: 'numeric',
      field: 'missing',
    },
    {
      title: 'Tracked lines',
      type: 'numeric',
      field: 'tracked',
    },
  ];

  const pathArray = curPath.split('/');
  const lastPathElementIndex = pathArray.length - 1;
  const fileCoverage = value.files.find((f: FileEntry) =>
    f.filename.endsWith(curFile),
  );

  if (!fileCoverage) {
    return null;
  }

  return (
    <Box className={styles.container}>
      <Table
        emptyContent={<>No files found</>}
        data={tableData || []}
        columns={columns}
        title={
          <>
            <Box>Explore Files</Box>
            <Box
              mt={1}
              style={{
                fontSize: '0.875rem',
                fontWeight: 'normal',
                display: 'flex',
              }}
            >
              {pathArray.map((pathElement, idx) => (
                <Fragment key={pathElement || 'root'}>
                  <div
                    role="button"
                    tabIndex={idx}
                    className={
                      idx !== lastPathElementIndex ? styles.link : undefined
                    }
                    onKeyDown={() => moveUpIntoPath(idx)}
                    onClick={() => moveUpIntoPath(idx)}
                  >
                    {pathElement || 'root'}
                  </div>
                  {idx !== lastPathElementIndex && <div>{'\u00A0/\u00A0'}</div>}
                </Fragment>
              ))}
            </Box>
          </>
        }
      />
      <Modal
        open={modalOpen}
        onClick={event => event.stopPropagation()}
        onClose={() => setModalOpen(false)}
        style={{ overflow: 'scroll' }}
      >
        <FileContent filename={curFile} coverage={fileCoverage} />
      </Modal>
    </Box>
  );
};
