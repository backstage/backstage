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

/// <reference types="node" />
// @ts-check

const { randomUUID } = require('node:crypto');
const { mkdirSync, writeFileSync } = require('node:fs');
const path = require('node:path');

/** @type {Parameters<import('oxlint/plugins-dev').RuleTester['run']>[1]} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Collect files for final explained-suppression validation.',
    },
    schema: [],
  },

  createOnce(context) {
    return {
      before() {
        const auditDir = process.env.BACKSTAGE_OXLINT_AUDIT_DIR;
        if (!auditDir) {
          throw new Error(
            'The strict preset requires BACKSTAGE_OXLINT_AUDIT_DIR from the Backstage CLI.',
          );
        }

        const filePath = path.resolve(context.cwd, context.physicalFilename);
        mkdirSync(auditDir, { recursive: true });
        writeFileSync(
          path.join(auditDir, `file-${randomUUID()}.json`),
          JSON.stringify({ version: 1, filePath }),
        );
      },
      Program() {},
    };
  },
};
