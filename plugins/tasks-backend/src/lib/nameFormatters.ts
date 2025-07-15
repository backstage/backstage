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
import { Config } from '@backstage/config';
import { LoggerService } from '@backstage/backend-plugin-api';

interface ExtractionPattern {
  pattern: string;
  extractions: { [key: string]: number | string };
  priority: number;
}

interface TransformationRule {
  variable: string;
  rules: { [key: string]: string };
  defaultTransform?: string;
}

export interface PatternExtractor {
  extractPatterns(taskId: string): Record<string, string>;
  transformValue(variable: string, value: string): string;
}

/**
 * Generic text transformation functions
 */
export const textTransforms = {
  titleCase: (text: string): string =>
    text.replace(/\b\w/g, l => l.toUpperCase()),

  upperCase: (text: string): string => text.toUpperCase(),

  lowerCase: (text: string): string => text.toLowerCase(),

  camelCase: (text: string): string =>
    text.replace(/[-_\s]+(.)?/g, (_, char) => char?.toUpperCase() || ''),

  kebabToTitle: (text: string): string =>
    text.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),

  snakeToTitle: (text: string): string =>
    text.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
};

/**
 * Smart transformations that automatically detect common patterns
 */
export const smartTransform = (text: string): string => {
  // Handle common patterns without explicit config
  if (text.includes('_')) {
    // snake_case -> Title Case
    return text.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  if (text.includes('-')) {
    // kebab-case -> Title Case
    return text.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  if (/^[a-z]+([A-Z][a-z]*)*$/.test(text)) {
    // camelCase -> Title Case
    return text
      .replace(/([A-Z])/g, ' $1')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim();
  }

  // Default: just title case
  return text.replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Creates a simplified pattern extractor with smart defaults
 */
export function createPatternExtractor(
  config: Config,
  logger: LoggerService,
): PatternExtractor {
  const tasksConfig = config.getOptionalConfig('tasks');
  const formattingConfig = tasksConfig?.getOptionalConfig('formatting');

  // Load custom extraction patterns from config
  const customExtractionPatterns: ExtractionPattern[] = [];
  const extractionPatternsConfig =
    formattingConfig?.getOptionalConfigArray('extractionPatterns');

  if (extractionPatternsConfig) {
    for (const patternConfig of extractionPatternsConfig) {
      const pattern = patternConfig.getString('pattern');
      const extractions: { [key: string]: number | string } = {};

      // Try to get the extractions object
      try {
        const extractionsConfig =
          patternConfig.getOptionalConfig('extractions');
        if (extractionsConfig) {
          const extractionKeys = extractionsConfig.keys();
          extractionKeys.forEach(key => {
            try {
              const numValue = extractionsConfig.getNumber(key);
              extractions[key] = numValue;
            } catch {
              try {
                const stringValue = extractionsConfig.getString(key);
                extractions[key] = stringValue;
              } catch (error) {
                logger.warn(`Failed to read extraction ${key}`, {
                  key,
                  error: error instanceof Error ? error.message : String(error),
                });
              }
            }
          });
        }
      } catch (error) {
        logger.warn(`Failed to get extractions config`, {
          error: error instanceof Error ? error.message : String(error),
        });
      }

      const priority = patternConfig.getOptionalNumber('priority') ?? 0;
      customExtractionPatterns.push({ pattern, extractions, priority });
    }
  }

  // Sort by priority (higher first)
  customExtractionPatterns.sort((a, b) => b.priority - a.priority);

  // Load custom transformation rules from config
  const customTransformationRules: TransformationRule[] = [];
  const transformationsConfig =
    formattingConfig?.getOptionalConfigArray('transformations');

  if (transformationsConfig) {
    for (const transformConfig of transformationsConfig) {
      const variable = transformConfig.getString('variable');
      const rulesKeys = transformConfig
        .keys()
        .filter(key => key.startsWith('rules.'));
      const rules: { [key: string]: string } = {};

      rulesKeys.forEach(key => {
        const ruleKey = key.replace('rules.', '');
        const ruleValue = transformConfig.getString(key);
        rules[ruleKey] = ruleValue;
      });

      const defaultTransform =
        transformConfig.getOptionalString('defaultTransform');

      customTransformationRules.push({ variable, rules, defaultTransform });
    }
  }

  return {
    extractPatterns(taskId: string): Record<string, string> {
      // Only try patterns from configuration
      for (const customPattern of customExtractionPatterns) {
        try {
          const regex = new RegExp(customPattern.pattern);
          const match = regex.exec(taskId);

          if (match) {
            logger.debug(`Pattern matched for task`, {
              taskId,
              pattern: customPattern.pattern,
              match: match[0],
            });
            const extractions: Record<string, string> = {};

            Object.entries(customPattern.extractions).forEach(
              ([name, value]) => {
                if (typeof value === 'number') {
                  const capturedValue = match[value + 1];
                  if (capturedValue) {
                    extractions[name] = capturedValue;
                  }
                } else {
                  extractions[name] = value;
                }
              },
            );

            return extractions;
          }
        } catch (error) {
          logger.warn(`Pattern extraction failed`, {
            pattern: customPattern.pattern,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }

      logger.debug(`No extraction patterns matched`, { taskId });
      return {};
    },

    transformValue(variable: string, value: string): string {
      // Check custom transformation rules from config
      const customRule = customTransformationRules.find(
        rule => rule.variable === variable,
      );

      if (customRule) {
        if (customRule.rules[value]) {
          return customRule.rules[value];
        }

        if (
          customRule.defaultTransform &&
          textTransforms[
            customRule.defaultTransform as keyof typeof textTransforms
          ]
        ) {
          const transform =
            textTransforms[
              customRule.defaultTransform as keyof typeof textTransforms
            ];
          return transform(value);
        }
      }

      // Apply smart transformation as default
      return smartTransform(value);
    },
  };
}

/**
 * Function to substitute templates with capture groups and extracted patterns
 */
export function substituteTemplate(
  template: string,
  captureGroups: string[],
  extractedPatterns: Record<string, string>,
  patternExtractor?: PatternExtractor,
  logger?: LoggerService,
): string {
  let result = template;

  // Substitute numbered capture groups (with smart transformation)
  captureGroups.forEach((group, index) => {
    const transformedGroup = smartTransform(group);
    result = result.replace(
      new RegExp(`\\{${index}\\}`, 'g'),
      transformedGroup,
    );
  });

  // Substitute extracted patterns (with optional transformation)
  Object.entries(extractedPatterns).forEach(([key, value]) => {
    const transformedValue =
      patternExtractor?.transformValue(key, value) ?? value;
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), transformedValue);
  });

  // FALLBACK: Remove any remaining uninterpolated template variables
  // This ensures users never see {variable} in the final output
  result = result.replace(/\{([^}]+)\}/g, (_match, variable) => {
    // Apply smart transformation to the variable name as fallback
    const fallbackValue = smartTransform(variable);

    if (logger) {
      logger.warn(`Uninterpolated template variable replaced with fallback`, {
        variable,
        fallbackValue,
        originalTemplate: template,
      });
    }
    return fallbackValue;
  });

  return result;
}
