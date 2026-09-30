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

const TECHDOCS_SIDEBAR_WIDTH = '16rem';

export default ({ theme }: RuleOptions) => `

/*==================  Layout  ==================*/

/* Let sticky reader elements use the host page viewport as their scrollport. */
html {
  overflow: visible;
}

/* mkdocs material v9 compat */
.md-nav__title {
  color: var(--md-default-fg-color);
}

.md-grid {
  max-width: 100%;
  margin: 0;
}

.md-nav {
  font-size: calc(var(--md-typeset-font-size) * 0.9);
}
.md-nav__link:not(:has(svg)) {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.md-nav__link:has(svg) > .md-ellipsis {
  flex-grow: 1;
}
.md-nav__icon {
  height: 20px !important;
  width: 20px !important;
  margin-left:${theme.spacing(1)}px;
}
.md-nav__icon svg {
  margin: 0;
  width: 20px !important;
  height: 20px !important;
}
.md-nav__icon:after {
  width: 20px !important;
  height: 20px !important;
}
.md-status--updated::after {
  -webkit-mask-image: var(--md-status--updated);
  mask-image: var(--md-status--updated);
}

.md-nav__item--active > .md-nav__link, a.md-nav__link--active {
  text-decoration: underline;
  color: var(--md-typeset-a-color);
}
.md-nav__link--active > .md-status:after {
  background-color: var(--md-typeset-a-color);
}
.md-nav__link[href]:hover > .md-status:after {
  background-color: var(--md-accent-fg-color);
}

.md-main__inner {
  display: grid;
  grid-template-columns: minmax(0, ${TECHDOCS_SIDEBAR_WIDTH}) minmax(0, 1fr) minmax(0, ${TECHDOCS_SIDEBAR_WIDTH});
  align-items: start;
  column-gap: var(--bui-space-6, 24px);
  margin-top: 0;
}

.md-sidebar {
  align-self: start;
  width: 100%;
  height: auto;
  overflow-x: hidden;
}
.md-sidebar--primary {
  grid-column: 1;
  grid-row: 1;
}
.md-sidebar .md-sidebar__scrollwrap {
  width: 100%;
  overflow-y: visible;
}
@media screen and (min-width: 76.1875em) {
  .md-sidebar {
    position: sticky;
    top: var(--bui-space-3, 12px);
    max-height: calc(100dvh - var(--bui-space-6, 24px));
    overflow-y: auto;
    /* Keep short MkDocs navigation within the sidebar's intrinsic scroll box. */
    padding-bottom: var(--bui-space-3, 12px) !important;
  }
  .md-sidebar--primary .md-nav--primary > .md-nav__title {
    position: static;
  }
}
.md-sidebar--secondary {
  grid-column: 3;
  grid-row: 1;
  right: auto;
}

.md-content {
  grid-column: 2;
  grid-row: 1;
  min-width: 0;
  max-width: none;
  margin-left: 0;
  margin-bottom: calc(var(--techdocs-footer-height, 75px) + var(--bui-space-4, 16px));
}

/*
 * The footer is moved to the final full-width grid row. Its natural position
 * is below the document content, allowing the sticky bottom constraint to
 * keep it at the viewport bottom while the grid bounds it at the document end.
 */
.md-footer {
  grid-column: 1 / -1;
  grid-row: 2;
  align-self: end;
  position: sticky;
  bottom: 0;
  height: var(--techdocs-footer-height, 75px);
  width: 100%;
  padding-left: 0;
  z-index: 1;
  pointer-events: none;
}

.md-footer-nav__link, .md-footer__link {
  pointer-events: all;
  width: ${TECHDOCS_SIDEBAR_WIDTH};
}

.md-footer__title {
  background-color: unset;
}

.md-dialog {
  background-color: unset;
}

@media screen and (max-width: 76.1875em) {
  .md-main__inner {
    display: block;
    min-height: 0;
  }

  .md-nav {
    transition: none !important;
    background-color: var(--md-default-bg-color)
  }
  .md-nav--primary .md-nav__title {
    cursor: auto;
    color: var(--md-default-fg-color);
    font-weight: 700;
    white-space: normal;
    line-height: 1rem;
    height: auto;
    display: flex;
    flex-flow: column;
    row-gap: 1.6rem;
    padding: 1.2rem .8rem .8rem;
    background-color: var(--md-default-bg-color);
  }
  .md-nav--primary .md-nav__title~.md-nav__list {
    box-shadow: none;
  }
  .md-nav--primary .md-nav__title ~ .md-nav__list > :first-child {
    border-top: none;
  }
  .md-nav--primary .md-nav__title .md-nav__button {
    display: none;
  }
  .md-nav--primary .md-nav__title .md-nav__icon {
    color: var(--md-default-fg-color);
    position: static;
    height: auto;
    margin: 0 0 0 -0.2rem;
  }
  .md-nav--primary > .md-nav__title [for="none"] {
    padding-top: 0;
  }
  .md-nav--primary .md-nav__item {
    border-top: none;
  }
  .md-nav--primary :is(.md-nav__title,.md-nav__item) {
    font-size : var(--md-typeset-font-size);
  }
  .md-nav .md-source {
    display: none;
  }

  .md-sidebar--primary {
    position: fixed;
    top: var(--bui-header-height, 0px);
    bottom: 0;
    width: ${TECHDOCS_SIDEBAR_WIDTH} !important;
    height: auto;
    max-height: calc(100dvh - var(--bui-header-height, 0px));
    overflow-y: auto;
    padding-bottom: 0 !important;
    z-index: 200;
    left: -${TECHDOCS_SIDEBAR_WIDTH} !important;
  }
  .md-sidebar--secondary:not([hidden]) {
    display: none;
  }

  [data-md-toggle=drawer]:checked~.md-container .md-sidebar--primary {
    transform: translateX(${TECHDOCS_SIDEBAR_WIDTH});
  }

  .md-content {
    max-width: 100%;
    margin-left: 0;
    margin-bottom: 50px;
  }

  .md-header__button {
    margin: 0.4rem 0;
    margin-left: 0.4rem;
    padding: 0;
  }

  .md-overlay {
    left: 0;
  }

  .md-footer {
    position: static;
    height: auto;
    padding-left: 0;
  }
  .md-footer-nav__link {
    /* footer links begin to overlap at small sizes without setting width */
    width: 50%;
  }
}

@media print {
  .md-main__inner {
    display: block;
  }

  .md-footer {
    position: static;
    height: auto;
  }

  .md-sidebar,
  #toggle-sidebar {
    display: none;
  }

  .md-content {
    margin: 0;
    width: 100%;
    max-width: 100%;
  }
}
`;
