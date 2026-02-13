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

import type { CatalogModelRegistry } from '@backstage/catalog-model-extensions';

/**
 * Registers company-wide catalog model extensions.
 * Adds cost center, service tier, and company annotations to Components.
 */
export default function registerCompanyExtensions(
  registry: CatalogModelRegistry,
) {
  const component = registry.getKind('Component');

  component.spec.extend(z => ({
    costCenter: z
      .string()
      .meta({
        description: 'Finance cost center code for billing attribution',
      }),
    tier: z
      .enum(['critical', 'standard', 'internal'])
      .meta({ description: 'SLA tier for incident response' }),
    team: z
      .entityRef({ kind: 'Group' })
      .withRelations({ forward: 'maintainedBy', reverse: 'maintains' })
      .meta({ description: 'Team responsible for day-to-day maintenance' }),
  }));

  component.metadata.annotations.extend(z => ({
    'company.com/slack-channel': z
      .string()
      .meta({
        description: 'Slack channel for the team owning this component',
      }),
    'company.com/runbook-url': z
      .string()
      .meta({ description: 'Link to the operational runbook' }),
    'company.com/datadog-dashboard': z
      .string()
      .meta({ description: 'Datadog dashboard URL for monitoring' }),
  }));

  component.metadata.labels.extend(z => ({
    'company.com/business-unit': z
      .string()
      .meta({ description: 'Business unit that owns this component' }),
    'company.com/compliance-scope': z
      .string()
      .meta({ description: 'Compliance framework scope' }),
  }));
}
