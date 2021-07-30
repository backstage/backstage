/*
 * Copyright 2021 The Backstage Authors
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
import { Visitor, template } from '@babel/core';
import { writeFileSync, PathLike, readFileSync } from 'fs';
import { transform } from '@codemod/core';

export const addCatalogProcessor = (
  filePath: string,
  readFile: (
    path: PathLike | number,
    options: { encoding: BufferEncoding; flag?: string } | BufferEncoding,
  ) => string = readFileSync,
  writeFile = writeFileSync,
) => {
  const fileContent = readFile(filePath, 'utf-8');
  const createImportStatement = template(
    `import { LdapOrgReaderProcessor } from '@backstage/plugin-catalog-backend-module-ldap';`,
  );
  const createBuilderSnippet = template(
    `builder.addProcessor(
        LdapOrgReaderProcessor.fromConfig(env.config, {
          logger: env.logger.child({
            type: 'plugin',
            plugin: 'LDAP',
          }),
        }),
      );`,
    { placeholderPattern: false },
  );

  const visitor: Visitor = {
    Program: path => {
      const imports = path.get('body').filter(n => n.isImportDeclaration());
      imports[imports.length - 1].insertAfter(createImportStatement());
    },
    VariableDeclaration: path => {
      if (
        path.node.declarations[0].id.type === 'Identifier' &&
        path.node.declarations[0].id.name === 'builder'
      ) {
        path.insertAfter(createBuilderSnippet());
      }
    },
  };

  const { code } = transform(fileContent, {
    filename: 'lol.ts',
    comments: true,
    plugins: [{ visitor }],
  }) ?? { code: 'Failed' };

  writeFile(filePath, code);

  return code;
};
