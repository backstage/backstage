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
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { Box, Flex, Text } from '@backstage/ui';
import { type ReactNode } from 'react';
import { scaffolderReactTranslationRef } from '../../../translation';
import styles from './WizardProgressBar.module.css';

const AnimatedBar = ({ width }: { width: string }) => (
  <div className={styles.animatedProgressBar} style={{ width }} />
);

function calculateWidth(activeStep: number, totalSteps: number): number {
  if (totalSteps <= 1) return 100;
  const stepProgress = (activeStep + 1) / totalSteps;
  const offset = 0.1;
  const range = 1 - 2 * offset;
  return Math.min(100, (offset + stepProgress * range) * 100);
}

type WizardProgressBarProps = {
  steps: Array<{ title: string | ReactNode }>;
  activeStep: number;
  totalSteps: number;
  onStepClick: (index: number) => void;
  reviewLabel: ReactNode;
  previewMode?: boolean;
};

export const WizardProgressBar = ({
  steps,
  activeStep,
  totalSteps,
  onStepClick,
  reviewLabel,
  previewMode = false,
}: WizardProgressBarProps) => {
  const { t } = useTranslationRef(scaffolderReactTranslationRef);

  return (
    <Box py="4" px="2" className={styles.container}>
      <Flex
        justify="between"
        align="center"
        mx="auto"
        px="6"
        className={styles.outerFlex}
      >
        <Flex
          gap="10"
          align="center"
          justify="center"
          className={styles.stepsFlex}
        >
          {steps.map((step, index) => {
            const isActive = index === activeStep;
            const stepNumber = String(index + 1).padStart(2, '0');
            const isClickable = previewMode || activeStep > index;

            return (
              <div
                key={index}
                onClick={isClickable ? () => onStepClick(index) : undefined}
                onKeyDown={
                  isClickable
                    ? (e: React.KeyboardEvent) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onStepClick(index);
                        }
                      }
                    : undefined
                }
                role={isClickable ? 'button' : undefined}
                tabIndex={isClickable ? 0 : undefined}
                aria-label={
                  isClickable
                    ? t('stepper.stepIndexLabel', { index: index + 1 })
                    : undefined
                }
                className={styles.stepItem}
                style={{ cursor: isClickable ? 'pointer' : 'default' }}
                title={typeof step.title === 'string' ? step.title : undefined}
              >
                <Text
                  as="p"
                  variant="body-medium"
                  weight={isActive ? 'bold' : 'regular'}
                  color={isActive ? 'primary' : 'secondary'}
                  className={styles.stepText}
                >
                  {stepNumber}. {step.title}
                </Text>
              </div>
            );
          })}
          {!previewMode && (
            <div style={{ cursor: 'default' }}>
              <Text
                as="p"
                variant="body-medium"
                weight={activeStep === steps.length ? 'bold' : 'regular'}
                color={activeStep === steps.length ? 'primary' : 'secondary'}
                className={styles.reviewText}
              >
                {String(steps.length + 1).padStart(2, '0')}. {reviewLabel}
              </Text>
            </div>
          )}
        </Flex>
      </Flex>
      {!previewMode && (
        <Box className={styles.progressTrack}>
          <AnimatedBar width={`${calculateWidth(activeStep, totalSteps)}%`} />
        </Box>
      )}
    </Box>
  );
};
