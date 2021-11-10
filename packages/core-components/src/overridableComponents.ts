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
import { Overrides } from '@material-ui/core/styles/overrides';
import { StyleRules } from '@material-ui/core/styles/withStyles';

import {
  AvatarClassKey,
  DependencyGraphDefaultLabelClassKey,
  DependencyGraphDefaultNodeClassKey,
  DependencyGraphEdgeClassKey,
  DependencyGraphNodeClassKey,
  DismissableBannerClassKey,
  EmptyStateClassKey,
  EmptyStateImageClassKey,
  MissingAnnotationEmptyStateClassKey,
  ErrorPanelClassKey,
  FeatureCalloutCircleClassKey,
  HeaderIconLinkRowClassKey,
  IconLinkVerticalClassKey,
  HorizontalScrollGridClassKey,
  LifecycleClassKey,
  MarkdownContentClassKey,
  LoginRequestListItemClassKey,
  OAuthRequestDialogClassKey,
  OverflowTooltipClassKey,
  GaugeClassKey,
  GaugeCardClassKey,
  ResponseErrorPanelClassKey,
  SelectInputBaseClassKey,
  SelectClassKey,
  ClosedDropdownClassKey,
  OpenedDropdownClassKey,
  SimpleStepperFooterClassKey,
  SimpleStepperStepClassKey,
  StatusClassKey,
  MetadataTableTitleCellClassKey,
  MetadataTableCellClassKey,
  MetadataTableListClassKey,
  MetadataTableListItemClassKey,
  StructuredMetadataTableListClassKey,
  StructuredMetadataTableNestedListClassKey,
  SupportButtonClassKey,
  TableFiltersClassKey,
  SubvalueCellClassKey,
  TableHeaderClassKey,
  TableToolbarClassKey,
  FiltersContainerClassKey,
  TableClassKey,
  TabBarClassKey,
  TabIconClassKey,
  TabsClassKey,
  WarningPanelClassKey,
} from './components';

import {
  BottomLinkClassKey,
  BreadcrumbsClickableTextClassKey,
  BreadcrumbsStyledBoxClassKey,
  BackstageContentClassKey,
  ContentHeaderClassKey,
  ErrorPageClassKey,
  MicDropClassKey,
  HeaderClassKey,
  HeaderLabelClassKey,
  HeaderTabsClassKey,
  InfoCardClassKey,
  CardActionsTopRightClassKey,
  ItemCardGridClassKey,
  ItemCardHeaderClassKey,
  SidebarIntroClassKey,
  CustomProviderClassKey,
  SignInPageClassKey,
  TabbedCardClassKey,
  BoldHeaderClassKey,
  CardTabClassKey,
} from './layout';

type BackstageComponentsNameToClassKey = {
  BackstageAvatar: AvatarClassKey;
  BackstageDependencyGraphDefaultLabel: DependencyGraphDefaultLabelClassKey;
  BackstageDependencyGraphDefaultNode: DependencyGraphDefaultNodeClassKey;
  BackstageDependencyGraphEdge: DependencyGraphEdgeClassKey;
  BackstageDependencyGraphNode: DependencyGraphNodeClassKey;
  BackstageDismissableBanner: DismissableBannerClassKey;
  BackstageEmptyState: EmptyStateClassKey;
  BackstageEmptyStateImage: EmptyStateImageClassKey;
  BackstageMissingAnnotationEmptyState: MissingAnnotationEmptyStateClassKey;
  BackstageErrorPanel: ErrorPanelClassKey;
  BackstageFeatureCalloutCircular: FeatureCalloutCircleClassKey;
  BackstageHeaderIconLinkRow: HeaderIconLinkRowClassKey;
  BackstageIconLinkVertical: IconLinkVerticalClassKey;
  BackstageHorizontalScrollGrid: HorizontalScrollGridClassKey;
  BackstageLifecycle: LifecycleClassKey;
  BackstageMarkdownContent: MarkdownContentClassKey;
  BackstageLoginRequestListItem: LoginRequestListItemClassKey;
  OAuthRequestDialog: OAuthRequestDialogClassKey;
  BackstageOverflowTooltip: OverflowTooltipClassKey;
  BackstageGauge: GaugeClassKey;
  BackstageGaugeCard: GaugeCardClassKey;
  BackstageResponseErrorPanel: ResponseErrorPanelClassKey;
  BackstageSelectInputBase: SelectInputBaseClassKey;
  BackstageSelect: SelectClassKey;
  BackstageClosedDropdown: ClosedDropdownClassKey;
  BackstageOpenedDropdown: OpenedDropdownClassKey;
  BackstageSimpleStepperFooter: SimpleStepperFooterClassKey;
  SimpleStepperStep: SimpleStepperStepClassKey;
  BackstageStatus: StatusClassKey;
  BackstageMetadataTableTitleCell: MetadataTableTitleCellClassKey;
  BackstageMetadataTableCell: MetadataTableCellClassKey;
  BackstageMetadataTableList: MetadataTableListClassKey;
  BackstageMetadataTableListItem: MetadataTableListItemClassKey;
  BackstageStructuredMetadataTableList: StructuredMetadataTableListClassKey;
  BackstageStructuredMetadataTableNestedList: StructuredMetadataTableNestedListClassKey;
  BackstageSupportButton: SupportButtonClassKey;
  BackstageTableFilters: TableFiltersClassKey;
  BackstageSubvalueCell: SubvalueCellClassKey;
  BackstageTableHeader: TableHeaderClassKey;
  BackstageTableToolbar: TableToolbarClassKey;
  BackstageTableFiltersContainer: FiltersContainerClassKey;
  BackstageTable: TableClassKey;
  BackstageTabBar: TabBarClassKey;
  BackstageTabIcon: TabIconClassKey;
  BackstageTabs: TabsClassKey;
  BackstageWarningPanel: WarningPanelClassKey;
  BackstageBottomLink: BottomLinkClassKey;
  BackstageBreadcrumbsClickableText: BreadcrumbsClickableTextClassKey;
  BackstageBreadcrumbsStyledBox: BreadcrumbsStyledBoxClassKey;
  BackstageContent: BackstageContentClassKey;
  BackstageContentHeader: ContentHeaderClassKey;
  BackstageErrorPage: ErrorPageClassKey;
  BackstageErrorPageMicDrop: MicDropClassKey;
  BackstageHeader: HeaderClassKey;
  BackstageHeaderLabel: HeaderLabelClassKey;
  BackstageHeaderTabs: HeaderTabsClassKey;
  BackstageInfoCard: InfoCardClassKey;
  BackstageInfoCardCardActionsTopRight: CardActionsTopRightClassKey;
  BackstageItemCardGrid: ItemCardGridClassKey;
  BackstageItemCardHeader: ItemCardHeaderClassKey;
  BackstageSidebarIntro: SidebarIntroClassKey;
  BackstageCustomProvider: CustomProviderClassKey;
  BackstageSignInPage: SignInPageClassKey;
  BackstageTabbedCard: TabbedCardClassKey;
  BackstageTabbedCardBoldHeader: BoldHeaderClassKey;
  BackstageCardTab: CardTabClassKey;
};

/** @public */
export type BackstageOverrides = Overrides & {
  [Name in keyof BackstageComponentsNameToClassKey]?: Partial<
    StyleRules<BackstageComponentsNameToClassKey[Name]>
  >;
};
