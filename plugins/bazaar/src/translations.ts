/*
 * Copyright 2023 The Backstage Authors
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
import { createTranslationRef } from '@backstage/core-plugin-api/alpha';

/** @alpha */
export const bazaarTranslationRef = createTranslationRef({
  id: 'bazaar',
  messages: {
    about_title: 'About Bazaar',
    about_subheader_1: 'What is the Bazaar?',
    about_paragraph_1: `The Bazaar is a place where teams can propose projects for
    cross-functional team development. Essentially a marketplace for
    internal projects suitable for Inner Sourcing. With "Inner Sourcing", we mean projects that are developed
    internally within a company, but with Open Source best practices.`,
    about_subheader_2: 'Why?',
    about_paragraph_2: `Many companies today are of high need to increase the ease of
    cross-team cooperation. In large organizations, engineers often have
    limited ways of discovering or announcing the projects which could
    benefit from a wider development effort in terms of different
    expertise, experiences, and teams spread across the organization.
    With no good way to find these existing internal projects to join,
    the possibility of working with Inner Sourcing practices suffers.`,
    about_subheader_3: 'How?',
    about_paragraph_3: `The Bazaar allows engineers and teams to open up and announce
    their new and exciting projects for transparent cooperation in other
    parts of larger organizations. The Bazaar ensures that new Inner
    Sourcing friendly projects gain visibility through Backstage and a
    way for interested engineers to show their interest and in the
    future contribute with their specific skill set. The Bazaar also
    provides an easy way to manage, catalog, and browse these Inner
    Sourcing friendly projects and components.`,
    empty_projects: 'Please add projects to the Bazaar.',
    deleted_project: "Deleted project '{0}' from the Bazaar list",
    updated_project: "Updated project '{0}' in the Bazaar list",
    added_project: 'Added project "${formValues.title}" to the Bazaar list',
    confirmation_1: 'Are you sure you want to delete ',
    confirmation_2: ' from the Bazaar?',
    delete_project_button: 'Delete project',
    bazaar_link: 'Go to Bazaar',
    latest_projects: 'Bazaar Latest Projects',
    random_projects: 'Bazaar Random Projects',
    add_project: 'Add project',
    select_project: 'Select a project',
    edit_project: 'Edit project',
  },
});
