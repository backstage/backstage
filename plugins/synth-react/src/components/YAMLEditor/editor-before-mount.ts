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
import type { Monaco } from '@monaco-editor/react';

export const LanguageId = 'yaml';

export function handleEditorWillMount(monaco: Monaco) {
  monaco.languages.setLanguageConfiguration(LanguageId, {
    comments: {
      lineComment: '#',
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')'],
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],

    onEnterRules: [
      {
        beforeText: /:\s*$/,
        action: { indentAction: monaco.languages.IndentAction.Indent },
      },
    ],
  });

  monaco.languages.register({
    id: LanguageId,
    extensions: ['.yaml', '.yml'],
    aliases: ['YAML', 'yaml', 'YML', 'yml'],
    mimetypes: ['application/x-yaml'],
  });
}
