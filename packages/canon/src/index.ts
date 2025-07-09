/*
 * Copyright 2024 The Backstage Authors
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

/**
 * Components used by Backstage plugins and apps
 *
 * @packageDocumentation
 */

// Providers
export * from './components/Icon/context';

// Layout components
export * from './components/Box';
export * from './components/Grid';
export * from './components/Flex';
export * from './components/Container';
export * from './components/Text';
export * from './components/Heading';

// UI components
export * from './components/Avatar';
export * from './components/Button';
export * from './components/Card';
export * from './components/Collapsible';
export * from './components/DataTable';
export * from './components/FieldLabel';
export * from './components/Header';
export * from './components/HeaderPage';
export * from './components/Icon';
export * from './components/ButtonIcon';
export * from './components/ButtonLink';
export * from './components/Checkbox';
export * from './components/RadioGroup';
export * from './components/Table';
export * from './components/Tabs';
export * from './components/TextField';
export * from './components/Tooltip';
export * from './components/Menu';
export * from './components/ScrollArea';
export * from './components/SearchField';
export * from './components/Link';
export * from './components/Select';
export * from './components/Skeleton';
export * from './components/Switch';

// Types
export * from './types';
export * from './props';

// Hooks
export { useBreakpoint } from './hooks/useBreakpoint';

// Component Definitions
export * from './utils/componentDefinitions';
