/*
 * Copyright 2022 The Backstage Authors
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

import { makeCreatePermissionRule } from '@backstage/plugin-permission-node';
import {
  RESOURCE_TYPE_SCAFFOLDER_TEMPLATE,
  TemplateEntityV1beta3,
} from '@backstage/plugin-scaffolder-common';
import { z } from 'zod';

import get from 'lodash/get';
import unset from 'lodash/unset';
import { TemplateTransform } from './helpers';
import {
  SecureTemplater,
  SecureTemplateRenderer,
} from '../lib/templating/SecureTemplater';

export const createScaffolderPermissionRule = makeCreatePermissionRule<
  TemplateEntityV1beta3,
  TemplateTransform,
  typeof RESOURCE_TYPE_SCAFFOLDER_TEMPLATE
>();

let render: SecureTemplateRenderer;

export const allowCapabilities = createScaffolderPermissionRule({
  name: 'ALLOW_CAPABILITIES',
  resourceType: RESOURCE_TYPE_SCAFFOLDER_TEMPLATE,
  description: 'Allow capabilities based on permissions',
  paramsSchema: z.object({
    capabilities: z.array(z.string()),
    templateRef: z.string().optional(),
  }),
  apply: () => true,
  toQuery:
    ({ capabilities }) =>
    template => {
      const capabilitiesObj = capabilities.reduce((acc, c) => {
        acc[c] = true;
        return acc;
      }, {} as Record<string, boolean>);

      const parametersPath = ['spec', 'parameters'];
      const capabilitiesKey = 'backstage:capabilities';

      if (Array.isArray(template.spec.parameters)) {
        template.spec.parameters.forEach((parameter, index) => {
          const parameterPath = [...parametersPath, index.toString()];
          stripParams(parameterPath);
          if (parameter.properties) {
            Object.keys(parameter.properties).forEach(p => {
              if (stripParams([...parameterPath, 'properties', p])) {
                const requiredProperties = get(template, [
                  ...parameterPath,
                  'required',
                ]);
                if (Array.isArray(requiredProperties)) {
                  requiredProperties.splice(requiredProperties.indexOf(p), 1);
                }
              }
            });
          }
        });
      } else {
        stripParams(parametersPath);
      }

      template.spec.steps.forEach((_p, index) =>
        stripParams(['spec', 'steps', index.toString()]),
      );

      function stripParams(path: string[]) {
        const jsonObject = get(template, path);

        if (
          typeof jsonObject[capabilitiesKey] === 'string' &&
          render(jsonObject[capabilitiesKey], {
            capabilities: capabilitiesObj,
          }) !== 'true'
        ) {
          const parent = get(template, [...path].splice(0, path.length - 1));
          if (Array.isArray(parent)) {
            parent.splice(parent.indexOf(jsonObject), 1);
          } else {
            unset(template, path);
          }

          return path[path.length - 1];
        }
        return undefined;
      }

      return template;
    },
});

SecureTemplater.loadRenderer().then(r => (render = r));

export const scaffolderRules = { allowCapabilities };
