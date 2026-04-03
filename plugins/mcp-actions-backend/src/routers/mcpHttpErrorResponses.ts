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
import type { Response } from 'express';

/** JSON-RPC 2.0 error envelope used by MCP streamable HTTP routes. */
export type JsonRpcErrorPayload = {
  jsonrpc: '2.0';
  error: { code: number; message: string };
  id: null;
};

export function buildJsonRpcErrorPayload(options: {
  code: number;
  message: string;
}): JsonRpcErrorPayload {
  return {
    jsonrpc: '2.0',
    error: { code: options.code, message: options.message },
    id: null,
  };
}

/** Standard JSON-RPC error codes for streamable router error paths. */
export const MCP_STREAMABLE_JSON_RPC_ERROR = {
  internalServerError: buildJsonRpcErrorPayload({
    code: -32603,
    message: 'Internal server error',
  }),
  methodNotAllowed: buildJsonRpcErrorPayload({
    code: -32000,
    message: 'Method not allowed.',
  }),
} as const;

/**
 * Sends a JSON-RPC error as `res.status(...).json(...)` (e.g. POST failure path).
 */
export function sendJsonRpcErrorAsJson(
  res: Response,
  httpStatus: number,
  payload: JsonRpcErrorPayload,
): void {
  res.status(httpStatus).json(payload);
}

/**
 * Sends a JSON-RPC error via `writeHead` + JSON string body (GET/DELETE paths).
 */
export function sendJsonRpcErrorWithWriteHead(
  res: Response,
  httpStatus: number,
  payload: JsonRpcErrorPayload,
): void {
  res.writeHead(httpStatus).end(JSON.stringify(payload));
}

/**
 * Plain-text 4xx body for SSE router client errors (same status, type, and body as before;
 * calls `end()` so the response finishes—matching typical Express completion after `write`).
 */
export function sendPlainTextClientError(
  res: Response,
  httpStatus: number,
  message: string,
): void {
  res.status(httpStatus).contentType('text/plain').write(message);
  res.end();
}
