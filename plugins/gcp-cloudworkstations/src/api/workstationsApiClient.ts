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

import { WorkstationConfig } from '../components/types';
import { IAM_WORKSTATIONS_PERMISSION, Workstation } from './types';
import { CloudWorkstationsApi } from './workstationsApi';
import { ErrorApi, FetchApi, OAuthApi } from '@backstage/core-plugin-api';

export const GCP_CLOUDWORKSTATIONS_API_URL =
  'https://workstations.googleapis.com/v1';

export const GCP_CLOUDWORKSTATIONS_CONFIG_ANNOTATION_PATTERN =
  '^projects/[^/]+/locations/[^/]+/workstationClusters/[^/]+/workstationConfigs/[^/]+';

/** @public */
export class WorkstationsApiClient implements CloudWorkstationsApi {
  private readonly IAM_PERMISSIONS_GRANTS = Object.values(
    IAM_WORKSTATIONS_PERMISSION,
  );

  validWorkstationsConfigString(configString: string) {
    return new RegExp(
      GCP_CLOUDWORKSTATIONS_CONFIG_ANNOTATION_PATTERN,
      'g',
    ).test(configString);
  }

  constructor(
    private readonly fetchApi: FetchApi,
    private readonly googleAuthApi: OAuthApi,
    private readonly errorApi: ErrorApi,
  ) {}

  async getWorkstationsIAmPermissions(workstationConfig: string) {
    const response = await this.handleCloudWorkstationsApiCallResponse(
      this.fetchApi.fetch(
        encodeURI(
          `${GCP_CLOUDWORKSTATIONS_API_URL}/${workstationConfig}:testIamPermissions`,
        ),
        {
          mode: 'cors',
          headers: await this.getHeaders(),
          method: 'POST',
          body: JSON.stringify({
            permissions: this.IAM_PERMISSIONS_GRANTS,
          }),
        },
      ),
    );
    return (response as Record<string, any>)
      ?.permissions as IAM_WORKSTATIONS_PERMISSION[];
  }

  async getWorkstationConfigDetails(
    workstationConfig: string,
  ): Promise<WorkstationConfig> {
    return (await this.handleCloudWorkstationsApiCallResponse(
      this.fetchApi.fetch(
        encodeURI(`${GCP_CLOUDWORKSTATIONS_API_URL}/${workstationConfig}`),
        {
          mode: 'cors',
          headers: await this.getHeaders(),
        },
      ),
    )) as WorkstationConfig;
  }

  async getWorkstations(workstationConfig: string): Promise<Workstation[]> {
    const response = await this.handleCloudWorkstationsApiCallResponse(
      this.fetchApi.fetch(
        encodeURI(
          `${GCP_CLOUDWORKSTATIONS_API_URL}/${workstationConfig}/workstations:listUsable`,
        ),
        {
          mode: 'cors',
          headers: await this.getHeaders(),
        },
      ),
    );

    return (response as Record<string, any>)?.workstations;
  }

  async createWorkstation(workstationConfig: string): Promise<void> {
    await this.handleCloudWorkstationsApiCallResponse(
      this.fetchApi.fetch(
        encodeURI(
          `${GCP_CLOUDWORKSTATIONS_API_URL}/${workstationConfig}/workstations?workstationId=${`workstation-${Date.now().toString()}`}`,
        ),
        {
          mode: 'cors',
          method: 'POST',
          headers: await this.getHeaders(),
        },
      ),
    );
  }

  async startWorkstation(
    workstationConfig: string,
    workstationName: string,
  ): Promise<void> {
    await this.handleCloudWorkstationsApiCallResponse(
      this.fetchApi.fetch(
        encodeURI(
          `${GCP_CLOUDWORKSTATIONS_API_URL}/${workstationConfig}/workstations/${workstationName}:start`,
        ),
        {
          mode: 'cors',
          method: 'POST',
          headers: await this.getHeaders(),
        },
      ),
    );
  }

  async stopWorkstation(
    workstationConfig: string,
    workstationName: string,
  ): Promise<void> {
    await this.handleCloudWorkstationsApiCallResponse(
      this.fetchApi.fetch(
        encodeURI(
          `${GCP_CLOUDWORKSTATIONS_API_URL}/${workstationConfig}/workstations/${workstationName}:stop`,
        ),
        {
          mode: 'cors',
          method: 'POST',
          headers: await this.getHeaders(),
        },
      ),
    );
  }

  async getHeaders(): Promise<HeadersInit> {
    const token = await this.googleAuthApi.getAccessToken(
      'https://www.googleapis.com/auth/cloud-platform',
    );
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  private async handleCloudWorkstationsApiCallResponse(
    fetchResult: Promise<Response>,
  ): Promise<Record<string, any> | any[] | undefined> {
    const response = await fetchResult;
    const responseContent = await response.json();
    if (!response.ok) {
      if (responseContent?.error) {
        this.errorApi.post({
          name: 'google_cloud_api_response_error',
          message: responseContent.error.message,
        });
      }
    }
    return responseContent;
  }
}
