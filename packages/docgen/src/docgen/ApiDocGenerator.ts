/*
 * Copyright 2020 Spotify AB
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

import ts from 'typescript';
import { relative } from 'path';
import {
  ExportedInstance,
  ApiDoc,
  InterfaceInfo,
  FieldInfo,
  TypeInfo,
  TypeLink,
} from './types';
import { flatMap } from './flatMap';

/**
 * The ApiDocGenerator uses the typescript compiler API to build the data structure that
 * describes a Backstage API and all of it's related types.
 *
 * It receives an exported instance that of the form
 * `export name = new Api<Interface>({id: ..., description: ...})`.
 * It will then traverse all fields and methods on the interface type, and also
 * types and declaration of all types that are used by those, both directly and indirectly.
 * While traversing, it collects information such as names, location in source, docs, etc.
 */
export default class ApiDocGenerator {
  static fromProgram(
    program: ts.Program,
    basePath: string,
    sourcePath: string,
  ) {
    return new ApiDocGenerator(program.getTypeChecker(), basePath, sourcePath);
  }

  constructor(
    private readonly checker: ts.TypeChecker,
    private readonly basePath: string,
    private readonly sourcePath: string,
  ) {}

  toDoc(apiInstance: ExportedInstance): ApiDoc {
    const { name, source, args, typeArgs } = apiInstance;

    const [info] = args;
    if (!ts.isObjectLiteralExpression(info)) {
      throw new Error('api info is not an object literal');
    }

    const id = this.getObjectPropertyLiteral(info, 'id');
    const description = this.getObjectPropertyLiteral(info, 'description');
    const interfaceInfo = this.getInterfaceInfo(typeArgs[0]);
    if (!interfaceInfo) {
      throw new Error('api has no info type argument');
    }

    return { id, name, source, description, interfaceInfo };
  }

  private getNodeDocs(node: ts.Node): string[] {
    const docNodes = ((node && (node as any).jsDoc) || []) as ts.JSDoc[];
    const docs = docNodes.map(docNode => docNode.comment || '').filter(Boolean);
    return docs;
  }

  private getInterfaceInfo(typeNode: ts.TypeNode): InterfaceInfo {
    if (ts.isTypeQueryNode(typeNode)) {
      throw new Error(
        'APIs must have a proper type parameter, TypeQueries are now allowed',
      );
    }
    if (!ts.isTypeReferenceNode(typeNode)) {
      throw new Error('Interface is not a type node');
    }

    const type = this.checker.getTypeFromTypeNode(typeNode);
    const interfaceMembers = type.symbol.members as Map<string, ts.Symbol>;
    if (!interfaceMembers) {
      throw new Error('Interface does not have any members');
    }
    const name = (type.aliasSymbol || type.symbol).name;
    const [declaration] = (type.aliasSymbol || type.symbol).declarations;
    const sourceFile = declaration.getSourceFile();
    const file = relative(this.basePath, sourceFile.fileName);
    const { line } = sourceFile.getLineAndCharacterOfPosition(
      declaration.getStart(),
    );
    const docs = this.getNodeDocs(declaration);

    const membersAndTypes = flatMap(
      Array.from(interfaceMembers.values()),
      fieldSymbol => this.getMemberInfo(name, fieldSymbol),
    );

    const members = membersAndTypes.map(t => t.member);
    const dependentTypes = this.flattenTypes(
      flatMap(membersAndTypes, t => t.dependentTypes),
    );

    return { name, docs, file, lineInFile: line + 1, members, dependentTypes };
  }

  private getObjectPropertyLiteral(
    objectLiteral: ts.ObjectLiteralExpression,
    propertyName: string,
  ): string {
    const prop = objectLiteral.properties.filter(
      prop =>
        ts.isPropertyAssignment(prop) &&
        ts.isIdentifier(prop.name) &&
        prop.name.text === propertyName,
    )[0] as ts.PropertyAssignment;

    if (!prop) {
      throw new Error(`no identifier found for property ${propertyName}`);
    }

    const { initializer } = prop;
    if (!ts.isStringLiteral(initializer)) {
      throw new Error(`no string literal for ${propertyName}`);
    }

    return initializer.text;
  }

  private getMemberInfo(
    parentName: string,
    symbol: ts.Symbol,
  ): { member: FieldInfo; dependentTypes: TypeInfo[] } {
    const declaration = symbol.valueDeclaration;

    const { links, infos: dependentTypes } = this.findAllTypeReferences(
      declaration,
    );

    let type: FieldInfo['type'] = 'prop';
    if (
      ts.isPropertySignature(declaration) &&
      declaration.type &&
      ts.isFunctionTypeNode(declaration.type)
    ) {
      type = 'method';
    } else if (ts.isMethodSignature(declaration)) {
      type = 'method';
    }

    return {
      member: {
        type,
        name: symbol.name,
        path: `${parentName}.${symbol.name}`,
        text: declaration.getText().replace(/;$/, ''),
        docs: this.getNodeDocs(declaration),
        links: this.recalculateLinkOffsets(declaration, links),
      },
      dependentTypes,
    };
  }

  private findAllTypeReferences = (
    node: ts.Node | undefined,
    visited: Set<ts.Node> = new Set(),
  ): { links: TypeLink[]; infos: TypeInfo[] } => {
    if (!node || visited.has(node)) {
      return { links: [], infos: [] };
    }
    // This makes sure we don't end up in a loop.
    // It doesn't exclude repeated types, e.g. Array<Array<MyType>>, since we're exiting on duplicate nodes, not types.
    visited.add(node);

    const children = flatMap(node.getChildren(), child =>
      this.findAllTypeReferences(child, visited),
    );

    if (!ts.isTypeReferenceNode(node)) {
      return {
        links: flatMap(children, child => child.links),
        infos: flatMap(children, child => child.infos),
      };
    }

    const type = this.checker.getTypeFromTypeNode(node);

    const info = this.validateTypeDeclaration(type);
    if (!info) {
      return {
        links: flatMap(children, child => child.links),
        infos: flatMap(children, child => child.infos),
      };
    }
    const { symbol, declaration } = info;

    const typeRefs = this.findAllTypeReferences(declaration, visited);

    const sourceFile = declaration.getSourceFile();
    const { line } = sourceFile.getLineAndCharacterOfPosition(
      declaration.getStart(),
    );
    const file = relative(this.basePath, sourceFile.fileName);
    const typeInfo = {
      id: (symbol as any).id,
      name: symbol.name,
      text: declaration.getText().replace(/;$/, ''),
      docs: this.getNodeDocs(declaration),
      path: `${file}/${symbol.name}`,
      file,
      lineInFile: line + 1, // TS line is 0-based
      links: this.recalculateLinkOffsets(declaration, typeRefs.links),
      children: typeRefs.infos,
    };

    const link = {
      id: typeInfo.id,
      path: typeInfo.path,
      name: typeInfo.name,
      location: [node.getStart(), node.getEnd()] as const,
    };

    return {
      links: [link, ...flatMap(children, child => child.links)],
      infos: [typeInfo, ...flatMap(children, child => child.infos)],
    };
  };

  private validateTypeDeclaration(
    type: ts.Type | undefined,
  ): undefined | { symbol: ts.Symbol; declaration: ts.Declaration } {
    if (!type) {
      return;
    }
    const symbol = type.aliasSymbol || type.symbol;
    if (!symbol) {
      return;
    }

    const [declaration] = symbol.declarations;

    // Don't generate standalone infos for type paramters
    if (ts.isTypeParameterDeclaration(declaration)) {
      return;
    }

    if (!declaration.getSourceFile().fileName.startsWith(this.sourcePath)) {
      return;
    }

    return { symbol, declaration };
  }

  private flattenTypes(descs: TypeInfo[]): TypeInfo[] {
    function getChildren(parent: TypeInfo): TypeInfo[] {
      return [
        {
          ...parent,
          children: [],
        },
        ...flatMap(parent.children, getChildren),
      ];
    }

    const flatDescs = flatMap(descs, getChildren);
    const seenTypes = new Set<number>();
    return flatDescs.filter(desc => {
      if (seenTypes.has(desc.id)) {
        return false;
      }
      seenTypes.add(desc.id);
      return true;
    });
  }

  private recalculateLinkOffsets(
    parent: ts.Node,
    links: TypeLink[],
  ): TypeLink[] {
    const parentStart = parent.getStart();
    return links.map(link => {
      const [start, end] = link.location;
      return {
        ...link,
        location: [start - parentStart, end - parentStart],
      };
    });
  }
}
