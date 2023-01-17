'use strict';
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

// @ts-check

// Note: this file is ES5, because we want to avoid having to transpile it for local development

var fs = require('fs');
var path = require('path');
/** @type {import('@manypkg/get-packages')} */
var manypkg = require('@manypkg/get-packages');

// Loads all packages in the monorepo once, and caches the result
var getPackageMap = (function () {
  var map = undefined;
  var lastLoadAt = undefined;

  /** @returns {Record<string, {dir: string, packageJson: unknown}>} */
  return function (/** @type {string} */ dir) {
    if (map) {
      // Only cache for 5 seconds, to avoid the need to reload ESLint servers
      if (Date.now() - lastLoadAt > 5000) {
        map = undefined;
      } else {
        return map;
      }
    }
    var packages = manypkg.getPackagesSync(dir).packages;
    if (!packages) {
      return undefined;
    }
    map = {};
    lastLoadAt = Date.now();
    packages.forEach(function (pkg) {
      map[pkg.packageJson.name] = pkg;
    });
    return map;
  };
})();

module.exports = {
  meta: {
    type: 'problem',
    messages: {
      forbidden: '{{packageName}} does not export {{subPath}}',
    },
  },
  create: function (/** @type import('eslint').Rule.RuleContext */ context) {
    var packageMap = getPackageMap(context.getCwd());
    if (!packageMap) {
      return;
    }

    function checkImport(node) {
      if (!node.source) {
        return;
      }
      var importPath = node.source.value;
      if (importPath[0] === '.') {
        return;
      }

      var pathParts = importPath.split('/');

      // Check for match with plain name, then namespaced name
      var name = pathParts.shift();
      if (!packageMap[name]) {
        name += '/' + pathParts.shift();
      }
      if (!packageMap[name]) {
        return;
      }

      // Empty subpaths are always allowed
      var subPath = pathParts.join('/');
      if (!subPath) {
        return;
      }

      var pkg = packageMap[name];

      // If the import is listed in the package.json exports field, we allow it
      var exp = pkg.packageJson.exports;
      if (exp && (exp[subPath] || exp['./' + subPath])) {
        return;
      }

      // If there's a package.json in the target directory, we allow the import
      if (fs.existsSync(path.resolve(pkg.dir, subPath, 'package.json'))) {
        return;
      }

      context.report({
        node: node,
        messageId: 'forbidden',
        data: {
          packageName: pkg.packageJson.name || '<unknown-package>',
          subPath: subPath,
        },
      });
    }

    return {
      ImportDeclaration: checkImport,
      ExportAllDeclaration: checkImport,
      ExportNamedDeclaration: checkImport,
      ImportExpression: checkImport,
    };
  },
};
