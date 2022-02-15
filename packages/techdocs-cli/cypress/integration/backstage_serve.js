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

describe('TechDocs Live Preview - Backstage server', () => {
  it('successfully serves documentation', () => {
    cy.visit(`${Cypress.env('backstageBaseUrl')}/docs/default/component/local`);
    cy.contains('hello mock docs');
  });

  it('successfully navigates to sub page of documentation', () => {
    cy.contains('SubDocs').click();
    cy.contains('Home 2').click();
    cy.contains(
      'This is an md file in another docs folder using the MkDocs Monorepo Plugin',
    );
  });

  it('successfully renders all Backstage main elements', () => {
    cy.contains('header', 'Live preview environment');
    cy.contains('[data-testid="sidebar-root"]', 'Docs Preview');
  });

  it('successfully renders all extracted MkDocs main elements', () => {
    // as it gets replaced by Backstage header
    cy.get('.md-header').should('have.length', 0);
    cy.contains(
      '.md-main',
      'This is an md file in another docs folder using the MkDocs Monorepo Plugin',
    );
    cy.contains('.md-sidebar--primary', 'Home 2');
    cy.contains(
      '.md-sidebar--secondary',
      'This is an md file in another docs folder using the MkDocs Monorepo Plugin',
    );
    cy.contains('.md-footer', 'Introduction');
  });
});
