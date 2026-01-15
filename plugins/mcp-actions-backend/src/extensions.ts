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
import { createExtensionPoint } from '@backstage/backend-plugin-api';
import { z, AnyZodObject } from 'zod';
import {
  BackstageCredentials,
  LoggerService,
} from '@backstage/backend-plugin-api';

/**
 * Options for registering an MCP prompt.
 * Prompts provide context and guidance to AI clients about capabilities.
 * @public
 */
export type McpPromptOptions<TArgsSchema extends AnyZodObject = AnyZodObject> =
  {
    /** Unique identifier for the prompt */
    name: string;
    /** Human-readable title */
    title: string;
    /** Detailed description of what this prompt does */
    description: string;
    /** The template text that provides context to AI clients */
    template: string;
    /** Optional schema for prompt arguments */
    argsSchema?: (zod: typeof z) => TArgsSchema;
  };

/**
 * Options for registering an MCP resource.
 * Resources provide browsable, read-only data that AI clients can access for context.
 * @public
 */
export type McpResourceOptions = {
  /** Unique identifier for the resource */
  name: string;
  /** URI template pattern for the resource */
  uri: string;
  /** Human-readable title */
  title: string;
  /** Detailed description of what this resource provides */
  description: string;
  /** MIME type of the resource content */
  mimeType?: string;
  /** Handler function that provides the resource content */
  handler: (
    uri: URL,
    params: Record<string, string>,
    context: { credentials: BackstageCredentials; logger: LoggerService },
  ) => Promise<{
    contents: Array<{
      uri: string;
      text: string;
      mimeType?: string;
    }>;
  }>;
};

/**
 * Extension point for registering MCP prompts and resources.
 * Allows plugins to extend the MCP server with additional context for AI clients.
 * @public
 */
export interface McpExtensionPoint {
  /**
   * Add one or more prompts to the MCP server.
   * Prompts provide natural language guidance about plugin capabilities.
   */
  addPrompts(...prompts: McpPromptOptions[]): void;

  /**
   * Add one or more resources to the MCP server.
   * Resources allow AI clients to browse and read contextual data.
   */
  addResources(...resources: McpResourceOptions[]): void;
}

/**
 * Extension point for registering MCP prompts and resources.
 * @public
 */
export const mcpExtensionPoint = createExtensionPoint<McpExtensionPoint>({
  id: 'mcp-actions.context',
});
