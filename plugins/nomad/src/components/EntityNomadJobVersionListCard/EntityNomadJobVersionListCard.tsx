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

import { DateTime } from 'luxon';
import {
  InfoCard,
  MissingAnnotationEmptyState,
  ResponseErrorPanel,
  Table,
  TableColumn,
} from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import React, { useEffect, useState } from 'react';
import { Version, nomadApiRef } from '../../api';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import {
  NOMAD_JOB_ID_ANNOTATION,
  NOMAD_NAMESPACE_ANNOTATION,
  isNomadJobIDAvailable,
} from '../../annotations';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { Chip } from '@material-ui/core';

type rowType = Version & { nomadAddr: string };

const columns: TableColumn<rowType>[] = [
  {
    title: 'Version',
    field: 'Version',
    render: row => row.Version,
  },
  {
    title: 'Stable',
    field: 'Stable',
    render: row => <Chip label={`${row.Stable}`} />,
  },
  {
    title: 'Submitted',
    field: 'SubmitTime',
    render: row =>
      DateTime.fromMillis(row.SubmitTime / 1000000).toLocaleString(
        DateTime.DATETIME_MED_WITH_SECONDS,
      ),
  },
];

/**
 * EntityNomadJobVersionListCard is roughly based on the Nomad UI's versions tab.
 */
export const EntityNomadJobVersionListCard = () => {
  // Wait on entity
  const { entity } = useEntity();

  // Get ref to the backend API
  const configApi = useApi(configApiRef);
  const nomadApi = useApi(nomadApiRef);
  const nomadAddr = configApi.getString('nomad.addr');

  // Store results of calling API
  const [init, setInit] = useState(true);
  const [versions, setVersions] = useState<rowType[]>([]);
  const [err, setErr] = useState<Error>();

  // Get plugin attributes
  const namespace =
    entity.metadata.annotations?.[NOMAD_NAMESPACE_ANNOTATION] ?? 'default';
  const jobID = entity.metadata.annotations?.[NOMAD_JOB_ID_ANNOTATION] ?? '';

  // Start querying for allocations every 10s
  useEffect(() => {
    // Create a query to update allocations
    const query = async () => {
      try {
        // Make call to nomad-backend
        const resp = await nomadApi.listJobVersions({ namespace, jobID });

        setVersions(
          resp.versions.map(row => ({ ...row, id: row.ID, nomadAddr })),
        );
        setErr(undefined);
      } catch (e) {
        setVersions([]);
        setErr(e);
      }
    };

    if (init) {
      setInit(false);
      query();
    }

    const interval = setTimeout(() => {
      query();
    }, 10_000);

    return () => clearTimeout(interval);
  }, [init, jobID, namespace, nomadAddr, nomadApi]);

  // Store a ref to a potential error
  if (err) {
    return <ResponseErrorPanel error={err} />;
  }

  if (!entity) return null;

  // Check that job ID is set
  if (!isNomadJobIDAvailable(entity)) {
    return (
      <InfoCard title="Job Versions">
        <MissingAnnotationEmptyState annotation={NOMAD_JOB_ID_ANNOTATION} />
      </InfoCard>
    );
  }

  return (
    <Table<rowType>
      title="Job versions"
      actions={[
        {
          icon: () => <OpenInNewIcon />,
          tooltip: 'Open in Nomad UI',
          isFreeAction: true,
          onClick: () => window.open(`${nomadAddr}/ui/jobs/${jobID}/versions`),
        },
      ]}
      options={{
        search: false,
        padding: 'dense',
        sorting: true,
        draggable: false,
        paging: false,
        debounceInterval: 500,
        filterCellStyle: { padding: '0 16px 0 20px' },
      }}
      columns={columns}
      data={versions}
    />
  );
};
