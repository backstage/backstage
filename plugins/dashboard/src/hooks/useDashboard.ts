import { dashboardApiRef } from '../api/api';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';

export function useDashboard() {
    const dashboardApi = useApi(dashboardApiRef);
    const response = useAsync(() => 
        dashboardApi.getDashboardData(), []
    );

    return response;
}