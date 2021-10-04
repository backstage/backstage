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

module.exports = (file, /** @type {import('jscodeshift').API} */ api) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Find all variables set to *.provide() with an invocation of an extension
  // creator as its first argument.
  // For example: somePlugin.provide(createReactExtension({}))
  const extensionCreators = [
    'createReactExtension',
    'createComponentExtension',
    'createRoutableExtension',
  ];
  const extensions = root
    .findVariableDeclarators()
    .filter(
      n =>
        n.node.init?.type === 'CallExpression' &&
        n.node.init?.callee.type === 'MemberExpression' &&
        n.node.init?.callee?.property.name === 'provide' &&
        n.node.init?.arguments.length === 1 &&
        extensionCreators.includes(n.node.init?.arguments[0].callee?.name),
    );

  // Abort if no such variable declarations exist in this file.
  if (extensions.size === 0) {
    return undefined;
  }

  // For each variable, parse out its name and apply the name as the value of
  // the "name" key on the argument passed to the extension creator's argument.
  // For example: createReactExtension({ name: 'Some Extension' })
  let numberAffected = 0;
  extensions.nodes().flatMap(node => {
    const creatorArgObject = node.init?.arguments[0].arguments[0];
    const hasNameKeyAlready =
      creatorArgObject.properties.filter(p => p.key.name === 'name').length ===
      1;
    const nameProp = j.objectProperty(
      j.identifier('name'),
      j.literal(node.id.name),
    );

    // Apply this change only once.
    if (!hasNameKeyAlready) {
      numberAffected++;
      creatorArgObject.properties.unshift(nameProp);
    }
  });

  // Abort if no changes were made.
  if (numberAffected === 0) {
    return undefined;
  }

  // Check for code styles to be applied to this file.
  const useSingleQuote =
    root.find(j.ImportDeclaration).nodes()[0]?.source.extra.raw[0] === "'";
  const useTrailingComma = root
    .find(j.ObjectExpression)
    .nodes()[0]
    ?.extra?.hasOwnProperty('trailingComma');

  return root.toSource({
    quote: useSingleQuote ? 'single' : 'double',
    trailingComma: useTrailingComma,
  });
};
