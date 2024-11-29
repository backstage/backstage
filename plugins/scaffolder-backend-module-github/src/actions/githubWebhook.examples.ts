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
import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';

export const examples: TemplateExample[] = [
  {
    description: 'Create a GitHub webhook for a repository',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:webhook',
          name: 'Create GitHub Webhook',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            webhookUrl: 'https://example.com/my-webhook',
            webhookSecret: 'mysecret',
            events: ['push'],
            active: true,
            contentType: 'json',
            insecureSsl: false,
            token: 'my-github-token',
          },
        },
      ],
    }),
  },
  {
    description: 'Create a GitHub webhook with minimal configuration',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:webhook',
          name: 'Create GitHub Webhook',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            webhookUrl: 'https://example.com/my-webhook',
          },
        },
      ],
    }),
  },
  {
    description: 'Create a GitHub webhook with custom events',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:webhook',
          name: 'Create GitHub Webhook',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            webhookUrl: 'https://example.com/my-webhook',
            events: ['push', 'pull_request'],
          },
        },
      ],
    }),
  },
  {
    description: 'Create a GitHub webhook with JSON content type',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:webhook',
          name: 'Create GitHub Webhook',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            webhookUrl: 'https://example.com/my-webhook',
            contentType: 'json',
          },
        },
      ],
    }),
  },
  {
    description: 'Create a GitHub webhook with insecure SSL',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:webhook',
          name: 'Create GitHub Webhook',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            webhookUrl: 'https://example.com/my-webhook',
            insecureSsl: true,
          },
        },
      ],
    }),
  },
  {
    description: 'Create an inactive GitHub webhook',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:webhook',
          name: 'Create GitHub Webhook',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            webhookUrl: 'https://example.com/my-webhook',
            active: false,
          },
        },
      ],
    }),
  },
];
