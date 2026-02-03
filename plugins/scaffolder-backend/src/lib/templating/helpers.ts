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

export function isNoNodeSnapshotOptionProvided(): boolean {
  return (
    process.env.NODE_OPTIONS?.includes('--no-node-snapshot') ||
    process.execArgv.includes('--no-node-snapshot')
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
