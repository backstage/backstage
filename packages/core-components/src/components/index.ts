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

export * from './AlertDisplay';
export * from './AutoLogout';
export * from './Avatar';
export * from './LinkButton';
export * from './CodeSnippet';
export * from './CopyTextButton';
export * from './CreateButton';
export * from './DependencyGraph';
export * from './DismissableBanner';
export * from './EmptyState';
export * from './ErrorPanel';
export * from './FavoriteToggle';
export * from './ResponseErrorPanel';
export * from './FeatureDiscovery';
export * from './HeaderIconLinkRow';
export * from './HorizontalScrollGrid';
export * from './Lifecycle';
export * from './Link';
export * from './LogViewer';
export * from './MarkdownContent';
export * from './OAuthRequestDialog';
export * from './OverflowTooltip';
export * from './Progress';
export * from './ProgressBars';
export * from './Select';
export * from './SimpleStepper';
export * from './Status';
export * from './StructuredMetadataTable';
export * from './SupportButton';
export * from './TabbedLayout';
export * from './Table';
export * from './TrendLine';
export * from './WarningPanel';

/* ── shadcn/ui primitive components ─────────────────────────────────────── */
export * from './ui/accordion';
export * from './ui/alert';
export * from './ui/avatar';
export * from './ui/badge';
export * from './ui/breadcrumb';
/* ui/button: Button and ButtonProps are already exported from ./LinkButton,
   so we export the shadcn primitives under prefixed names to avoid collision.
   buttonVariants, ButtonVariant, and ButtonSize do not conflict. */
export {
  Button as ShadcnButton,
  buttonVariants,
  type ButtonProps as ShadcnButtonProps,
  type ButtonVariant,
  type ButtonSize,
} from './ui/button';
export * from './ui/card';
export * from './ui/checkbox';
export * from './ui/command';
export * from './ui/data-table';
export * from './ui/dialog';
export * from './ui/dropdown-menu';
export * from './ui/input';
export * from './ui/label';
export * from './ui/navigation-menu';
export * from './ui/popover';
export * from './ui/progress';
export * from './ui/scroll-area';
/* ui/select: SelectItem is already exported from ./Select,
   so we export the shadcn primitives under prefixed name to avoid collision. */
export {
  ShadcnSelect,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem as ShadcnSelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from './ui/select';
export * from './ui/separator';
export * from './ui/sheet';
export * from './ui/skeleton';
export * from './ui/switch';
export * from './ui/table';
export * from './ui/tabs';
export * from './ui/textarea';
export * from './ui/toast';
export * from './ui/tooltip';
export * from './ui/visually-hidden';
