/*
 * Copyright 2026 The Backstage Authors
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

const TECHDOCS_SIDEBAR_WIDTH = '16rem';
const TECHDOCS_FOOTER_HEIGHT = '75px';

export const buiLayout = `

/*================== BUI Layout ==================*/

@media screen and (min-width: 76.25em) {
  .md-main__inner {
    display: grid;
    grid-template-columns: ${TECHDOCS_SIDEBAR_WIDTH} minmax(0, 1fr) ${TECHDOCS_SIDEBAR_WIDTH};
    column-gap: var(--bui-space-6, 1.5rem);
    align-items: start;
  }

  .md-sidebar {
    position: sticky;
    top: calc(var(--bui-header-height, 0px) + var(--bui-space-3, 0.75rem));
    bottom: auto;
    width: ${TECHDOCS_SIDEBAR_WIDTH};
    height: auto;
    max-height: calc(100dvh - var(--bui-header-height, 0px) - ${TECHDOCS_FOOTER_HEIGHT} - var(--bui-space-6, 1.5rem));
    align-self: start;
  }

  .md-sidebar--primary {
    grid-column: 1;
    grid-row: 1;
  }

  .md-sidebar--secondary {
    grid-column: 3;
    grid-row: 1;
    right: auto;
  }

  .md-sidebar .md-sidebar__scrollwrap {
    width: 100%;
    height: auto;
    max-height: inherit;
    overflow-y: auto;
  }

  .md-content {
    grid-column: 2;
    grid-row: 1;
    min-width: 0;
    max-width: none;
    margin-left: 0;
  }
}
`;
