export type Component =
  | 'avatar'
  | 'box'
  | 'button'
  | 'button-link'
  | 'heading'
  | 'text'
  | 'button-icon'
  | 'icon'
  | 'tabs'
  | 'menu'
  | 'textfield'
  | 'datatable'
  | 'select'
  | 'collapsible'
  | 'accordion'
  | 'checkbox'
  | 'container'
  | 'link'
  | 'tooltip'
  | 'scrollarea'
  | 'flex'
  | 'switch'
  | 'grid'
  | 'searchfield'
  | 'radio-group'
  | 'card'
  | 'skeleton'
  | 'header'
  | 'header-page'
  | 'password-field'
  | 'table'
  | 'visually-hidden'
  | 'dialog'
  | 'tag-group';

export type Version = `${number}.${number}.${number}`;

export interface ChangelogProps {
  components: Component[];
  description: string;
  version: Version;
  prs: string[];
  breaking?: boolean;
  commitSha?: string;
  migration?: string;
}
