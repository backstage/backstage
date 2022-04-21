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

import * as msal from '@azure/msal-node';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import fetch, { Response } from 'node-fetch';
import qs from 'qs';
import { MicrosoftGraphProviderConfig } from './config';

/**
 * OData (Open Data Protocol) Query
 *
 * {@link https://docs.microsoft.com/en-us/odata/concepts/queryoptions-overview}
 * {@link https://docs.microsoft.com/en-us/graph/query-parameters}
 * @public
 */
export type ODataQuery = {
  /**
   * search resources within a collection matching a free-text search expression.
   */
  search?: string;
  /**
   * filter a collection of resources
   */
  filter?: string;
  /**
   * specifies the related resources or media streams to be included in line with retrieved resources
   */
  expand?: string;
  /**
   * request a specific set of properties for each entity or complex type
   */
  select?: string[];
  /**
   * Retrieves the total count of matching resources.
   */
  count?: boolean;
};

/**
 * Extends the base msgraph types to include the odata type.
 *
 * @public
 */
export type GroupMember =
  | (MicrosoftGraph.Group & { '@odata.type': '#microsoft.graph.user' })
  | (MicrosoftGraph.User & { '@odata.type': '#microsoft.graph.group' });

/**
 * A HTTP Client that communicates with Microsoft Graph API.
 * Simplify Authentication and API calls to get `User` and `Group` from Azure Active Directory
 *
 * Uses `msal-node` for authentication
 *
 * @public
 */
export class MicrosoftGraphClient {
  /**
   * Factory method that instantiate `msal` client and return
   * an instance of `MicrosoftGraphClient`
   *
   * @public
   *
   * @param config - Configuration for Interacting with Graph API
   */
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

  /**
   * @param baseUrl - baseUrl of Graph API {@link MicrosoftGraphProviderConfig.target}
   * @param pca - instance of `msal.ConfidentialClientApplication` that is used to acquire token for Graph API calls
   *
   */
  constructor(
    private readonly baseUrl: string,
    private readonly pca: msal.ConfidentialClientApplication,
  ) {}

  /**
   * Get a collection of resource from Graph API and
   * return an `AsyncIterable` of that resource
   *
   * @public
   * @param path - Resource in Microsoft Graph
   * @param query - OData Query {@link ODataQuery}
   * @param queryMode - Mode to use while querying. Some features are only available at "advanced".
   */
  async *requestCollection<T>(
    path: string,
    query?: ODataQuery,
    queryMode?: 'basic' | 'advanced',
  ): AsyncIterable<T> {
    // upgrade to advanced query mode transparently when "search" is used
    // to stay backwards compatible.
    const appliedQueryMode = query?.search ? 'advanced' : queryMode ?? 'basic';

    // not needed for "search"
    // as of https://docs.microsoft.com/en-us/graph/aad-advanced-queries?tabs=http
    // even though a few other places say the opposite
    // - https://docs.microsoft.com/en-us/graph/api/user-list?view=graph-rest-1.0&tabs=http#request-headers
    // - https://docs.microsoft.com/en-us/graph/api/resources/group?view=graph-rest-1.0#properties
    if (appliedQueryMode === 'advanced' && (query?.filter || query?.select)) {
      query.count = true;
    }
    const headers: Record<string, string> =
      appliedQueryMode === 'advanced'
        ? {
            // Eventual consistency is required for advanced querying capabilities
            // like "$search" or parts of "$filter".
            // If a new user/group is not found, it'll eventually be imported on a subsequent read
            ConsistencyLevel: 'eventual',
          }
        : {};

    let response = await this.requestApi(path, query, headers);

    for (;;) {
      if (response.status !== 200) {
        await this.handleError(path, response);
      }

      const result = await response.json();

      // Graph API return array of collections
      const elements: T[] = result.value;

      yield* elements;

      // Follow cursor to the next page if one is available
      if (!result['@odata.nextLink']) {
        return;
      }

      response = await this.requestRaw(result['@odata.nextLink'], headers);
    }
  }

  /**
   * Abstract on top of {@link MicrosoftGraphClient.requestRaw}
   *
   * @public
   * @param path - Resource in Microsoft Graph
   * @param query - OData Query {@link ODataQuery}
   * @param headers - optional HTTP headers
   */
  async requestApi(
    path: string,
    query?: ODataQuery,
    headers?: Record<string, string>,
  ): Promise<Response> {
    const queryString = qs.stringify(
      {
        $search: query?.search,
        $filter: query?.filter,
        $select: query?.select?.join(','),
        $expand: query?.expand,
        $count: query?.count,
      },
      {
        addQueryPrefix: true,
        // Microsoft Graph doesn't like an encoded query string
        encode: false,
      },
    );

    return await this.requestRaw(
      `${this.baseUrl}/${path}${queryString}`,
      headers,
    );
  }

  /**
   * Makes a HTTP call to Graph API with token
   *
   * @param url - HTTP Endpoint of Graph API
   * @param headers - optional HTTP headers
   */
  async requestRaw(
    url: string,
    headers?: Record<string, string>,
  ): Promise<Response> {
    // Make sure that we always have a valid access token (might be cached)
    const token = await this.pca.acquireTokenByClientCredential({
      scopes: ['https://graph.microsoft.com/.default'],
    });

    if (!token) {
      throw new Error('Error while requesting token for Microsoft Graph');
    }

    return await fetch(url, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token.accessToken}`,
      },
    });
  }

  /**
   * Get {@link https://docs.microsoft.com/en-us/graph/api/resources/user | User}
   * from Graph API
   *
   * @public
   * @param userId - The unique identifier for the `User` resource
   * @param query - OData Query {@link ODataQuery}
   *
   */
  async getUserProfile(
    userId: string,
    query?: ODataQuery,
  ): Promise<MicrosoftGraph.User> {
    const response = await this.requestApi(`users/${userId}`, query);

    if (response.status !== 200) {
      await this.handleError('user profile', response);
    }

    return await response.json();
  }

  /**
   * Get {@link https://docs.microsoft.com/en-us/graph/api/resources/profilephoto | profilePhoto}
   * of `User` from Graph API with size limit
   *
   * @param userId - The unique identifier for the `User` resource
   * @param maxSize - Maximum pixel height of the photo
   *
   */
  async getUserPhotoWithSizeLimit(
    userId: string,
    maxSize: number,
  ): Promise<string | undefined> {
    return await this.getPhotoWithSizeLimit('users', userId, maxSize);
  }

  async getUserPhoto(
    userId: string,
    sizeId?: string,
  ): Promise<string | undefined> {
    return await this.getPhoto('users', userId, sizeId);
  }

  /**
   * Get a collection of
   * {@link https://docs.microsoft.com/en-us/graph/api/resources/user | User}
   * from Graph API and return as `AsyncIterable`
   *
   * @public
   * @param query - OData Query {@link ODataQuery}
   * @param queryMode - Mode to use while querying. Some features are only available at "advanced".
   */
  async *getUsers(
    query?: ODataQuery,
    queryMode?: 'basic' | 'advanced',
  ): AsyncIterable<MicrosoftGraph.User> {
    yield* this.requestCollection<MicrosoftGraph.User>(
      `users`,
      query,
      queryMode,
    );
  }

  /**
   * Get {@link https://docs.microsoft.com/en-us/graph/api/resources/profilephoto | profilePhoto}
   * of `Group` from Graph API with size limit
   *
   * @param groupId - The unique identifier for the `Group` resource
   * @param maxSize - Maximum pixel height of the photo
   *
   */
  async getGroupPhotoWithSizeLimit(
    groupId: string,
    maxSize: number,
  ): Promise<string | undefined> {
    return await this.getPhotoWithSizeLimit('groups', groupId, maxSize);
  }

  async getGroupPhoto(
    groupId: string,
    sizeId?: string,
  ): Promise<string | undefined> {
    return await this.getPhoto('groups', groupId, sizeId);
  }

  /**
   * Get a collection of
   * {@link https://docs.microsoft.com/en-us/graph/api/resources/group | Group}
   * from Graph API and return as `AsyncIterable`
   *
   * @public
   * @param query - OData Query {@link ODataQuery}
   * @param queryMode - Mode to use while querying. Some features are only available at "advanced".
   */
  async *getGroups(
    query?: ODataQuery,
    queryMode?: 'basic' | 'advanced',
  ): AsyncIterable<MicrosoftGraph.Group> {
    yield* this.requestCollection<MicrosoftGraph.Group>(
      `groups`,
      query,
      queryMode,
    );
  }

  /**
   * Get a collection of
   * {@link https://docs.microsoft.com/en-us/graph/api/resources/user | User}
   * belonging to a `Group` from Graph API and return as `AsyncIterable`
   * @public
   * @param groupId - The unique identifier for the `Group` resource
   *
   */
  async *getGroupMembers(groupId: string): AsyncIterable<GroupMember> {
    yield* this.requestCollection<GroupMember>(`groups/${groupId}/members`);
  }

  /**
   * Get {@link https://docs.microsoft.com/en-us/graph/api/resources/organization | Organization}
   * from Graph API
   * @public
   * @param tenantId - The unique identifier for the `Organization` resource
   *
   */
  async getOrganization(
    tenantId: string,
  ): Promise<MicrosoftGraph.Organization> {
    const response = await this.requestApi(`organization/${tenantId}`);

    if (response.status !== 200) {
      await this.handleError(`organization/${tenantId}`, response);
    }

    return await response.json();
  }

  /**
   * Get {@link https://docs.microsoft.com/en-us/graph/api/resources/profilephoto | profilePhoto}
   * from Graph API
   *
   * @param entityName - type of parent resource, either `User` or `Group`
   * @param id - The unique identifier for the {@link entityName | entityName} resource
   * @param maxSize - Maximum pixel height of the photo
   *
   */
  private async getPhotoWithSizeLimit(
    entityName: string,
    id: string,
    maxSize: number,
  ): Promise<string | undefined> {
    const response = await this.requestApi(`${entityName}/${id}/photos`);

    if (response.status === 404) {
      return undefined;
    } else if (response.status !== 200) {
      await this.handleError(`${entityName} photos`, response);
    }

    const result = await response.json();
    const photos = result.value as MicrosoftGraph.ProfilePhoto[];
    let selectedPhoto: MicrosoftGraph.ProfilePhoto | undefined = undefined;

    // Find the biggest picture that is smaller than the max size
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

    return await this.getPhoto(entityName, id, selectedPhoto.id!);
  }

  private async getPhoto(
    entityName: string,
    id: string,
    sizeId?: string,
  ): Promise<string | undefined> {
    const path = sizeId
      ? `${entityName}/${id}/photos/${sizeId}/$value`
      : `${entityName}/${id}/photo/$value`;
    const response = await this.requestApi(path);

    if (response.status === 404) {
      return undefined;
    } else if (response.status !== 200) {
      await this.handleError('photo', response);
    }

    return `data:image/jpeg;base64,${Buffer.from(
      await response.arrayBuffer(),
    ).toString('base64')}`;
  }

  private async handleError(path: string, response: Response): Promise<void> {
    const result = await response.json();
    const error = result.error as MicrosoftGraph.PublicError;

    throw new Error(
      `Error while reading ${path} from Microsoft Graph: ${error.code} - ${error.message}`,
    );
  }
}
