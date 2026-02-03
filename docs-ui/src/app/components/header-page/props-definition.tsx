import { classNamePropDefs, type PropDef } from '@/utils/propDefs';
import { Chip } from '@/components/Chip';

export const headerPagePropDefs: Record<string, PropDef> = {
  title: {
    type: 'string',
    description: 'Page heading displayed in the header.',
  },
  customActions: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Custom elements rendered in the actions area.',
  },
  tabs: {
    type: 'complex',
    description: 'Navigation tabs displayed below the title.',
    complexType: {
      name: 'HeaderTab[]',
      properties: {
        id: {
          type: 'string',
          required: true,
          description: 'Unique identifier for the tab.',
        },
        label: {
          type: 'string',
          required: true,
          description: 'Display text for the tab.',
        },
        href: {
          type: 'string',
          required: true,
          description: 'URL to navigate to when tab is clicked.',
        },
        matchStrategy: {
          type: "'exact' | 'prefix'",
          required: false,
          default: "'exact'",
          description: (
            <>
              Route matching strategy. Use <Chip>exact</Chip> for exact path
              match, <Chip>prefix</Chip> if pathname starts with href.
            </>
          ),
        },
      },
    },
  },
  breadcrumbs: {
    type: 'complex',
    description: 'Breadcrumb trail displayed above the title.',
    complexType: {
      name: 'HeaderPageBreadcrumb[]',
      properties: {
        label: {
          type: 'string',
          required: true,
          description: 'Display text for the breadcrumb. Truncated at 240px.',
        },
        href: {
          type: 'string',
          required: true,
          description: 'URL for the breadcrumb link.',
        },
      },
    },
  },
  ...classNamePropDefs,
};
