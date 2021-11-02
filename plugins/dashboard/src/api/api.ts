import { Config } from '@backstage/config';
import { createApiRef } from '@backstage/core-plugin-api';

export type DashboardDataResponse = {
    links: string[];
    contactList: {
        name: string;
        email: string;
    }[];
    cicd: {
        jenkins: number;
        github: number;
    };
    tests: {
        day: number;
        week: number;
        month: number;
    };
    acoe: {
        latestRelease: Date;
        releaseFailure: number;
        mttr: number;
    };
    health: number;
    twistLock: {
        low: number;
        medium: number;
        high: number;
        critical: number;
        riskFactors: number;
    };
    fortify: string;
    ato: {
        progress: number;
        renews: Date;
    };
    burnRate: number;
}

export class FetchError extends Error {
    get name(): string {
      return this.constructor.name;
    }
  
    static async forResponse(resp: Response): Promise<FetchError> {
      return new FetchError(
        `Request failed with status code ${
          resp.status
        }.\nReason: ${await resp.text()}`,
      );
    }
  }

export type DashboardApi = {
    url: string;
    getDashboardData: () => Promise<DashboardDataResponse>;
}

export const dashboardApiRef = createApiRef<DashboardApi>({
    id: 'plugin.dashboard-backend.service',
    description: 'Used by the Dashboard plugin to make requests'
});

export class DashboardRestApi implements DashboardApi {
    static fromConfig(config: Config) {
        return new DashboardRestApi(config.getString('backend.baseUrl'));
    }

    constructor(public url: string) {}

    private async fetch<T = any>(input: string, init?: RequestInit): Promise<T> {
        const resp = await fetch(`${this.url}${input}`, init);
        if (!resp.ok) throw await FetchError.forResponse(resp);
        return await resp.json();
    }

    async getDashboardData(): Promise<DashboardDataResponse> {
        return this.fetch<DashboardDataResponse>('/api/dashboard/data');
    }
}