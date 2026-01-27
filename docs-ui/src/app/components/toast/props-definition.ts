import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const toastContentPropDefs: Record<string, PropDef> = {
  title: {
    type: 'enum',
    values: ['React.ReactNode'],
    responsive: false,
  },
  description: {
    type: 'enum',
    values: ['React.ReactNode'],
    responsive: false,
  },
  status: {
    type: 'enum',
    values: ['info', 'success', 'warning', 'danger'],
    responsive: false,
    default: 'info',
  },
  icon: {
    type: 'enum',
    values: ['boolean', 'React.ReactElement'],
    responsive: false,
    default: 'true',
  },
};

export const toastRegionPropDefs: Record<string, PropDef> = {
  queue: {
    type: 'enum',
    values: ['ToastQueue<ToastContent>'],
    responsive: false,
  },
  ...classNamePropDefs,
};
