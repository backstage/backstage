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

const MKDOCS_CSS = /main\.[A-Fa-f0-9]{8}\.min\.css$/;
const GOOGLE_FONTS = /^https:\/\/fonts\.googleapis\.com/;
const GSTATIC_FONTS = /^https:\/\/fonts\.gstatic\.com/;

/**
 * Checks whether a node is link or not.
 * @param node - can be any element.
 * @returns true when node is link.
 */
const isLink = (node: Element) => node.nodeName === 'LINK';

/**
 * Checks whether a link is safe or not.
 * @param node - is an link element.
 * @returns true when link is mkdocs css, google fonts or gstatic fonts.
 */
const isSafe = (node: Element) => {
  const href = node?.getAttribute('href') || '';
  const isMkdocsCss = href.match(MKDOCS_CSS);
  const isGoogleFonts = href.match(GOOGLE_FONTS);
  const isGstaticFonts = href.match(GSTATIC_FONTS);
  return isMkdocsCss || isGoogleFonts || isGstaticFonts;
};

/**
 * Function that removes unsafe link nodes.
 * @param node - can be any element.
 * @param hosts - list of allowed hosts.
 */
export const removeUnsafeLinks = (node: Element) => {
  if (isLink(node) && !isSafe(node)) {
    node.remove();
  }
  return node;
};
