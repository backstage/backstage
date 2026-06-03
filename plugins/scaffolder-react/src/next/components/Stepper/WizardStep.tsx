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
import { Card, CardBody, Grid } from '@backstage/ui';
import { type ReactNode } from 'react';
import styles from './WizardStep.module.css';

export function WizardStepContent(props: {
  children: ReactNode;
  preview?: boolean;
}) {
  const { children, preview = false } = props;

  if (preview) {
    return <Grid.Item colSpan="12">{children}</Grid.Item>;
  }

  return (
    <Grid.Item
      colSpan={{ initial: '12', lg: '6' }}
      colStart={{ initial: '1', lg: '4' }}
    >
      <Card>
        <CardBody className={styles.wizardStepCard}>{children}</CardBody>
      </Card>
    </Grid.Item>
  );
}

export function WizardStepFooter(props: { children: ReactNode }) {
  return (
    <Grid.Item className={styles.wizardStepFooter} colSpan="12">
      {props.children}
    </Grid.Item>
  );
}

export function WizardStep(props: { children: ReactNode }) {
  return (
    <Grid.Root className={styles.wizardStep} columns="12">
      {props.children}
    </Grid.Root>
  );
}
