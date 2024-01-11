/*
 * Copyright 2024 The Backstage Authors
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
import fs from 'fs';
import glob from 'glob';
import i18n from 'i18next-scanner';
import { OptionValues } from 'commander';

export default async (opts: OptionValues) => {
  const parser = new i18n.Parser({
    nsSeparator: false,
    keySeparator: false,
  });
  const filePaths = glob.sync(opts.src, {
    ignore: ['**/node_modules/**', '**/*.test.tsx'],
  });
  const parseOptions = { list: ['t'] };

  filePaths.forEach(filePath => {
    parser.parseFuncFromString(
      fs.readFileSync(filePath, 'utf-8'),
      parseOptions,
    );
  });
  fs.writeFileSync(
    opts.out,
    Object.keys(parser.get().en.translation).join(',\n'),
  );
};
