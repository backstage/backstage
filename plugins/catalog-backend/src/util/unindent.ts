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

/**
 * For use in tagged templates, to remove initial indentation on all lines.
 *
 * This is convenient for specifying e.g. YAML data.
 */
export function unindent(
  strings: TemplateStringsArray,
  ...values: string[]
): string {
  // Interweave the strings with the substitution vars first
  let output = '';
  for (let i = 0; i < values.length; i++) {
    output += strings[i] + values[i];
  }
  output += strings[values.length];

  // Split on newlines
  const lines = output.split(/(?:\r\n|\n|\r)/);
  if (lines.length < 2) {
    throw new Error('Expected at least one non-empty line');
  } else if (lines[0]) {
    throw new Error('The first line must be empty');
  }

  // Second line decides indentation level
  const match = lines[1].match(/^(\s+)/);
  if (!match) {
    // There was no indentation
    return output;
  }

  const whitespace = match[1];
  return lines
    .map((line) => {
      return line.startsWith(whitespace)
        ? line.substr(whitespace.length)
        : line;
    })
    .join('\n')
    .trim();
}
