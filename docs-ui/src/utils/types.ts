export type Component =
  | 'accordion'
  | 'accordion-group'
  | 'accordion-panel'
  | 'accordion-trigger'
  | 'alert'
  | 'avatar'
  | 'box'
  | 'button'
  | 'button-icon'
  | 'button-link'
  | 'card'
  | 'card-body'
  | 'card-footer'
  | 'card-header'
  | 'cell'
  | 'cell-profile'
  | 'cell-text'
  | 'checkbox'
  | 'checkbox-group'
  | 'collapsible'
  | 'column'
  | 'container'
  | 'datatable'
  | 'dialog'
  | 'dialog-body'
  | 'dialog-footer'
  | 'dialog-header'
  | 'dialog-trigger'
  | 'field-error'
  | 'field-label'
  | 'flex'
  | 'full-page'
  | 'grid'
  | 'grid-item'
  | 'header'
  | 'header-page'
  | 'heading'
  | 'icon'
  | 'link'
  | 'list'
  | 'list-row'
  | 'menu'
  | 'menu-autocomplete'
  | 'menu-autocomplete-listbox'
  | 'menu-item'
  | 'menu-list-box'
  | 'menu-list-box-item'
  | 'menu-section'
  | 'menu-separator'
  | 'menu-trigger'
  | 'password-field'
  | 'plugin-header'
  | 'popover'
  | 'radio'
  | 'radio-group'
  | 'row'
  | 'scrollarea'
  | 'search-autocomplete'
  | 'search-autocomplete-item'
  | 'searchfield'
  | 'select'
  | 'skeleton'
  | 'submenu-trigger'
  | 'switch'
  | 'tab'
  | 'tab-list'
  | 'tab-panel'
  | 'table'
  | 'table-body'
  | 'table-header'
  | 'table-pagination'
  | 'table-root'
  | 'tabs'
  | 'tag'
  | 'tag-group'
  | 'text'
  | 'textfield'
  | 'toggle-button'
  | 'toggle-button-group'
  | 'tooltip'
  | 'tooltip-trigger'
  | 'visually-hidden';

export type Hook = 'use-breakpoint';

export type Version = `${number}.${number}.${number}`;

export type AtLeastOne<T, K extends keyof T = keyof T> = K extends string
  ? Pick<T, K> & Partial<Omit<T, K>>
  : never;

export type ChangelogProps = {
  description: string;
  version: Version;
  prs: string[];
  breaking?: boolean;
  commitSha?: string;
  migration?: string;
} & AtLeastOne<{
  components: Component[];
  hooks: Hook[];
}>;
