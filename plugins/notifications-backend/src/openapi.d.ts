/*
 * Copyright 2023 The Backstage Authors
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
import type {
  AxiosRequestConfig,
  OpenAPIClient,
  OperationResponse,
  Parameters,
  UnknownParamsObject,
} from 'openapi-client-axios';

declare namespace Components {
  namespace Schemas {
    export interface Action {
      id: string;
      title: string;
      url: string;
    }
    export interface CreateBody {
      origin: string;
      title: string;
      message?: string;
      actions?: {
        title: string;
        url: string;
      }[];
      topic?: string;
      targetUsers?: string[];
      targetGroups?: string[];
    }
    export interface Notification {
      id: string;
      created: string; // date-time
      readByUser: boolean;
      isSystem: boolean;
      origin: string;
      title: string;
      message?: string;
      topic?: string;
      actions: Action[];
    }
    export type Notifications = Notification[];
  }
}
declare namespace Paths {
  namespace CreateNotification {
    export type RequestBody = Components.Schemas.CreateBody;
    namespace Responses {
      export interface $200 {
        /**
         * example:
         * bc9f19de-8b7b-49a8-9262-c5036a1ed35e
         */
        messageId: string;
      }
    }
  }
  namespace GetNotifications {
    namespace Parameters {
      export type ContainsText = string;
      export type CreatedAfter = string; // date-time
      export type MessageScope = 'all' | 'user' | 'system';
      export type OrderBy =
        | 'title'
        | 'message'
        | 'created'
        | 'topic'
        | 'origin';
      export type OrderByDirec = 'asc' | 'desc';
      export type PageNumber = number;
      export type PageSize = number;
      export type Read = boolean;
      export type User = string;
    }
    export interface QueryParameters {
      pageSize?: Parameters.PageSize;
      pageNumber?: Parameters.PageNumber;
      orderBy?: Parameters.OrderBy;
      orderByDirec?: Parameters.OrderByDirec;
      containsText?: Parameters.ContainsText;
      createdAfter?: Parameters.CreatedAfter /* date-time */;
      messageScope?: Parameters.MessageScope;
      user?: Parameters.User;
      read?: Parameters.Read;
    }
    namespace Responses {
      export type $200 = Components.Schemas.Notifications;
    }
  }
  namespace GetNotificationsCount {
    namespace Parameters {
      export type ContainsText = string;
      export type CreatedAfter = string; // date-time
      export type MessageScope = 'all' | 'user' | 'system';
      export type Read = boolean;
      export type User = string;
    }
    export interface QueryParameters {
      containsText?: Parameters.ContainsText;
      createdAfter?: Parameters.CreatedAfter /* date-time */;
      messageScope?: Parameters.MessageScope;
      user?: Parameters.User;
      read?: Parameters.Read;
    }
    namespace Responses {
      export interface $200 {
        count: number;
      }
    }
  }
  namespace SetRead {
    namespace Parameters {
      export type MessageId = string;
      export type Read = boolean;
      export type User = string;
    }
    export interface QueryParameters {
      messageId: Parameters.MessageId;
      user: Parameters.User;
      read: Parameters.Read;
    }
    namespace Responses {
      export interface $200 {}
    }
  }
}

export interface OperationMethods {
  /**
   * getNotifications - Gets notifications
   *
   * Gets notifications
   */
  'getNotifications'(
    parameters?: Parameters<Paths.GetNotifications.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetNotifications.Responses.$200>;
  /**
   * createNotification - Create notification
   *
   * Create notification
   */
  'createNotification'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateNotification.RequestBody,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.CreateNotification.Responses.$200>;
  /**
   * getNotificationsCount - Get notifications count
   *
   * Gets notifications count
   */
  'getNotificationsCount'(
    parameters?: Parameters<Paths.GetNotificationsCount.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetNotificationsCount.Responses.$200>;
  /**
   * setRead - Set notification as read/unread
   *
   * Set notification as read/unread
   */
  'setRead'(
    parameters?: Parameters<Paths.SetRead.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.SetRead.Responses.$200>;
}

export interface PathsDictionary {
  ['/notifications']: {
    /**
     * createNotification - Create notification
     *
     * Create notification
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateNotification.RequestBody,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.CreateNotification.Responses.$200>;
    /**
     * getNotifications - Gets notifications
     *
     * Gets notifications
     */
    'get'(
      parameters?: Parameters<Paths.GetNotifications.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetNotifications.Responses.$200>;
  };
  ['/notifications/count']: {
    /**
     * getNotificationsCount - Get notifications count
     *
     * Gets notifications count
     */
    'get'(
      parameters?: Parameters<Paths.GetNotificationsCount.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetNotificationsCount.Responses.$200>;
  };
  ['/notifications/read']: {
    /**
     * setRead - Set notification as read/unread
     *
     * Set notification as read/unread
     */
    'put'(
      parameters?: Parameters<Paths.SetRead.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.SetRead.Responses.$200>;
  };
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>;
