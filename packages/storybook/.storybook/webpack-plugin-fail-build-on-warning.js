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

class WebpackPluginFailBuildOnWarning {
  // Ignore the following warnings in the Webpack build.
  warningsWhitelist = new Set([
    'AssetsOverSizeLimitWarning',
    'EntrypointsOverSizeLimitWarning',
    'NoAsyncChunksWarning',
  ]);

  /* Entry point for the Webpack plugin. */
  apply(compiler) {
    // Invoke plugin logic when Webpack build is 'done'.
    compiler.hooks.done.tap('FailBuildOnWarning', this.execute.bind(this));
  }

  execute(stats) {
    // All the compilation warnings are stored in stats.compilation.warnings
    let warnings = stats.compilation.warnings;
    if (warnings.length > 0) {
      // Throw error if there are unexpected warnings.
      for (let warning of warnings) {
        if (!this.warningsWhitelist.has(warning.name)) {
          process.on('beforeExit', () => {
            console.log(
              `You have some unexpected warning(s) in your webpack build. Exiting process as error.`,
            );
            process.exit(1);
          });
          // No need to go over the rest of warnings from here.
          break;
        }
      }
    }
  }
}

module.exports = WebpackPluginFailBuildOnWarning;
