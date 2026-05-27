import { childrenPropDefs, type PropDef } from '@/utils/propDefs';

export const breadcrumbsPropDefs: Record<string, PropDef> = {
  ...childrenPropDefs,
};

export const breadcrumbPropDefs: Record<string, PropDef> = {
  href: {
    type: 'string',
    description:
      'URL the breadcrumb navigates to. Omit for plain text segments. The last breadcrumb always renders as text regardless of href.',
  },
  ...childrenPropDefs,
};
