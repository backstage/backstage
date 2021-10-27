import React from 'react';
/* import { Link as RouterLink } from 'react-router-dom';
import { useAsync } from 'react-use'; */
import { Table, TableColumn } from '@backstage/core-components';

/* import { getEntitySourceLocation } from '@backstage/catalog-model';
import { Link, Tab } from '@material-ui/core';
import ExternalLinkIcon from '@material-ui/icons/Launch'; */

export const DashboardTable = () => {
    const columns: TableColumn[] = [
        {
            title: 'ProductInfo',
            field: 'prodInfo',
        },
        {
            title: 'CICD',
            field: 'cicd',
        },
        {
            title: 'Security',
            field: 'security',
        },
        {
            title: 'Other',
            field: 'other',
        }
    ];
    const testData = [
        {
            prodInfo: "ProdInfoTEST",
            cicd: null,
            security: null,
            other: null,
        },
        {
            prodInfo: 'test again',
            cicd:"cicdTest"
        },
        {
            security: "securitytest"
        },
        {
            other: 'othertest'
        }

    ];
    
    return(
        <Table
        title="Dev Ops Dashboard"
        columns={columns}
        data={testData}
       />
    )
}