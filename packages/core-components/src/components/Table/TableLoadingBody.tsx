/*
 * Copyright 2023 The Backstage Authors
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

/**
 * @internal
 */
export function TableLoadingBody(props: { colSpan?: number }) {
  return (
    <tbody data-testid="loading-indicator">
      <tr>
        <td colSpan={props.colSpan}>
          <div className="flex w-full items-center justify-center min-h-[15rem]">
            <div
              className="h-20 w-20 animate-spin rounded-full border-4 border-muted border-t-primary"
              role="status"
              aria-label="Loading"
            />
          </div>
        </td>
      </tr>
    </tbody>
  );
}
