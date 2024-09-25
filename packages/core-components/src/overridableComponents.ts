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
  ErrorPanelClassKey,
  FeatureCalloutCircleClassKey,
  HeaderIconLinkRowClassKey,
  IconLinkVerticalClassKey,
  HorizontalScrollGridClassKey,
  LifecycleClassKey,
  MarkdownContentClassKey,
  LoginRequestListItemClassKey,
  LogViewerClassKey,
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
  WarningPanelClassKey,
  LinkClassKey,
  FavoriteToggleIconClassKey,
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
  PageClassKey,
  SidebarClassKey,
  SidebarSpaceClassKey,
  SidebarSpacerClassKey,
  SidebarDividerClassKey,
  SidebarItemClassKey,
  SidebarPageClassKey,
  CustomProviderClassKey,
  SignInPageClassKey,
  TabbedCardClassKey,
  BoldHeaderClassKey,
  CardTabClassKey,
  SidebarSubmenuClassKey,
  SidebarSubmenuItemClassKey,
  StackDetailsClassKey,
  BreadcrumbsCurrentPageClassKey,
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
  BackstageErrorPanel: ErrorPanelClassKey;
  BackstageFeatureCalloutCircular: FeatureCalloutCircleClassKey;
  BackstageHeaderIconLinkRow: HeaderIconLinkRowClassKey;
  BackstageIconLinkVertical: IconLinkVerticalClassKey;
  BackstageHorizontalScrollGrid: HorizontalScrollGridClassKey;
  BackstageLifecycle: LifecycleClassKey;
  BackstageMarkdownContent: MarkdownContentClassKey;
  BackstageLoginRequestListItem: LoginRequestListItemClassKey;
  BackstageLogViewer: LogViewerClassKey;
  BackstageOAuthRequestDialog: OAuthRequestDialogClassKey;
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
  BackstageWarningPanel: WarningPanelClassKey;
  BackstageBottomLink: BottomLinkClassKey;
  BackstageBreadcrumbsClickableText: BreadcrumbsClickableTextClassKey;
  BackstageBreadcrumbsStyledBox: BreadcrumbsStyledBoxClassKey;
  BreadcrumbsCurrentPage: BreadcrumbsCurrentPageClassKey;
  BackstageContent: BackstageContentClassKey;
  BackstageContentHeader: ContentHeaderClassKey;
  BackstageErrorPage: ErrorPageClassKey;
  BackstageErrorPageMicDrop: MicDropClassKey;
  BackstageErrorPageStackDetails: StackDetailsClassKey;
  BackstageHeader: HeaderClassKey;
  BackstageHeaderLabel: HeaderLabelClassKey;
  BackstageHeaderTabs: HeaderTabsClassKey;
  BackstageInfoCard: InfoCardClassKey;
  BackstageInfoCardCardActionsTopRight: CardActionsTopRightClassKey;
  BackstageItemCardGrid: ItemCardGridClassKey;
  BackstageItemCardHeader: ItemCardHeaderClassKey;
  BackstagePage: PageClassKey;
  BackstageSidebar: SidebarClassKey;
  BackstageSidebarSpace: SidebarSpaceClassKey;
  BackstageSidebarSpacer: SidebarSpacerClassKey;
  BackstageSidebarDivider: SidebarDividerClassKey;
  BackstageSidebarItem: SidebarItemClassKey;
  BackstageSidebarSubmenu: SidebarSubmenuClassKey;
  BackstageSidebarSubmenuItem: SidebarSubmenuItemClassKey;
  BackstageSidebarPage: SidebarPageClassKey;
  BackstageCustomProvider: CustomProviderClassKey;
  BackstageSignInPage: SignInPageClassKey;
  BackstageTabbedCard: TabbedCardClassKey;
  BackstageTabbedCardBoldHeader: BoldHeaderClassKey;
  BackstageCardTab: CardTabClassKey;
  BackstageLink: LinkClassKey;
  BackstageFavoriteToggleIcon: FavoriteToggleIconClassKey;
};

/** @public */
export type BackstageOverrides = Overrides & {
  [Name in keyof BackstageComponentsNameToClassKey]?: Partial<
    StyleRules<BackstageComponentsNameToClassKey[Name]>
  >;
};

declare module '@backstage/theme' {
  interface OverrideComponentNameToClassKeys
    extends BackstageComponentsNameToClassKey {}
}
