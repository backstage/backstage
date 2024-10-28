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

import nunjucks from 'nunjucks';
import { SecureTemplateRenderer } from './SecureTemplater';
import { LoggerService } from '@backstage/backend-plugin-api';

export function isNoNodeSnapshotOptionProvided(): boolean {
  return (
    process.env.NODE_OPTIONS?.includes('--no-node-snapshot') ||
    process.argv.includes('--no-node-snapshot')
  );
}

/**
 * Gets the major version of the currently running Node.js process.
 *
 * @remarks
 * This function extracts the major version from `process.versions.node` (a string representing the Node.js version),
 * which includes the major, minor, and patch versions. It splits this string by the `.` character to get an array
 * of these versions, and then parses the first element of this array (the major version) to a number.
 *
 * @returns {number} The major version of the currently running Node.js process.
 */
export function getMajorNodeVersion(): number {
  const version = process.versions.node;
  return parseInt(version.split('.')[0], 10);
}

export function isSingleTemplateString(input: string) {
  const { parser, nodes } = nunjucks as unknown as {
    parser: {
      parse(
        template: string,
        ctx: object,
        options: nunjucks.ConfigureOptions,
      ): { children: { children?: unknown[] }[] };
    };
    nodes: { TemplateData: Function };
  };

  const parsed = parser.parse(
    input,
    {},
    {
      autoescape: false,
      tags: {
        variableStart: '${{',
        variableEnd: '}}',
      },
    },
  );

  return (
    parsed.children.length === 1 &&
    !(parsed.children[0]?.children?.[0] instanceof nodes.TemplateData)
  );
}

export function renderTemplateString<T, TContext>(
  input: T,
  context: TContext,
  renderTemplate: SecureTemplateRenderer,
  logger: LoggerService,
): T {
  return JSON.parse(JSON.stringify(input), (_key, value) => {
    try {
      if (typeof value === 'string') {
        try {
          if (isSingleTemplateString(value)) {
            // Lets convert ${{ parameters.bob }} to ${{ (parameters.bob) | dump }} so we can keep the input type
            const wrappedDumped = value.replace(
              /\${{(.+)}}/g,
              '${{ ( $1 ) | dump }}',
            );

            // Run the templating
            const templated = renderTemplate(wrappedDumped, context);

            // If there's an empty string returned, then it's undefined
            if (templated === '') {
              return undefined;
            }

            // Reparse the dumped string
            return JSON.parse(templated);
          }
        } catch (ex) {
          logger.error(
            `Failed to parse template string: ${value} with error ${ex.message}`,
          );
        }

        // Fallback to default behaviour
        const templated = renderTemplate(value, context);

        if (templated === '') {
          return undefined;
        }

        return templated;
      }
    } catch {
      return value;
    }
    return value;
  });
}
