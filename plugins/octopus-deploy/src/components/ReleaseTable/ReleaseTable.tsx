import { Box, Typography } from "@material-ui/core";
import {
    OctopusEnvironment,
    OctopusReleaseProgression
} from '../../api';

import React from 'react';
import { ResponseErrorPanel, StatusAborted, StatusError, StatusOK, StatusPending, StatusRunning, StatusWarning, Table, TableColumn } from "@backstage/core-components";

type ReleaseTableProps = {
    environments?: OctopusEnvironment[];
    releases?: OctopusReleaseProgression[];
    loading: boolean;
    error?: Error
};

export const getDeploymentStatusComponent = (state: string | undefined) => {
    switch (state) {
        case "Success":
            return (
                <Typography component="span">
                    <StatusOK /> Success
                </Typography>
            );
        case "Queued":
            return (
                <Typography component="span">
                    <StatusPending /> Queued
                </Typography>
            );
        case "Executing":
            return (
                <Typography component="span">
                    <StatusRunning /> Executing
                </Typography>
            );
        case "Failed":
            return (
                <Typography component="span">
                    <StatusError /> Failed
                </Typography>
            );
        case "Cancelling":
            return (
                <Typography component="span">
                    <StatusPending /> Cancelling
                </Typography>
            );
        case "Canceled":
            return (
                <Typography component="span">
                    <StatusAborted /> Canceled
                </Typography>
            );
        case "TimedOut":
            return (
                <Typography component="span">
                    <StatusWarning /> Timed Out
                </Typography>
            );
        default:
            return (
                <Typography component="span">
                    <StatusWarning /> Unknown
                </Typography>
            );
    }
}

export const ReleaseTable = ({environments, releases, loading, error}: ReleaseTableProps) => {
    if (error) {
        return (
            <div>
                <ResponseErrorPanel error={error} />
            </div>
        );
    }

    const columns: TableColumn[] = [
        {
            title: 'Version',
            field: 'Release.Version',
            highlight: false,
            width: 'auto'
        },
        ...environments?.map(env => ({
            title: env.Name,
            width: 'auto',
            render: (row: Partial<OctopusReleaseProgression>) => {
                const deploymentsForEnvironment = row.Deployments[env.Id];
                if (deploymentsForEnvironment) {
                    return (
                        <Box display="flex" alignItems="center">
                            <Typography variant="button">
                                {getDeploymentStatusComponent(deploymentsForEnvironment[0].State)}
                            </Typography>
                        </Box>
                    )
                }
            }
            //field: `Deployments.${env.Id}[0].State` // TODO: We'll probably need to deal with multi-tenant deployments here
        })) ?? []
    ]

    return (
        <Table
            isLoading={loading}
            columns={columns}
            options={{
                search: true,
                paging: true,
                pageSize: 5,
                showEmptyDataSourceMessage: !loading
            }}
            title={
                <Box display="flex" alignItems="center">
                    Octopus Deploy - Releases ({releases ? releases.length : 0})
                </Box>
            }
            data={releases ?? []}
        />
    )
}