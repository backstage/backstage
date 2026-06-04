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

export interface Config {
  scaffolder?: {
    mcpServers?: {
      [serverId: string]: {
        /**
         * Transport used to reach the MCP server. Only "stdio" is supported today.
         */
        transport?: 'stdio';
        /**
         * Executable to spawn for the MCP server (stdio transport).
         */
        command: string;
        /**
         * Arguments passed to the command.
         */
        args?: string[];
        /**
         * Additional environment variables forwarded to the spawned process.
         * @visibility secret
         */
        env?: { [key: string]: string };
        /**
         * Working directory for the spawned process.
         */
        cwd?: string;
        /**
         * Maximum time in milliseconds to wait for a single tool call.
         * Defaults to 60000 (60 seconds).
         */
        timeoutMs?: number;
      };
    };
  };
}
