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
import { CompletedRequest, CompletedResponse } from 'mockttp';
import { z } from 'zod';

export function mockttpToFetchRequest(request: CompletedRequest) {
  const headers = new Headers(request.rawHeaders);
  return {
    url: request.url,
    method: request.method,
    headers,
    json: () => request.body.getJson(),
    text: () => request.body.getText(),
  } as Request;
}
export function mockttpToFetchResponse(response: CompletedResponse) {
  const headers = new Headers(response.rawHeaders);
  return {
    status: response.statusCode,
    headers,
    json: () => response.body?.getJson(),
    text: () => response.body?.getText(),
  } as Response;
}

function formatPath(path: PropertyKey[]) {
  return path.length ? `"/${path.map(String).join('/')}"` : 'Value';
}

/**
 * Convert zod issues into human readable messages. Each issue may produce
 * multiple messages, for example one per unrecognized key.
 */
export function humanifyZodIssues(issues: z.core.$ZodIssue[]): string[] {
  return issues.flatMap(issue => {
    switch (issue.code) {
      case 'invalid_type':
        // Issues are produced with `reportInput`, an undefined input means the value was missing.
        if (
          'input' in issue &&
          issue.input === undefined &&
          issue.path.length
        ) {
          return [
            `The "${String(
              issue.path[issue.path.length - 1],
            )}" property is required`,
          ];
        }
        return [
          `${formatPath(issue.path)} should be of type ${issue.expected}`,
        ];
      case 'unrecognized_keys':
        return issue.keys.map(key => `The "${key}" property is not allowed`);
      default:
        return [
          issue.path.length
            ? `${formatPath(issue.path)} ${issue.message}`
            : issue.message,
        ];
    }
  });
}
