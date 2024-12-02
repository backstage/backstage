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

import React from 'react';
import {
  container,
  box,
  content,
  title,
  description,
  whiteBox,
  whiteBoxStack,
  stack,
  verticalDivider,
  horizontalDivider,
  columns,
  inline,
  tiles,
  whiteBoxColumns,
  whiteBoxInline,
  whiteBoxTiles,
} from './layout-components.css';

export const LayoutComponents = () => {
  return (
    <div className={container}>
      <div className={box}>
        <a className={content} href="/?path=/docs/components-box--docs">
          <div className={whiteBox} />
        </a>
        <div className={title}>Box</div>
        <div className={description}>The most basic layout component.</div>
      </div>
      <div className={box}>
        <a
          className={`${content} ${stack}`}
          href="/?path=/docs/components-stack--docs"
        >
          <div className={whiteBoxStack} />
          <div className={verticalDivider} />
          <div className={whiteBoxStack} />
        </a>
        <div className={title}>Stack</div>
        <div className={description}>Arrange your components vertically.</div>
      </div>
      <div className={box}>
        <a
          className={`${content} ${columns}`}
          href="/?path=/docs/components-columns--docs"
        >
          <div className={whiteBoxColumns} />
          <div className={horizontalDivider} />
          <div className={whiteBoxColumns} />
        </a>
        <div className={title}>Columns</div>
        <div className={description}>Arrange your components horizontally.</div>
      </div>
      <div className={box}>
        <a className={content} href="/?path=/docs/components-inline--docs">
          <div className={inline}>
            <div className={whiteBoxInline} />
            <div className={whiteBoxInline} />
            <div className={whiteBoxInline} />
            <div className={whiteBoxInline} />
            <div className={whiteBoxInline} />
            <div className={whiteBoxInline} />
            <div className={whiteBoxInline} />
            <div className={whiteBoxInline} />
            <div className={whiteBoxInline} />
            <div className={whiteBoxInline} />
            <div className={whiteBoxInline} />
            <div className={whiteBoxInline} />
          </div>
        </a>
        <div className={title}>Inline</div>
        <div className={description}>Arrange your components in a row.</div>
      </div>
      <div className={box}>
        <a className={content} href="/?path=/docs/components-tiles--docs">
          <div className={tiles}>
            <div className={whiteBoxTiles} />
            <div className={whiteBoxTiles} />
            <div className={whiteBoxTiles} />
            <div className={whiteBoxTiles} />
            <div className={whiteBoxTiles} />
            <div className={whiteBoxTiles} />
            <div className={whiteBoxTiles} />
            <div className={whiteBoxTiles} />
          </div>
        </a>
        <div className={title}>Tiles</div>
        <div className={description}>Arrange your components in a grid.</div>
      </div>
    </div>
  );
};
