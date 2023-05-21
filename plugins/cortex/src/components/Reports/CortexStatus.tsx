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

import {
    InfoCard,
} from '@backstage/core-components';
import {
    Grid,
} from '@material-ui/core';

import React from 'react';

import { CortexApiRef } from '../../api';
import useAsync from 'react-use/lib/useAsync';
import {
    ResponseErrorPanel,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { Alert } from '@material-ui/lab';
import { StatusField, StatusFieldWithStatus } from '../StatusFields/StatusFields';
type ReportsTableProps = {
    ip: string;
};

/** @public */
export const CortexStatusCard = (props: ReportsTableProps) => {
    const cortexApi = useApi(CortexApiRef);

    const { value, loading, error } = useAsync(async () => {
        return cortexApi.getCortexEntityEndpoint(props.ip);
    }, [cortexApi]);

    if (error) {
        return <ResponseErrorPanel error={error} />;
    }

    if (loading) {
        return <Alert severity="info">Loading...</Alert>;
    }

    if (value === undefined) {
        return <Alert severity="error">NO DATA</Alert>;;
    }

    return (
        <InfoCard title="Information about Cortex status">
            <Grid container>
                <StatusField
                    label="Hostname"
                    value={value[0].endpoint_name.toUpperCase()}
                    gridSizes={{ xs: 10, sm: 4, lg: 3 }}
                />
                <StatusFieldWithStatus
                    label="Endpoint Status"
                    value={value[0].endpoint_status as string}
                    gridSizes={{ xs: 10, sm: 4, lg: 3 }}
                />
                <StatusFieldWithStatus
                    label="Operational Status"
                    value={value[0].operational_status as string}
                    gridSizes={{ xs: 10, sm: 4, lg: 3 }}
                />
                <StatusFieldWithStatus
                    label="Content Status"
                    value={(value[0].content_status as string)}
                    gridSizes={{ xs: 10, sm: 4, lg: 2 }}
                />
            </Grid>
        </InfoCard>
    );
};
