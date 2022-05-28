/*
 * Copyright 2020 The Backstage Authors
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

describe('TechDocs', () => {
  beforeEach(() => {
    cy.loginAsGuest();
    cy.mockSockJSNode();
    cy.interceptTechDocsAPICalls();
  });

  describe('Navigating to TechDocs', () => {
    it('should navigate to the TechDocs home page via the primary navigation bar', () => {
      cy.visit('/');
      cy.wait(500);

      cy.get('[data-testid="sidebar-root"]')
        .get('div')
        .get('a[href="/docs"]')
        .click();

      cy.contains('Documentation');
    });

    it('should navigate to the TechDocs home page from the URL', () => {
      cy.visit('/docs');

      cy.wait(500);

      cy.contains('Documentation');
    });

    it('should navigate to a specific TechDocs entity from the "Overview" tab', () => {
      cy.visit('/docs');

      cy.contains('techdocs-e2e-fixture').click();

      cy.location().should(loc => {
        expect(loc.pathname).to.eq(
          '/docs/default/component/techdocs-e2e-fixture',
        );
      });
    });

    it('should navigate to a specific TechDocs entity page from a URL', () => {
      cy.visit('/docs/default/Component/techdocs-e2e-fixture');
      cy.waitHomePage();

      cy.contains('e2e Fixture Documentation');
      cy.contains(
        'Documentation used for end-to-end tests of TechDocs in Backstage.',
      );
      cy.getTechDocsShadowRoot().contains('Home page');
    });

    it('should navigate to a specific TechDocs section from a URL', () => {
      cy.visit('/docs/default/Component/techdocs-e2e-fixture/sub-page-two');
      cy.waitSectionTwoPage();

      cy.window().its('scrollY').should('equal', 0);

      cy.getTechDocsShadowRoot().within(() => {
        cy.contains('Sub-page 2');
      });
    });

    it('should navigate to a specific TechDocs fragment from a URL', () => {
      cy.visit(
        '/docs/default/Component/techdocs-e2e-fixture/sub-page-two#section-23',
      );

      // This is used to test the post-render behavior of the techdocs Reader
      cy.wait(500);

      cy.getTechDocsShadowRoot().within(() => {
        cy.isInViewport('#section-23');
      });
    });

    it('should navigate to a wrong TechDocs entity page from a URL', () => {
      cy.visit('/docs/default/Component/wrong-component');

      cy.get('[data-testid=error]').should('be.visible');
    });
  });

  describe('Rendering TechDocs Addons', () => {
    it('should render a content addon in homepage', () => {
      cy.visit('/docs/default/Component/techdocs-e2e-fixture');

      cy.contains('e2e Fixture Documentation');

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
          'https://github.com/backstage/backstage/issues/new?title=Documentation%20feedback%3A%20This%20is%20a%20basic%20documentation%20used%20for%20end-to-end%20tests.&body=%23%23%20Documentation%20Feedback%20%F0%9F%93%9D%0A%0A%20%23%23%23%23%20The%20highlighted%20text%3A%20%0A%0A%20%3E%20This%20is%20a%20basic%20documentation%20used%20for%20end-to-end%20tests.%0A%0A%20%23%23%23%23%20The%20comment%20on%20the%20text%3A%20%0A%20_%3Ereplace%20this%20line%20with%20your%20comment%3C_%0A%0A%20___%0ABackstage%20URL%3A%20%3Chttp%3A%2F%2Flocalhost%3A7007%2Fdocs%2Fdefault%2FComponent%2Ftechdocs-e2e-fixture%3E%20%0AMarkdown%20URL%3A%20%3Chttps%3A%2F%2Fgithub.com%2Fbackstage%2Fbackstage%2Fblob%2Fmaster%2Fcypress%2Ffixtures%2Fdocs%2Findex.md%3E',
        );
    });

    it('should render a content addon in sub-pages', () => {
      cy.visit('/docs/default/Component/techdocs-e2e-fixture');

      cy.contains('e2e Fixture Documentation');

      // open sub-page
      cy.getTechDocsShadowRoot().within(() => {
        cy.getTechDocsNavigation().find('a').contains('Sub-page 1').click();
      });

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
          'https://github.com/backstage/backstage/issues/new?title=Documentation%20feedback%3A%20Section%201.1%C2%B6&body=%23%23%20Documentation%20Feedback%20%F0%9F%93%9D%0A%0A%20%23%23%23%23%20The%20highlighted%20text%3A%20%0A%0A%20%3E%20Section%201.1%C2%B6%0A%0A%20%23%23%23%23%20The%20comment%20on%20the%20text%3A%20%0A%20_%3Ereplace%20this%20line%20with%20your%20comment%3C_%0A%0A%20___%0ABackstage%20URL%3A%20%3Chttp%3A%2F%2Flocalhost%3A7007%2Fdocs%2Fdefault%2FComponent%2Ftechdocs-e2e-fixture%2Fsub-page-one%2F%3E%20%0AMarkdown%20URL%3A%20%3Chttps%3A%2F%2Fgithub.com%2Fbackstage%2Fbackstage%2Fblob%2Fmaster%2Fcypress%2Ffixtures%2Fdocs%2Fsub-page-one.md%3E',
        );
    });
  });

  describe('Navigating within TechDocs', () => {
    it('should navigate to a specific TechDocs page via the navigation bar', () => {
      cy.visit('/docs/default/Component/techdocs-e2e-fixture');

      cy.getTechDocsShadowRoot().within(() => {
        cy.getTechDocsNavigation()
          .find('> div > div > [data-md-level="0"] > ul > li:nth-child(2) > a')
          .click();
        cy.contains('Sub-page 1');
        cy.window().its('scrollY').should('eq', 0);
      });
    });

    describe('Navigating within a TechDocs page', () => {
      beforeEach(() => {
        cy.visit('/docs/default/Component/techdocs-e2e-fixture/sub-page-two');
      });

      it('should navigate to a specific fragment within the page via the table of contents - Level 1', () => {
        return cy.getTechDocsShadowRoot().within(() => {
          // Section 3
          cy.getTechDocsTableOfContents()
            .find('a')
            .contains('Section 2.3')
            .click();

          // wait scroll timeout
          cy.wait(500);

          cy.isInViewport('#section-23');
        });
      });

      it('should navigate to a specific fragment within the page via the table of contents - Level 2', () => {
        return cy.getTechDocsShadowRoot().within(() => {
          cy.isNotInViewport('#sub-section-222');
          // Section 2.2
          cy.getTechDocsTableOfContents()
            .find('a')
            .contains('Section 2.2.2')
            .click();

          // wait scroll timeout
          cy.wait(500);

          cy.isInViewport('#sub-section-222');
        });
      });

      it('should navigate to a specific TechDocs page fragment from a link', () => {
        return cy.getTechDocsShadowRoot().within(() => {
          cy.get('article').contains('Link to Section 1.1').click();

          cy.location().should(loc => {
            expect(loc.pathname).to.eq(
              '/docs/default/Component/techdocs-e2e-fixture/sub-page-one/',
            );
            expect(loc.hash).to.eq('#section-11');
          });
        });
      });

      it('should navigate to the next page within a TechDocs entity', () => {
        return cy.getTechDocsShadowRoot().within(() => {
          cy.get('footer a').contains('Sub-page 3').click();

          cy.location().should(loc => {
            expect(loc.pathname).to.eq(
              '/docs/default/Component/techdocs-e2e-fixture/sub-page-three/',
            );
          });
        });
      });

      it('should navigate to the previous page within a TechDocs entity', () => {
        return cy.getTechDocsShadowRoot().within(() => {
          cy.get('footer a').contains('Sub-page 1').click();

          cy.location().should(loc => {
            expect(loc.pathname).to.eq(
              '/docs/default/Component/techdocs-e2e-fixture/sub-page-one/',
            );
          });
        });
      });
    });
  });
});
