/*
 * Copyright 2025 The Backstage Authors
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
import { NodeHtmlMarkdown } from 'node-html-markdown';
import path from 'node:path';

// Memory optimization constants
const MAX_CONTENT_SIZE = 10 * 1024 * 1024;
const FETCH_TIMEOUT = 30000;

function sanitizePath(inputPath: string): string {
  // Normalize using POSIX semantics and forward slashes so the result
  // is safe for use in URLs
  const posixInput = inputPath.replace(/\\/g, '/');
  const normalized = path.posix.normalize(posixInput);
  if (
    normalized.startsWith('..') ||
    normalized.includes('/..') ||
    path.posix.isAbsolute(normalized)
  ) {
    throw new InputError(`Invalid path: ${inputPath}`);
  }
  return normalized;
}

function isHtmlFile(filePath: string): boolean {
  return filePath.endsWith('.html');
}

export const createGetTechdocsContentAction = ({
  actionsRegistry,
  auth,
  discovery,
}: {
  actionsRegistry: ActionsRegistryService;
  auth: AuthService;
  discovery: DiscoveryService;
}) => {
  actionsRegistry.register({
    name: 'get-techdocs-content',
    title: 'Get TechDocs Content',
    attributes: {
      destructive: false,
      readOnly: true,
      idempotent: true,
    },
    description: `
This allows you to get the content of a specific page from a TechDocs site as Markdown.
Each entity in the software catalog has a unique name, kind, and namespace. The default namespace is "default".
You can specify the file path within the documentation site to retrieve its content.
Only HTML files are supported - binary files like images are not returned.
The HTML content is automatically converted to Markdown for better LLM understanding and reduced token consumption.
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
          path: zodSchema
            .string()
            .describe(
              'The HTML file path within the documentation site (e.g., "index.html", "getting-started/index.html")',
            )
            .default('index.html'),
        }),
      output: zodSchema =>
        zodSchema.object({
          content: zodSchema
            .string()
            .describe('The Markdown content of the requested file'),
          contentType: zodSchema
            .string()
            .describe('The content type of the output (text/markdown)'),
          path: zodSchema.string().describe('The path of the requested file'),
        }),
    },
    action: async ({ input, logger, credentials }) => {
      const entityName = {
        kind: input.kind,
        namespace: input.namespace,
        name: input.name,
      };
      const entityRef = stringifyEntityRef(entityName);

      try {
        const safePath = sanitizePath(input.path);

        if (!isHtmlFile(safePath)) {
          throw new InputError(
            `Only HTML files are supported. Requested path '${safePath}' is not an HTML file.`,
          );
        }

        const baseUrl = await discovery.getBaseUrl('techdocs');
        const { token } = await auth.getPluginRequestToken({
          onBehalfOf: credentials as BackstageCredentials,
          targetPluginId: 'techdocs',
        });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

        try {
          const encodedSafePath = safePath
            .split('/')
            .map(segment => encodeURIComponent(segment))
            .join('/');
          const response = await fetch(
            `${baseUrl}/static/docs/${encodeURIComponent(
              input.namespace,
            )}/${encodeURIComponent(input.kind)}/${encodeURIComponent(
              input.name,
            )}/${encodedSafePath}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              signal: controller.signal,
            },
          );

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw await ResponseError.fromResponse(response);
          }

          const contentLength = response.headers.get('content-length');
          if (contentLength && parseInt(contentLength, 10) > MAX_CONTENT_SIZE) {
            throw new InputError(
              `Content too large: ${contentLength} bytes exceeds limit of ${MAX_CONTENT_SIZE} bytes`,
            );
          }

          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error('Response body is not readable');
          }

          const chunks: Uint8Array[] = [];
          let totalSize = 0;

          try {
            let done = false;
            while (!done) {
              const result = await reader.read();
              done = result.done;

              if (!done && result.value) {
                totalSize += result.value.length;
                if (totalSize > MAX_CONTENT_SIZE) {
                  throw new InputError(
                    `Content too large: ${totalSize} bytes exceeds limit of ${MAX_CONTENT_SIZE} bytes`,
                  );
                }

                chunks.push(result.value);
              }
            }
          } finally {
            reader.releaseLock();
          }

          const totalLength = chunks.reduce(
            (sum, chunk) => sum + chunk.length,
            0,
          );
          const combined = new Uint8Array(totalLength);
          let offset = 0;
          for (const chunk of chunks) {
            combined.set(chunk, offset);
            offset += chunk.length;
          }

          const htmlContent = new TextDecoder('utf-8').decode(combined);

          chunks.length = 0;

          // Convert HTML to Markdown for better LLM understanding and reduced token consumption
          const markdownContent = NodeHtmlMarkdown.translate(htmlContent);

          return {
            output: {
              content: markdownContent,
              contentType: 'text/markdown',
              path: safePath,
            },
          };
        } catch (fetchError) {
          clearTimeout(timeoutId);
          throw fetchError;
        }
      } catch (error) {
        if (
          error instanceof NotFoundError ||
          error instanceof InputError ||
          error instanceof ResponseError
        ) {
          throw error;
        }

        const errorMessage =
          error instanceof Error ? error.message : String(error);
        logger.error(`Failed to get TechDocs content: ${errorMessage}`);
        logger.debug(
          `Error stack: ${error instanceof Error ? error.stack : 'N/A'}`,
        );

        throw new Error(
          `Failed to get TechDocs content for ${entityRef}, path: ${input.path}. Error: ${errorMessage}`,
        );
      }
    },
  });
};
