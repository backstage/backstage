/*
 * Copyright 2021 The Backstage Authors
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
import 'os';

describe('Catalog', () => {
  describe('default entities', () => {
    it('displays the correct amount of entities from default config', () => {
      cy.loginAsGuest();

      cy.visit('/catalog');

      cy.contains('Owned (10)').should('be.visible');
    });

    it('Should navigate to a docs tab', () => {
      cy.loginAsGuest();

      cy.visit('/catalog');

      cy.contains('techdocs-e2e-fixture').click();

      cy.location().should(loc => {
        expect(loc.pathname).to.eq(
          '/catalog/default/component/techdocs-e2e-fixture',
        );
      });

      cy.getCatalogDocsTab().click();

      cy.getTechDocsShadowRoot()
        .find('h1')
        .contains('Home page')
        .should('be.visible');
    });

    it('Should navigate to a sub-route in docs tab', () => {
      cy.loginAsGuest();

      cy.visit('/catalog');

      cy.contains('techdocs-e2e-fixture').click();

      cy.location().should(loc => {
        expect(loc.pathname).to.eq(
          '/catalog/default/component/techdocs-e2e-fixture',
        );
      });

      cy.getCatalogDocsTab().click();

      cy.getTechDocsShadowRoot()
        .find('h1')
        .contains('Home page')
        .should('be.visible');

      cy.getTechDocsShadowRoot().within(() => {
        cy.getTechDocsNavigation().find('a').contains('Sub-page 1').click();
      });

      cy.location().should(loc => {
        expect(loc.pathname).to.eq(
          '/catalog/default/component/techdocs-e2e-fixture/docs/sub-page-one/',
        );
      });

      cy.getTechDocsShadowRoot()
        .find('h1')
        .contains('Sub-page 1')
        .should('be.visible');
    });
  });
});
