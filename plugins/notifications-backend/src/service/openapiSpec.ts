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

export const openapiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'Notifications API',
    version: '1.0.0',
    description: 'Backstage Notifications Backend API',
  },
  servers: [
    {
      url: '/api/notifications',
      description: 'Notifications API base URL',
    },
  ],
  paths: {
    '/notifications': {
      get: {
        summary: 'List notifications',
        description: 'Get a list of notifications for the authenticated user',
        security: [{ httpAuth: [] }],
        parameters: [
          {
            name: 'limit',
            in: 'query',
            description: 'Maximum number of notifications to return',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 20,
            },
          },
          {
            name: 'offset',
            in: 'query',
            description: 'Number of notifications to skip',
            schema: {
              type: 'integer',
              minimum: 0,
              default: 0,
            },
          },
        ],
        responses: {
          '200': {
            description: 'List of notifications',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Notification',
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
          },
          '500': {
            description: 'Internal server error',
          },
        },
      },
      post: {
        summary: 'Create notifications',
        description: 'Create and send notifications to recipients',
        security: [{ serviceAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/NotificationSendOptions',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Created notifications',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Notification',
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad request',
          },
          '401': {
            description: 'Unauthorized',
          },
          '500': {
            description: 'Internal server error',
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      httpAuth: {
        type: 'http',
        scheme: 'bearer',
        description: 'Bearer token authentication for users',
      },
      serviceAuth: {
        type: 'http',
        scheme: 'bearer',
        description: 'Bearer token authentication for services',
      },
    },
    schemas: {
      Notification: {
        type: 'object',
        required: ['id', 'user', 'created', 'origin', 'payload'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique identifier for the notification',
          },
          user: {
            type: 'string',
            nullable: true,
            description:
              'The user entity reference that the notification is targeted to or null for broadcast notifications',
          },
          created: {
            type: 'string',
            format: 'date-time',
            description: 'Notification creation date',
          },
          origin: {
            type: 'string',
            description:
              'Origin of the notification as in the reference to sender',
          },
          payload: {
            $ref: '#/components/schemas/NotificationPayload',
          },
        },
      },
      NotificationPayload: {
        type: 'object',
        required: ['title'],
        properties: {
          title: {
            type: 'string',
            description: 'Notification title',
          },
          description: {
            type: 'string',
            description: 'Optional longer description for the notification',
          },
          severity: {
            type: 'string',
            enum: ['critical', 'high', 'normal', 'low'],
            description: 'Notification severity, defaults to normal',
          },
        },
      },
      NotificationSendOptions: {
        type: 'object',
        required: ['recipients', 'payload'],
        properties: {
          recipients: {
            $ref: '#/components/schemas/NotificationRecipients',
          },
          payload: {
            $ref: '#/components/schemas/NotificationPayload',
          },
        },
      },
      NotificationRecipients: {
        type: 'object',
        required: ['type'],
        properties: {
          type: {
            type: 'string',
            enum: ['broadcast', 'entity'],
            description: 'Type of recipients',
          },
          entityRef: {
            type: 'string',
            description: 'Entity reference (required when type is entity)',
          },
        },
      },
    },
  },
} as const;
