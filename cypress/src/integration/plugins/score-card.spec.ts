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

describe('score-card', () => {
  describe('Score board', () => {
    it('displays the score board based on sample data', () => {
      cy.loginAsGuest();

      cy.visit('/score-board');
      cy.screenshot({ capture: 'viewport' });

      cy.contains('System scores overview').should('be.visible');
      cy.checkForErrors();
      cy.get('span:contains("1-2 of 2")').should('be.visible'); // beware, there is also a hidden <P/> element
      cy.contains('audio-playback').should('be.visible');
      cy.contains('team-c').should('be.visible');
      cy.contains('non-valid-system').should('be.visible');
      cy.contains('Name').should('be.visible');
      cy.contains('Date').should('be.visible');
      cy.contains('Code').should('be.visible');
      cy.contains('Documentation').should('be.visible');
      cy.contains('Operations').should('be.visible');
      cy.contains('Quality').should('be.visible');
      cy.contains('Security').should('be.visible');
      cy.contains('Total').should('be.visible');
      cy.contains('50 %').should('be.visible');
      cy.contains('75 %').should('be.visible');
      cy.log('navigating to score card detail for audio-playback');
      cy.get('a[data-id="audio-playback"]').should('be.visible').click();
      cy.screenshot({ capture: 'viewport' });

      cy.url().should(
        'include',
        '/catalog/default/System/audio-playback/score',
      );
      cy.contains('Scoring').should('be.visible');
      cy.contains('Total score: 57 %').should('be.visible');
      cy.contains('Code').should('be.visible');
      cy.contains('90 %').should('be.visible');
      cy.contains('Documentation').should('be.visible');
      cy.contains('75 %').should('be.visible');
      cy.contains('Operations').should('be.visible');
      cy.contains('50 %').should('be.visible');
      cy.contains('Quality').should('be.visible');
      cy.contains('25 %').should('be.visible');
      cy.contains('Security');
      cy.contains('10 %').should('be.visible');
      cy.checkForErrors();

      cy.log(
        'Clicking on button [>] that is first child of the element (td) with value=Code',
      );
      cy.get('[value="Code"] > button:first-child').click();
      cy.checkForErrors();
      cy.screenshot({ capture: 'viewport' });

      cy.log('Clicking on link for Code');
      cy.contains('hints: Gitflow: 100%').should('be.visible');
      cy.get('a[data-id="2157"]')
        .should('be.visible')
        .should(
          'have.attr',
          'href',
          'https://TBD/XXX/_wiki/wikis/XXX.wiki/2157',
        );
    });
  });
});
