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

function cleanupWrongAllOfModels(modelsModule) {
  const allOfInterfaces = modelsModule
    .getInterfaces()
    .filter(i => i.getName().includes('AllOf'));
  allOfInterfaces.forEach(i => {
    const name = i.getName();
    const realName = name.replace('AllOf', '');

    const realInterface = modelsModule.getInterface(realName);
    if (realInterface) {
      i.remove();
    } else {
      i.rename(realName);
    }
  });

  const allOfTypes = modelsModule
    .getTypeAliases()
    .filter(t => t.getName().includes('AllOf'));
  allOfTypes.forEach(t => {
    const name = t.getName();
    const realName = name.replace('AllOf', '');

    const varStmt = modelsModule.getVariableStatementOrThrow(t.getName());

    const realType = modelsModule.getTypeAlias(realName);
    if (realType) {
      t.remove();
      varStmt.remove();
    } else {
      t.rename(realName);
      varStmt.getDeclarationList().getDeclarations()[0].rename(realName);
    }
  });
}

function makePaginatedGeneric(modelsModule) {
  const paginated = modelsModule.getInterface('Paginated');

  if (paginated.getTypeParameters().length === 0) {
    paginated.addTypeParameter('TResultItem');
  }

  const valuesProperty = paginated.getPropertyOrThrow('values');
  let valuesType = valuesProperty
    .getType()
    .getText()
    .replace('| null ', '')
    .replace('any[]', 'Array<TResultItem>')
    .replaceAll('any', 'TResultItem');
  if (valuesProperty.hasQuestionToken()) {
    valuesType = valuesType.replace(' | undefined', '');
  }
  valuesProperty.setType(valuesType);
}

function setPaginatedResultItemType(modelsModule) {
  modelsModule
    .getInterfaces()
    .filter(i =>
      i.getExtends().find(it => it.getExpression().getText() === 'Paginated'),
    )
    .forEach(i => {
      const paginatedExtends = i
        .getExtends()
        .find(it => it.getExpression().getText() === 'Paginated');

      const valuesProperty = i.getPropertyOrThrow('values');
      const resultItemType = valuesProperty
        .getType()
        .getUnionTypes()
        .map(it => it.getText())
        .find(it => it !== 'undefined')
        .replaceAll(/import[^ ]+.Models./g, '')
        .replace('[]', '')
        .replace(/(?:Array|Set)<(.*)>/, '$1');

      paginatedExtends.setExpression(`Paginated<${resultItemType}>`);
    });
}

const project = new tsMorph.Project({
  tsConfigFilePath: '../../tsconfig.json',
  skipAddingFilesFromTsConfig: true,
});
project.addSourceFilesAtPaths('src/**');

const modelsFile = project.getSourceFile('src/models/index.ts');
const modelsModule = modelsFile.getModuleOrThrow('Models');

cleanupWrongAllOfModels(modelsModule);
makePaginatedGeneric(modelsModule);
setPaginatedResultItemType(modelsModule);

project.saveSync();
