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
/// <reference types="cypress" />
describe('TechDocs Live Preview - Backstage Serve', () => {
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
    cy.get('[data-testid="sidebar-root"]')
      .children()
      .should('have.length.gt', 0);
  });

  it('successfully renders all extracted MkDocs main elements', () => {
    // as it gets replaced by Backstage header
    cy.get('.md-header').should('have.length', 0);
    cy.get('.md-main').should('have.length', 1);
    cy.contains(
      '.md-main',
      'This is an md file in another docs folder using the MkDocs Monorepo Plugin',
    );
    cy.get('.md-sidebar.md-sidebar--primary').should('have.length', 1);
    cy.get('.md-sidebar.md-sidebar--primary').should('have.length', 1);
    cy.get('.md-footer').should('have.length', 1);
  });

  it('toMatchImageSnapshot - Backstage TechDocs Page', () => {
    cy.visit(
      `${Cypress.env('backstageBaseUrl')}/docs/default/component/local`,
    ).then(() => {
      cy.document().toMatchImageSnapshot();
    });
  });
});
