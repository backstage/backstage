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
import {
  buildJsonRpcErrorPayload,
  MCP_STREAMABLE_JSON_RPC_ERROR,
  sendJsonRpcErrorAsJson,
  sendJsonRpcErrorWithWriteHead,
  sendPlainTextClientError,
} from './mcpHttpErrorResponses';

describe('mcpHttpErrorResponses', () => {
  describe('buildJsonRpcErrorPayload', () => {
    it('builds a JSON-RPC 2.0 error envelope with id null', () => {
      expect(
        buildJsonRpcErrorPayload({
          code: -32000,
          message: 'Method not allowed.',
        }),
      ).toEqual({
        jsonrpc: '2.0',
        error: { code: -32000, message: 'Method not allowed.' },
        id: null,
      });
    });
  });

  describe('MCP_STREAMABLE_JSON_RPC_ERROR', () => {
    it('uses distinct codes for internal vs method errors', () => {
      expect(MCP_STREAMABLE_JSON_RPC_ERROR.internalServerError.error.code).toBe(
        -32603,
      );
      expect(MCP_STREAMABLE_JSON_RPC_ERROR.methodNotAllowed.error.code).toBe(
        -32000,
      );
    });
  });

  describe('sendJsonRpcErrorAsJson', () => {
    it('sets status and json body', () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      sendJsonRpcErrorAsJson(
        res,
        500,
        MCP_STREAMABLE_JSON_RPC_ERROR.internalServerError,
      );

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        MCP_STREAMABLE_JSON_RPC_ERROR.internalServerError,
      );
    });
  });

  describe('sendJsonRpcErrorWithWriteHead', () => {
    it('writes head and stringified payload', () => {
      const end = jest.fn();
      const writeHead = jest.fn().mockReturnValue({ end });
      const res = { writeHead } as unknown as Response;

      sendJsonRpcErrorWithWriteHead(
        res,
        405,
        MCP_STREAMABLE_JSON_RPC_ERROR.methodNotAllowed,
      );

      expect(writeHead).toHaveBeenCalledWith(405);
      expect(end).toHaveBeenCalledWith(
        JSON.stringify(MCP_STREAMABLE_JSON_RPC_ERROR.methodNotAllowed),
      );
    });
  });

  describe('sendPlainTextClientError', () => {
    it('sets status, content type, writes message, and ends response', () => {
      const write = jest.fn();
      const end = jest.fn();
      const contentType = jest.fn().mockReturnValue({ write });
      const res = {
        status: jest.fn().mockReturnValue({ contentType }),
        end,
      } as unknown as Response;

      sendPlainTextClientError(res, 400, 'sessionId is required');

      expect(res.status).toHaveBeenCalledWith(400);
      expect(contentType).toHaveBeenCalledWith('text/plain');
      expect(write).toHaveBeenCalledWith('sessionId is required');
      expect(end).toHaveBeenCalledWith();
    });
  });
});
