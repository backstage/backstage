/*
 * Copyright 2025 The Backstage Authors
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
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import {
  ReviewStepProps,
  ScaffolderTaskOutput,
} from '@backstage/plugin-scaffolder-react';
import { createSwappableComponent } from '@backstage/frontend-plugin-api';
import {
  TemplateListPage,
  TemplateListPageProps,
  TemplateWizardPage,
  TemplateWizardPageProps,
} from './components';
import { OngoingTask } from '../components/OngoingTask';
import {
  DefaultReviewStep,
  DefaultTemplateOutputs,
  TemplateCard,
} from '@backstage/plugin-scaffolder-react/alpha';

/** @alpha */
export const SwappableTemplateCardComponent = createSwappableComponent<{
  template: TemplateEntityV1beta3;
}>({
  id: 'scaffolder.templateCard',
  loader: () => props => <TemplateCard {...props} />,
});

/** @alpha */
export const SwappableReviewStepComponent =
  createSwappableComponent<ReviewStepProps>({
    id: 'scaffolder.reviewStep',
    loader: () => props => <DefaultReviewStep {...props} />,
  });

/** @alpha */
export const SwappableTaskPageComponent = createSwappableComponent({
  id: 'scaffolder.taskPage',
  loader: () => props => <OngoingTask {...props} />,
});

/** @alpha */
export const SwappableTemplateOutputsComponent = createSwappableComponent<{
  output?: ScaffolderTaskOutput;
}>({
  id: 'scaffolder.templateOutputs',
  loader: () => props => <DefaultTemplateOutputs {...props} />,
});

/** @alpha */
export const SwappableTemplateListPageComponent =
  createSwappableComponent<TemplateListPageProps>({
    id: 'scaffolder.templateListPage',
    loader: () => props => <TemplateListPage {...props} />,
  });

/** @alpha */
export const SwappableTemplateWizardPageComponent =
  createSwappableComponent<TemplateWizardPageProps>({
    id: 'scaffolder.templateWizardPage',
    loader: () => props => <TemplateWizardPage {...props} />,
  });
