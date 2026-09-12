/*
 * Copyright 2026 The Backstage Authors
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
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import {
  AuthService,
  BackstageCredentials,
  DiscoveryService,
} from '@backstage/backend-plugin-api';
import { InputError, NotFoundError, ResponseError } from '@backstage/errors';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { TechDocsMetadata } from '@backstage/plugin-techdocs-node';

// Memory optimization constants
const MAX_METADATA_SIZE = 5 * 1024 * 1024;
const FETCH_TIMEOUT = 15000;

const TEXT_PAGE_EXTENSIONS = [
  '.html',
  '.htm',
  '.md',
  '.txt',
  '.json',
  '.xml',
  '.yaml',
  '.yml',
];

function filterTextPages(
  pages: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  if (!pages) {
    return undefined;
  }
  return Object.fromEntries(
    Object.entries(pages).filter(([path]) =>
      TEXT_PAGE_EXTENSIONS.some(ext => path.endsWith(ext)),
    ),
  );
}

export const createGetTechdocsMetadataAction = ({
  actionsRegistry,
  auth,
  discovery,
}: {
  actionsRegistry: ActionsRegistryService;
  auth: AuthService;
  discovery: DiscoveryService;
}) => {
  actionsRegistry.register({
    name: 'get-techdocs-metadata',
    title: 'Get TechDocs Metadata',
    attributes: {
      destructive: false,
      readOnly: true,
      idempotent: true,
    },
    description: `
This allows you to get the metadata for a specific TechDocs site.
Each entity in the software catalog has a unique name, kind, and namespace. The default namespace is "default".
The metadata includes information about the site structure, navigation, and other relevant details.
    `,
    schema: {
      input: zodSchema =>
        zodSchema.object({
          kind: zodSchema
            .string()
            .describe('The kind of the entity to query')
            .default('Component'),
          namespace: zodSchema
            .string()
            .describe('The namespace of the entity to query')
            .default('default'),
          name: zodSchema.string().describe('The name of the entity to query'),
        }),
      output: zodSchema =>
        zodSchema
          .object({
            site_name: zodSchema
              .string()
              .optional()
              .describe('The name of the documentation site'),
            site_description: zodSchema
              .string()
              .optional()
              .describe('The description of the documentation site'),
            nav: zodSchema
              .array(zodSchema.any())
              .optional()
              .describe('Navigation structure of the documentation'),
            pages: zodSchema
              .record(zodSchema.any())
              .optional()
              .describe('Pages in the documentation'),
            metadata: zodSchema
              .record(zodSchema.any())
              .optional()
              .describe('Additional metadata'),
          })
          .passthrough(),
    },
    action: async ({ input, logger, credentials }) => {
      const entityName = {
        kind: input.kind,
        namespace: input.namespace,
        name: input.name,
      };
      const entityRef = stringifyEntityRef(entityName);

      try {
        const baseUrl = await discovery.getBaseUrl('techdocs');
        const { token } = await auth.getPluginRequestToken({
          onBehalfOf: credentials as BackstageCredentials,
          targetPluginId: 'techdocs',
        });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

        try {
          const response = await fetch(
            `${baseUrl}/metadata/techdocs/${encodeURIComponent(
              input.namespace,
            )}/${encodeURIComponent(input.kind)}/${encodeURIComponent(
              input.name,
            )}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              signal: controller.signal,
            },
          );

          clearTimeout(timeoutId);

          if (!response.ok) {
            if (response.status === 404) {
              throw new NotFoundError(
                `No TechDocs metadata found for entity ${entityRef}`,
              );
            }
            throw await ResponseError.fromResponse(response);
          }

          const contentLength = response.headers.get('content-length');
          if (
            contentLength &&
            parseInt(contentLength, 10) > MAX_METADATA_SIZE
          ) {
            throw new InputError(
              `Metadata too large: ${contentLength} bytes exceeds limit of ${MAX_METADATA_SIZE} bytes`,
            );
          }

          const text = await response.text();
          const textByteLength = Buffer.byteLength(text, 'utf8');
          if (textByteLength > MAX_METADATA_SIZE) {
            throw new InputError(
              `Metadata too large: ${textByteLength} bytes exceeds limit of ${MAX_METADATA_SIZE} bytes`,
            );
          }

          const metadata = JSON.parse(text) as TechDocsMetadata;

          // Add metadata validation
          if (!metadata || Object.keys(metadata).length === 0) {
            throw new NotFoundError(
              `No TechDocs metadata found for entity ${entityRef}`,
            );
          }

          const metadataWithExtras = metadata as TechDocsMetadata & {
            pages?: Record<string, unknown>;
          };

          const filteredPages = filterTextPages(metadataWithExtras.pages);

          const filteredMetadata: Record<string, unknown> = {
            ...metadataWithExtras,
            ...(filteredPages && { pages: filteredPages }),
          };

          return {
            output: filteredMetadata,
          };
        } catch (fetchError) {
          clearTimeout(timeoutId);
          throw fetchError;
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        logger.error(`Failed to get TechDocs metadata: ${errorMessage}`);

        if (error instanceof NotFoundError || error instanceof ResponseError) {
          throw error;
        }

        throw new Error(`Failed to get TechDocs metadata: ${errorMessage}`);
      }
    },
  });
};
