#!/usr/bin/env node
'use strict';
/*
 * Copyright 2022 The Backstage Authors
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

const tsMorph = require('ts-morph');

const project = new tsMorph.Project({
  tsConfigFilePath: '../../tsconfig.json',
  skipAddingFilesFromTsConfig: true,
});
project.addSourceFilesAtPaths('src/**');

const modelsFile = project.getSourceFile('src/models/index.ts');
const modelsModule = modelsFile.getModuleOrThrow('Models');

const clientFile = project.getSourceFile('src/BitbucketCloudClient.ts');
const clientClass = clientFile.getClassOrThrow('BitbucketCloudClient');

/**
 * Returns an array of the unique items of the provided array.
 *
 * @param {string[]} array array with potentially non-unique items.
 * @returns {string[]} array with unique items.
 */
function unique(array) {
  return [...new Set(array)];
}

/**
 *
 * @param {tsMorph.ClassDeclaration | tsMorph.InterfaceDeclaration | tsMorph.TypeAliasDeclaration} stmt Statement like interface or type alias.
 * @param {string[]=} processed Keeps track of which statement was already processed.
 * @returns {string[]}
 */
function referencedModelsIdentifiers(stmt, processed) {
  // eslint-disable-next-line no-param-reassign
  processed = processed ?? [];
  const name = stmt.getName();

  if (processed.includes(name)) {
    return [];
  }

  const referenced = unique(
    stmt
      .getDescendantsOfKind(tsMorph.SyntaxKind.Identifier)
      .map(it => it.getSymbol())
      .filter(it => it)
      .map(it => it.getFullyQualifiedName())
      .filter(it => it.includes('Models.'))
      .map(it => it.substring(it.indexOf('Models.') + 7))
      .filter(it => !it.includes('.'))
      .filter(it => it !== name),
  );
  processed.push(name);

  const transitivelyReferenced = referenced
    .map(
      it =>
        modelsModule.getInterface(it) ?? modelsModule.getTypeAliasOrThrow(it),
    )
    .flatMap(it => referencedModelsIdentifiers(it, processed));

  return unique([...referenced, ...transitivelyReferenced]);
}

// all directly or transitively referenced/used `Models.[...]` are allowed to stay
const allowed = referencedModelsIdentifiers(clientClass);

// remove everything not part of the "allow list"
modelsModule
  .getInterfaces()
  .filter(it => !allowed.includes(it.getName()))
  .forEach(it => it.remove());

modelsModule
  .getTypeAliases()
  .filter(it => !allowed.includes(it.getName()))
  .forEach(it => {
    const varStmt = modelsModule.getVariableStatementOrThrow(it.getName());

    it.remove();
    varStmt.remove();
  });

project.saveSync();
