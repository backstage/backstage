/*
 * Copyright 2021 Spotify AB
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

describe('Integrations', () => {
  describe('ReadTree', () => {
    // it('should work for azure', () => {
    //   cy.loginAsGuest();

    //   cy.visit('/catalog-import');

    //   cy.get('input[name=url]').type(
    //     'https://dev.azure.com/backstage-verification/_git/test-repo?path=%2Fnested%2F*',
    //   );

    //   cy.contains('Analyze').click();
    // });

    it('should work for github', () => {
      cy.loginAsGuest();

      cy.visit('/catalog-import');

      cy.get('input[name=url]').type(
        'https://github.com/backstage-verification/test-repo',
      );

      cy.contains('Analyze').click();
    });
  });
});
