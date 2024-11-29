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

import { RuleOptions } from './types';

type RuleTypography = RuleOptions['theme']['typography'];

type BackstageTypography = RuleTypography & {
  htmlFontSize?: number;
};

type TypographyHeadings = Pick<
  RuleTypography,
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
>;

type TypographyHeadingsKeys = keyof TypographyHeadings;

const headings: TypographyHeadingsKeys[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const relativeLengthUnit: RegExp = /(em)|(rem)/gi;
const cssVariable: RegExp = /var\(|\)/gi;

export default ({ theme }: RuleOptions) => `
/*==================  Typeset  ==================*/

.md-typeset {
  font-size: var(--md-typeset-font-size);
}

${headings.reduce<string>((style, heading) => {
  const htmlFontSize =
    (theme.typography as BackstageTypography).htmlFontSize ?? 16;
  const styles = theme.typography[heading];
  const { lineHeight, fontFamily, fontWeight, fontSize } = styles;
  const calculate = (value: typeof fontSize): string | undefined => {
    if (typeof value === 'number') {
      // Convert px to rem and apply 60% factor
      return calculate(`${(value / htmlFontSize) * 0.6}rem`);
    } else if (typeof value === 'string') {
      if (value.match(cssVariable)) {
        // Resolve css variable and calculate recursively
        const resolvedValue = window
          .getComputedStyle(document.body)
          .getPropertyValue(value.replaceAll(cssVariable, ''));
        if (resolvedValue !== '') {
          return calculate(resolvedValue);
        }
      } else if (value.match(relativeLengthUnit)) {
        // Use relative size as factor
        const factor = value.replace(relativeLengthUnit, '');
        return `calc(${factor} * var(--md-typeset-font-size))`;
      }
    }
    // Value is not a number, relative length unit, or CSS variable, return as is
    return value;
  };
  return style.concat(`
    .md-typeset ${heading} {
      color: var(--md-default-fg-color);
      line-height: ${lineHeight};
      font-family: ${fontFamily};
      font-weight: ${fontWeight};
      font-size: ${calculate(fontSize)};
    }
  `);
}, '')}

.md-typeset .md-content__button {
  color: var(--md-default-fg-color);
}

.md-typeset hr {
  border-bottom: 0.05rem dotted ${theme.palette.divider};
}

.md-typeset details {
  font-size: var(--md-typeset-font-size) !important;
}
.md-typeset details summary {
  padding-left: 2.5rem !important;
}
.md-typeset details summary:before,
.md-typeset details summary:after {
  top: 50% !important;
  width: 20px !important;
  height: 20px !important;
  transform: rotate(0deg) translateY(-50%) !important;
}
.md-typeset details[open] > summary:after {
  transform: rotate(90deg) translateX(-50%) !important;
}

.md-typeset blockquote {
  color: var(--md-default-fg-color--light);
  border-left: 0.2rem solid var(--md-default-fg-color--light);
}

.md-typeset table:not([class]) {
  font-size: var(--md-typeset-font-size);
  border: 1px solid var(--md-default-fg-color);
  border-bottom: none;
  border-collapse: collapse;
  border-radius: ${theme.shape.borderRadius}px;
}
.md-typeset table:not([class]) th {
  font-weight: bold;
}
.md-typeset table:not([class]) td, .md-typeset table:not([class]) th {
  border-bottom: 1px solid var(--md-default-fg-color);
}

.md-typeset pre > code::-webkit-scrollbar-thumb {
  background-color: hsla(0, 0%, 0%, 0.32);
}
.md-typeset pre > code::-webkit-scrollbar-thumb:hover {
  background-color: hsla(0, 0%, 0%, 0.87);
}

.md-typeset code {
  word-break: keep-all;
}
`;
