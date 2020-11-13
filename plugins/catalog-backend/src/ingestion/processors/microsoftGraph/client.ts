/*
 * Copyright 2020 Spotify AB
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

import { MicrosoftGraphProviderConfig } from './config';
import * as msal from '@azure/msal-node';
import fetch from 'cross-fetch';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import qs from 'qs';

type ODataQuery = { filter?: string; expand?: string[]; select?: string[] };

type GroupMember =
  | (MicrosoftGraph.Group & { '@odata.type': '#microsoft.graph.user' })
  | (MicrosoftGraph.User & { '@odata.type': '#microsoft.graph.group' });

export class MicrosoftGraphClient {
  static create(config: MicrosoftGraphProviderConfig): MicrosoftGraphClient {
    const clientConfig: msal.Configuration = {
      auth: {
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        authority: `${config.authority}/${config.tenantId}`,
      },
    };
    const pca = new msal.ConfidentialClientApplication(clientConfig);
    return new MicrosoftGraphClient(config.target, pca);
  }

  constructor(
    private readonly baseUrl: string,
    private readonly pca: msal.ConfidentialClientApplication,
  ) {}

  async api(path: string, query?: ODataQuery): Promise<Response> {
    const queryString = qs.stringify(
      {
        $filter: query?.filter,
        $select: query?.select?.join(','),
        $expand: query?.expand?.join(','),
      },
      {
        addQueryPrefix: true,
        // Microsoft Graph doesn't like an encoded query string
        encode: false,
      },
    );

    return await this.request(`${this.baseUrl}/${path}${queryString}`);
  }

  async request(url: string): Promise<Response> {
    // Make sure that we always have a valid access token (might be cached)
    const token = await this.pca.acquireTokenByClientCredential({
      scopes: ['https://graph.microsoft.com/.default'],
    });

    return await fetch(url, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });
  }

  async getUserProfile(userId: string): Promise<MicrosoftGraph.User> {
    const response = await this.api(`users/${userId}`);

    if (response.status !== 200) {
      await this.handleError('user profile', response);
    }

    return await response.json();
  }

  async getUserPhotoWithSizeLimit(
    userId: string,
    maxSize: number,
  ): Promise<string | undefined> {
    const response = await this.api(`users/${userId}/photos`);

    if (response.status === 404) {
      return undefined;
    } else if (response.status !== 200) {
      await this.handleError('user photos', response);
    }

    const result = await response.json();
    const photos = result.value as MicrosoftGraph.ProfilePhoto[];
    let selectedPhoto: MicrosoftGraph.ProfilePhoto | undefined = undefined;

    // Find the biggest picture that is small than the max size
    for (const p of photos) {
      if (
        !selectedPhoto ||
        (p.height! >= selectedPhoto.height! && p.height! <= maxSize)
      ) {
        selectedPhoto = p;
      }
    }

    if (!selectedPhoto) {
      return undefined;
    }

    return await this.getUserPhoto(userId, selectedPhoto.id!);
  }

  async getUserPhoto(
    userId: string,
    sizeId?: string,
  ): Promise<string | undefined> {
    const path = sizeId
      ? `users/${userId}/photos/${sizeId}/$value`
      : `users/${userId}/photo/$value`;
    const response = await this.api(path);

    if (response.status === 404) {
      return undefined;
    } else if (response.status !== 200) {
      await this.handleError('photo', response);
    }

    return `data:image/jpeg;base64,${Buffer.from(
      await response.arrayBuffer(),
    ).toString('base64')}`;
  }

  async *getUsers(query?: ODataQuery): AsyncIterable<MicrosoftGraph.User> {
    let response = await this.api(`users`, query);
    for (;;) {
      if (response.status !== 200) {
        await this.handleError('users', response);
      }

      const result = await response.json();
      const users: MicrosoftGraph.User[] = result.value;

      yield* users;

      // Follow cursor to the next page if one is available
      if (!result['@odata.nextLink']) {
        return;
      }

      response = await this.request(result['@odata.nextLink']);
    }
  }

  async *getGroups(query?: ODataQuery): AsyncIterable<MicrosoftGraph.Group> {
    let response = await this.api(`groups`, query);

    for (;;) {
      if (response.status !== 200) {
        await this.handleError('groups', response);
      }

      const result = await response.json();
      const groups: MicrosoftGraph.Group[] = result.value;

      yield* groups;

      // Follow cursor to the next page if one is available
      if (!result['@odata.nextLink']) {
        return;
      }

      response = await this.request(result['@odata.nextLink']);
    }
  }

  async *getGroupMembers(groupId: string): AsyncIterable<GroupMember> {
    let response = await this.api(`groups/${groupId}/members`);

    for (;;) {
      if (response.status !== 200) {
        await this.handleError('group members', response);
      }

      const result = await response.json();
      const groups: GroupMember[] = result.value;

      yield* groups;

      // Follow cursor to the next page if one is available
      if (!result['@odata.nextLink']) {
        return;
      }

      response = await this.request(result['@odata.nextLink']);
    }
  }

  async getOrganization(): Promise<MicrosoftGraph.Organization[] | undefined> {
    const response = await this.api(`organization`);

    if (response.status !== 200) {
      await this.handleError('organization', response);
    }

    const result = await response.json();

    return result.value as MicrosoftGraph.Organization[];
  }

  private async handleError(name: string, response: Response): Promise<void> {
    const result = await response.json();
    const error = result.error as MicrosoftGraph.PublicError;

    throw new Error(
      `Error while reading ${name} from Microsoft Graph: ${error.code} - ${error.message}`,
    );
  }
}
