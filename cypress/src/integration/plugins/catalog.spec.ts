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

    it('Should render addons on docs tab homepage', () => {
      cy.loginAsGuest();

      cy.visit('/catalog');

      cy.contains('techdocs-e2e-fixture').click();

      cy.location().should(loc => {
        expect(loc.pathname).to.eq(
          '/catalog/default/component/techdocs-e2e-fixture',
        );
      });

      cy.getCatalogDocsTab().click();

      cy.wait(300);

      cy.getTechDocsShadowRoot()
        .find('h1')
        .contains('Home page')
        .should('be.visible');

      // highlight a snippet of text
      cy.getTechDocsShadowRoot()
        .find('article > p')
        .then($el => {
          const el = $el[0];
          const document = el.ownerDocument;
          const range = document.createRange();
          range.selectNodeContents(el);
          document?.getSelection()?.removeAllRanges();
          document?.getSelection()?.addRange(range);
        });

      cy.document().trigger('selectionchange');

      // wait for new issue default debounce time
      cy.wait(600);

      // assert that the new issue button has a right url
      cy.getTechDocsShadowRoot()
        .contains('Open new Github issue')
        .should(
          'have.attr',
          'href',
          'https://github.com/backstage/backstage/issues/new?title=Documentation%20feedback%3A%20This%20is%20a%20basic%20documentation%20used%20for%20end-to-end%20tests.&body=%23%23%20Documentation%20Feedback%20%F0%9F%93%9D%0A%0A%20%23%23%23%23%20The%20highlighted%20text%3A%20%0A%0A%20%3E%20This%20is%20a%20basic%20documentation%20used%20for%20end-to-end%20tests.%0A%0A%20%23%23%23%23%20The%20comment%20on%20the%20text%3A%20%0A%20_%3Ereplace%20this%20line%20with%20your%20comment%3C_%0A%0A%20___%0ABackstage%20URL%3A%20%3Chttp%3A%2F%2Flocalhost%3A7007%2Fcatalog%2Fdefault%2Fcomponent%2Ftechdocs-e2e-fixture%2Fdocs%3E%20%0AMarkdown%20URL%3A%20%3Chttps%3A%2F%2Fgithub.com%2Fbackstage%2Fbackstage%2Fblob%2Fmaster%2Fcypress%2Ffixtures%2Fdocs%2Findex.md%3E',
        );
    });

    it('Should render addons on docs tab sup-page', () => {
      cy.loginAsGuest();

      cy.visit('/catalog');

      cy.contains('techdocs-e2e-fixture').click();

      cy.location().should(loc => {
        expect(loc.pathname).to.eq(
          '/catalog/default/component/techdocs-e2e-fixture',
        );
      });

      cy.getCatalogDocsTab().click();

      cy.wait(300);

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

      // highlight a snippet of text
      cy.getTechDocsShadowRoot()
        .find('#section-11')
        .then($el => {
          const el = $el[0];
          const document = el.ownerDocument;
          const range = document.createRange();
          range.selectNodeContents(el);
          document?.getSelection()?.removeAllRanges();
          document?.getSelection()?.addRange(range);
        });

      cy.document().trigger('selectionchange');

      // wait for new issue default debounce time
      cy.wait(600);

      // assert that the new issue button has a right url
      cy.getTechDocsShadowRoot()
        .contains('Open new Github issue')
        .should(
          'have.attr',
          'href',
          'https://github.com/backstage/backstage/issues/new?title=Documentation%20feedback%3A%20Section%201.1%C2%B6&body=%23%23%20Documentation%20Feedback%20%F0%9F%93%9D%0A%0A%20%23%23%23%23%20The%20highlighted%20text%3A%20%0A%0A%20%3E%20Section%201.1%C2%B6%0A%0A%20%23%23%23%23%20The%20comment%20on%20the%20text%3A%20%0A%20_%3Ereplace%20this%20line%20with%20your%20comment%3C_%0A%0A%20___%0ABackstage%20URL%3A%20%3Chttp%3A%2F%2Flocalhost%3A7007%2Fcatalog%2Fdefault%2Fcomponent%2Ftechdocs-e2e-fixture%2Fdocs%2Fsub-page-one%2F%3E%20%0AMarkdown%20URL%3A%20%3Chttps%3A%2F%2Fgithub.com%2Fbackstage%2Fbackstage%2Fblob%2Fmaster%2Fcypress%2Ffixtures%2Fdocs%2Fsub-page-one.md%3E',
        );
    });
  });
});
