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
import { Visitor, traverse, parse } from '@babel/core';

export const checkIfWeImportThePlugin = (fileContent: string) => {
  let result = false;
  const visitor: Visitor = {
    ImportSpecifier: path => {
      if (
        path.node.imported.type === 'Identifier' &&
        path.node.imported.name === 'LdapOrgReaderProcessor'
      ) {
        result = true;
      }
    },
  };

  traverse(
    parse(fileContent, {
      presets: ['@babel/preset-typescript'],
      filename: 'lol.ts',
    }),
    visitor,
  );

  return result;
};
