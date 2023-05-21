/*
 * Copyright 2022 The Backstage Authors
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
import { CortexApiRef, Incident, Alert } from '../../api';
import useAsync from 'react-use/lib/useAsync';
import React from 'react';
import {
    ResponseErrorPanel,
    Table,
    TableColumn,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

type ReportsTableProps = {
    ip: string;
};

const useStyles = makeStyles(theme => ({
    empty: {
        padding: theme.spacing(2),
        display: 'flex',
        justifyContent: 'center',
    },
    severity_high: {
      color: theme.palette.error.light,
    },
    severity_medium: {
      color: theme.palette.warning.light,
    },
    severity_low: {
      color: theme.palette.info.light,
    },
}));

/**
 * Component for displaying a table of Cortex Incidents.
 *
 * @public
 */
export const IncidentsReportsTable = (props: ReportsTableProps) => {
    const cortexApi = useApi(CortexApiRef);
    const classes = useStyles();

    const { value, loading, error } = useAsync(async () => {
        return cortexApi.getCortexSecurityIncidents(props.ip);
    }, [cortexApi]);

    if (error) {
        return <ResponseErrorPanel error={error} />;
    }

    const columns: TableColumn<Incident>[] = [
        {
            title: 'Date',
            field: 'creation_time',
            align: 'center',
            width: '1000px',
            render: rowData => (
                <Typography noWrap>{new Date(rowData.creation_time).toISOString().replace('T', ' ').split('.')[0]}
                </Typography>
            ),
        },
        {
            title: 'Severity',
            field: 'severity',
            align: 'center',
            width: '300px',
            render: rowData => (
                <Typography
                  noWrap
                  className={
                    (rowData.severity === 'high' && classes.severity_high) ||
                    (rowData.severity === 'medium' && classes.severity_medium) ||
                    classes.severity_low
                  }
                >
                  {rowData.severity.toLocaleUpperCase('en-US')}
                </Typography>
              ),
        },
        {
            title: 'Description',
            field: 'description',
            align: 'center',
            width: '3000px',
            render: rowData => (
                <Typography noWrap>{rowData.description}
                </Typography>
            ),
        }
    ];

    return (
        <Table
            options={{
                sorting: true,
                actionsColumnIndex: -1,
                loadingType: 'linear',
                padding: 'default',
                showEmptyDataSourceMessage: !loading,
                showTitle: false,
                toolbar: true,
                pageSize: 5,
                pageSizeOptions: [5],
            }}
            emptyContent={
                <Typography color="textSecondary" className={classes.empty}>
                    No reports
                </Typography>
            }
            title={`Cortex information`}
            columns={columns}
            data={value || []}
            isLoading={loading}
        />
    );
};



// Alerts table 
/**
 * Component for displaying a table of Cortex Alerts.
 *
 * @public
 */
export const AlertsReportsTable = (props: ReportsTableProps) => {
    const cortexApi = useApi(CortexApiRef);
    const classes = useStyles();

    const { value, loading, error } = useAsync(async () => {
        return cortexApi.getCortexAlerts(props.ip);
    }, [cortexApi]);

    if (error) {
        return <ResponseErrorPanel error={error} />;
    }

    const columns: TableColumn<Alert>[] = [
        {
            title: 'Date',
            field: 'Date',
            align: 'center',
            width: '1000px',
            render: rowData => (
                <Typography noWrap>{new Date(rowData.detection_timestamp).toISOString().replace('T', ' ').split('.')[0]}
                </Typography>
            ),
        },
        {
            title: 'Severity',
            field: 'severity',
            align: 'center',
            width: '300px',
            render: rowData => (
                <Typography
                  noWrap
                  className={
                    (rowData.severity === 'high' && classes.severity_high) ||
                    (rowData.severity === 'medium' && classes.severity_medium) ||
                    classes.severity_low
                  }
                >
                  {rowData.severity.toLocaleUpperCase('en-US')}
                </Typography>
              ),
        },
        {
            title: 'Description',
            field: 'description',
            align: 'center',
            width: '3000px',
            render: rowData => (
                <Typography noWrap>{rowData.description}
                </Typography>
            ),
        }
    ];

    return (
        <Table
            options={{
                sorting: true,
                actionsColumnIndex: -1,
                loadingType: 'linear',
                padding: 'default',
                showEmptyDataSourceMessage: !loading,
                showTitle: false,
                toolbar: true,
                pageSize: 5,
                pageSizeOptions: [5],
            }}
            emptyContent={
                <Typography color="textSecondary" className={classes.empty}>
                    No reports
                </Typography>
            }
            title={`Cortex information`}
            columns={columns}
            data={value || []}
            isLoading={loading}
        />
    );
};
