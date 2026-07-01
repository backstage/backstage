/*
 * Copyright 2020 The Backstage Authors
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

import fs from 'fs-extra';
import type * as TsJsonSchemaGenerator from 'ts-json-schema-generator';
import type * as TypeScript from 'typescript';
import { createHash } from 'node:crypto';
import {
  resolve as resolvePath,
  relative as relativePath,
  dirname,
  sep,
} from 'node:path';
import { ConfigSchemaPackageEntry } from './types';
import type { JsonObject } from '@backstage/types';

type Item = {
  name?: string;
  parentPath?: string;
  packagePath?: string;
};

const req =
  typeof __non_webpack_require__ === 'undefined'
    ? require
    : __non_webpack_require__;

/**
 * Exported for test mocking. Jest 30's module resolver has issues with
 * nested node_modules, requiring tests to use an alternative resolution strategy.
 * @internal
 */
export const internal = {
  resolvePackagePath(name: string, options?: { paths: string[] }): string {
    return req.resolve(name, options);
  },
};

/**
 * This collects all known config schemas across all dependencies of the app.
 */
export async function collectConfigSchemas(
  packageNames: string[],
  packagePaths: string[],
  options?: { excludePackageDependencies?: boolean },
): Promise<ConfigSchemaPackageEntry[]> {
  const schemas = new Array<ConfigSchemaPackageEntry>();
  const tsSchemaPaths = new Array<{ packageName: string; path: string }>();
  const visitedPackageVersions = new Map<string, Set<string>>(); // pkgName: [versions...]

  const currentDir = await fs.realpath(process.cwd());

  async function processItem(item: Item) {
    let pkgPath = item.packagePath;

    if (pkgPath) {
      const pkgExists = await fs.pathExists(pkgPath);
      if (!pkgExists) {
        return;
      }
    } else if (item.name) {
      const { name, parentPath } = item;

      try {
        pkgPath = internal.resolvePackagePath(
          `${name}/package.json`,
          parentPath ? { paths: [parentPath] } : undefined,
        );
      } catch {
        // We can somewhat safely ignore packages that don't export package.json,
        // as they are likely not part of the Backstage ecosystem anyway.
      }
    }
    if (!pkgPath) {
      return;
    }

    const pkg = await fs.readJson(pkgPath);

    // Ensures that we only process the same version of each package once.
    let versions = visitedPackageVersions.get(pkg.name);
    if (versions?.has(pkg.version)) {
      return;
    }
    if (!versions) {
      versions = new Set();
      visitedPackageVersions.set(pkg.name, versions);
    }
    versions.add(pkg.version);

    const depNames = [
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.devDependencies ?? {}),
      ...Object.keys(pkg.optionalDependencies ?? {}),
      ...Object.keys(pkg.peerDependencies ?? {}),
    ];

    // TODO(Rugvip): Trying this out to avoid having to traverse the full dependency graph,
    //               since that's pretty slow. We probably need a better way to determine when
    //               we've left the Backstage ecosystem, but this will do for now.
    const hasSchema = 'configSchema' in pkg;
    const hasBackstageDep = depNames.some(_ => _.startsWith('@backstage/'));
    if (!hasSchema && !hasBackstageDep) {
      return;
    }
    if (hasSchema) {
      if (typeof pkg.configSchema === 'string') {
        const isJson = pkg.configSchema.endsWith('.json');
        const isDts = pkg.configSchema.endsWith('.d.ts');
        if (!isJson && !isDts) {
          throw new Error(
            `Config schema files must be .json or .d.ts, got ${pkg.configSchema}`,
          );
        }
        if (isDts) {
          tsSchemaPaths.push({
            path: relativePath(
              currentDir,
              resolvePath(dirname(pkgPath), pkg.configSchema),
            ),
            packageName: pkg.name,
          });
        } else {
          const path = resolvePath(dirname(pkgPath), pkg.configSchema);
          const value = await fs.readJson(path);
          schemas.push({
            packageName: pkg.name,
            value,
            path: relativePath(currentDir, path),
          });
        }
      } else {
        schemas.push({
          packageName: pkg.name,
          value: pkg.configSchema,
          path: relativePath(currentDir, pkgPath),
        });
      }
    }

    if (!options?.excludePackageDependencies) {
      await Promise.all(
        depNames.map(depName =>
          processItem({ name: depName, parentPath: pkgPath }),
        ),
      );
    }
  }

  await Promise.all([
    ...packageNames.map(name => processItem({ name, parentPath: currentDir })),
    ...packagePaths.map(path => processItem({ name: path, packagePath: path })),
  ]);

  const tsSchemas = await compileTsSchemas(tsSchemaPaths);
  const allSchemas = schemas.concat(tsSchemas);

  const hasBackendDefaults = allSchemas.some(
    ({ packageName }) => packageName === '@backstage/backend-defaults',
  );

  if (hasBackendDefaults) {
    // We filter out backend-common schemas here to avoid issues with
    // schema merging over different versions of the same schema.
    // led to issues such as https://github.com/backstage/backstage/issues/28170
    return allSchemas.filter(
      ({ packageName }) => packageName !== '@backstage/backend-common',
    );
  }

  return allSchemas;
}

function namespaceSchemaDefinitions(
  schema: JsonObject,
  namespace: string,
): JsonObject {
  const definitions = schema.definitions;
  if (
    !definitions ||
    typeof definitions !== 'object' ||
    Array.isArray(definitions) ||
    Object.keys(definitions).length === 0
  ) {
    delete schema.definitions;
    return schema;
  }

  const renamedDefinitions = Object.fromEntries(
    Object.entries(definitions).map(([name, definition]) => [
      `${namespace}-${name}`,
      definition,
    ]),
  );
  const renamedRefs = new Map<string, string>();
  for (const name of Object.keys(definitions)) {
    const renamed = `${namespace}-${name}`;
    renamedRefs.set(`#/definitions/${name}`, `#/definitions/${renamed}`);
    renamedRefs.set(
      `#/definitions/${encodeURIComponent(name)}`,
      `#/definitions/${encodeURIComponent(renamed)}`,
    );
  }

  function rewriteRefs(value: unknown): void {
    if (Array.isArray(value)) {
      value.forEach(rewriteRefs);
      return;
    }
    if (!value || typeof value !== 'object') {
      return;
    }

    const object = value as Record<string, unknown>;
    if (typeof object.$ref === 'string') {
      object.$ref = renamedRefs.get(object.$ref) ?? object.$ref;
    }
    Object.values(object).forEach(rewriteRefs);
  }

  schema.definitions = renamedDefinitions;
  rewriteRefs(schema);
  return schema;
}

function parseNestedSchemaAnnotation(annotation: unknown) {
  if (typeof annotation !== 'string') {
    return undefined;
  }

  const match = annotation.match(/^\.([\w-]+)\s+([\s\S]+)$/);
  if (!match) {
    return undefined;
  }

  const [, key, text] = match;
  let value: unknown = text.trim();
  try {
    value = JSON.parse(value as string);
  } catch {
    // Plain strings such as visibility values are not JSON encoded.
  }
  return { key, value };
}

// This handles the support of TypeScript .d.ts config schema declarations.
// We collect all TypeScript schema definitions and compile them in one shared
// program, which avoids repeatedly resolving and parsing imported types.
async function compileTsSchemas(
  entries: { path: string; packageName: string }[],
) {
  if (entries.length === 0) {
    return [];
  }

  // Lazy loaded, because these bring up all of TypeScript and we don't want
  // that eagerly loaded when collecting JSON schemas.
  const ts: typeof TypeScript = require('typescript');
  const {
    AnnotatedTypeFormatter,
    createFormatter,
    createParser,
    DEFAULT_CONFIG,
    SchemaGenerator,
  }: typeof TsJsonSchemaGenerator = require('ts-json-schema-generator');

  const currentDir = process.cwd();
  const rootNames = entries.map(({ path }) => resolvePath(currentDir, path));
  const compilerOptions: TypeScript.CompilerOptions = {
    incremental: false,
    jsx: ts.JsxEmit.Preserve,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    noEmit: true,
    noResolve: false,
    skipDefaultLibCheck: true,
    skipLibCheck: false,
    strict: true,
    target: ts.ScriptTarget.ES2022,
    types: [],
  };

  const program = ts.createProgram(rootNames, compilerOptions);
  const diagnostics = [
    ...program.getOptionsDiagnostics(),
    ...program.getGlobalDiagnostics(),
    ...rootNames.flatMap(rootName => {
      const sourceFile = program.getSourceFile(rootName);
      return sourceFile
        ? [
            ...program.getSyntacticDiagnostics(sourceFile),
            ...program.getSemanticDiagnostics(sourceFile),
          ]
        : [];
    }),
  ];
  if (diagnostics.length > 0) {
    const message = ts.formatDiagnostics(diagnostics, {
      getCanonicalFileName: fileName => fileName,
      getCurrentDirectory: () => currentDir,
      getNewLine: () => '\n',
    });
    throw new Error(`Invalid TypeScript configuration schema:\n${message}`);
  }

  const generatorConfig = {
    ...DEFAULT_CONFIG,
    additionalProperties: true,
    expose: 'none' as const,
    extraTags: ['visibility', 'deepVisibility', 'deprecated', 'items'],
    jsDoc: 'extended' as const,
    skipTypeCheck: true,
    topRef: false,
    tsProgram: program,
  };
  const parser = createParser(program, generatorConfig);
  class NestedAnnotationsFormatter extends AnnotatedTypeFormatter {
    override getDefinition(type: TsJsonSchemaGenerator.AnnotatedType) {
      const annotations = type.getAnnotations();
      const itemsAnnotation = annotations.items;
      const nestedItems = parseNestedSchemaAnnotation(itemsAnnotation);
      if (!nestedItems) {
        return super.getDefinition(type);
      }

      delete annotations.items;
      try {
        const definition = super.getDefinition(type);
        const items = definition.items;
        if (items && typeof items === 'object' && !Array.isArray(items)) {
          Object.assign(items, { [nestedItems.key]: nestedItems.value });
        }
        return definition;
      } finally {
        annotations.items = itemsAnnotation;
      }
    }
  }
  const formatter = createFormatter(
    generatorConfig,
    (chainFormatter, circularReferenceFormatter) => {
      chainFormatter.addTypeFormatter(
        new NestedAnnotationsFormatter(circularReferenceFormatter),
      );
    },
  );
  const generator = new SchemaGenerator(
    program,
    parser,
    formatter,
    generatorConfig,
  );

  const tsSchemas = entries.map(({ path, packageName }, index) => {
    const sourceFile = program.getSourceFile(rootNames[index]);
    if (!sourceFile) {
      throw new Error(`Invalid schema in ${path}, missing Config export`);
    }
    const configNode = sourceFile.statements.find(
      statement =>
        (ts.isInterfaceDeclaration(statement) ||
          ts.isTypeAliasDeclaration(statement)) &&
        statement.name.text === 'Config',
    );
    if (!configNode) {
      throw new Error(`Invalid schema in ${path}, missing Config export`);
    }

    const namespace = createHash('sha256')
      .update(packageName)
      .update('\0')
      .update(path.split(sep).join('/'))
      .digest('hex');
    const value = namespaceSchemaDefinitions(
      structuredClone(
        generator.createSchemaFromNodes([configNode]),
      ) as JsonObject,
      namespace,
    );

    return { path, value, packageName };
  });

  return tsSchemas;
}
