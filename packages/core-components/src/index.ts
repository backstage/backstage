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

/**
 * Core components used by Backstage plugins and apps.
 *
 * This package provides both Backstage-specific composite components
 * (AlertDisplay, Table, Sidebar, InfoCard, etc.) and a full set of
 * shadcn/ui primitive components built on Radix UI and Tailwind CSS
 * (Accordion, Alert, Avatar, Badge, Button, Card, Checkbox, Command,
 * DataTable, Dialog, DropdownMenu, Input, Label, NavigationMenu,
 * Popover, Progress, ScrollArea, Select, Separator, Sheet, Skeleton,
 * Switch, Table, Tabs, Textarea, Toast, Tooltip, VisuallyHidden).
 *
 * The `cn()` utility is also exported for Tailwind CSS class composition.
 *
 * @packageDocumentation
 */

export * from './components';
export * from './hooks';
export * from './icons';
export * from './layout';
export * from './overridableComponents';

/* Tailwind utility helper for className composition */
export { cn } from './lib/utils';
