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
    cy.get('[data-testid="techdocs-content-shadowroot"]').shadow();
    cy.title('hello mock docs');
  });

  it('successfully navigates to sub page of documentation', () => {
    cy.contains('SubDocs').click();
    cy.contains('Home 2').click();
    cy.contains(
      'This is an md file in another docs folder using the MkDocs Monorepo Plugin',
    );
  });

  it('successfully renders all Backstage main elements', () => {
    cy.get('header');
    cy.get('header').contains('Live preview environment');
    cy.get('[data-testid="sidebar-root"]');
    cy.get('[data-testid="sidebar-root"]').contains('Docs Preview');
  });

  it('successfully renders all extracted MkDocs main elements', () => {
    // as it gets replaced by Backstage header
    cy.get('.md-header').should('not.exist');
    cy.get('.md-main');
    cy.get('.md-nav');
    cy.get('.md-sidebar--primary');
    cy.get('.md-sidebar--secondary');
    cy.get('.md-footer');
  });
});
