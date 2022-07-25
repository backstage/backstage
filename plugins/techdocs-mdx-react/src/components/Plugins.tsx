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

import useAsync from 'react-use/lib/useAsync';

import { withStyles } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkEmoji from 'remark-emoji';
import remarkDirective from 'remark-directive';
// @ts-ignore
import remarkPlantuml from '@akebifiky/remark-simple-plantuml';

import remarkFrontmatter from 'remark-frontmatter';
import { parse } from 'yaml';

import rehypeSlug from 'rehype-slug';
import rehypeKatex from 'rehype-katex';

import { visit } from 'unist-util-visit';
import { h } from 'hastscript';

import Slugger from 'github-slugger';

const slugs = new Slugger();

const remarkToc = () => {
  return (tree: any, file: any) => {
    file.data.headings = [];
    visit(tree, node => {
      if (node.type === 'heading') {
        const depth = node.depth;
        let text = '';
        visit(node, childNode => {
          if (childNode.type === 'text') {
            text += childNode.value;
          }
        });
        file.data.headings.push({ text, depth, id: slugs.slug(text) });
      }
    });
  };
};

const remarkTitle = () => {
  let yaml = { title: '' };
  return (tree: any) => {
    visit(tree, node => {
      if (node.type === 'yaml') {
        yaml = parse(node.value);
      }
    });
    if (yaml.title) {
      tree.children.unshift({
        type: 'heading',
        depth: 1,
        children: [{ type: 'text', value: yaml.title }],
      });
    }
  };
};

const remarkAdmonitions = () => {
  return (tree: any) => {
    visit(tree, node => {
      if (
        node.type === 'textDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'containerDirective'
      ) {
        if (node.name !== 'note') return;

        const data = node.data || (node.data = {});
        const tagName = 'Admonition';

        data.hName = tagName;
        data.hProperties = h(tagName, node.attributes).properties;
      }
    });
  };
};

export const Admonition = withStyles(theme => ({
  root: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
}))(Alert);

const KETEX_STYLE_URL =
  'https://cdn.jsdelivr.net/npm/katex@0.15.0/dist/katex.min.css';
const useKetexStyle = () => {
  useAsync(async () => {
    if (!document.getElementById('ketex')) {
      const response = await fetch(KETEX_STYLE_URL);
      const text = await response.text();
      document
        .getElementsByTagName('head')[0]
        .insertAdjacentHTML(
          'beforeend',
          `<style id="ketex">${text.concat(
            '.katex-display>.katex{text-align:left;}',
          )}</style>`,
        );
    }
  }, []);
};

const plugins = {
  remarkPlugins: [
    remarkGfm,
    remarkMath,
    remarkEmoji,
    remarkPlantuml,
    remarkDirective,
    remarkAdmonitions,
    remarkFrontmatter,
    remarkTitle,
    remarkToc,
  ],
  rehypePlugins: [rehypeSlug, rehypeKatex],
};

export const usePlugins = () => {
  useKetexStyle();
  return plugins;
};
