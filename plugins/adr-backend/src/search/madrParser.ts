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

import { DateTime } from 'luxon';
import { marked } from 'marked';
import {
  MADR_DATE_FORMAT,
  parseMadrWithFrontmatter,
} from '@backstage/plugin-adr-common';

const getTitle = (tokens: marked.TokensList): string | undefined => {
  return (
    tokens.find(
      t => t.type === 'heading' && t.depth === 1,
    ) as marked.Tokens.Heading
  )?.text;
};

const getStatusForV2Format = (tokens: marked.TokensList): string | undefined =>
  (tokens.find(t => t.type === 'list') as marked.Tokens.List)?.items
    ?.find(t => /^status:/i.test(t.text))
    ?.text.replace(/^status:/i, '')
    .trim()
    .toLocaleLowerCase('en-US');

const getDateForV2Format = (tokens: marked.TokensList): string | undefined => {
  const listTokens = (tokens.find(t => t.type === 'list') as marked.Tokens.List)
    ?.items;
  const adrDateTime = listTokens
    ?.find(t => /^date:/i.test(t.text))
    ?.text.replace(/^date:/i, '')
    .trim();
  return adrDateTime;
};

const getStatus = (
  tokens: marked.TokensList,
  frontMatterStatus?: string,
): string | undefined => {
  return frontMatterStatus ?? getStatusForV2Format(tokens);
};
const getDate = (
  tokens: marked.TokensList,
  dateFormat: string,
  frontMatterDate?: string,
): string | undefined => {
  const dateString = frontMatterDate ?? getDateForV2Format(tokens);
  if (!dateString) {
    return undefined;
  }
  const date = DateTime.fromFormat(dateString, dateFormat);
  return date?.isValid ? date.toFormat(MADR_DATE_FORMAT) : undefined;
};

export const madrParser = (content: string, dateFormat = MADR_DATE_FORMAT) => {
  const preparsed = parseMadrWithFrontmatter(content);
  const tokens = marked.lexer(preparsed.content);
  if (!tokens.length) {
    throw new Error('ADR has no content');
  }

  return {
    title: getTitle(tokens),
    status: getStatus(tokens, preparsed.status),
    date: getDate(tokens, dateFormat, preparsed.date),
  };
};
