import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const alertPropDefs: Record<string, PropDef> = {
  status: {
    type: 'enum',
    values: ['info', 'success', 'warning', 'danger'],
    responsive: true,
    default: 'info',
    description:
      'Visual status of the alert, which determines color and default icon.',
  },
  icon: {
    type: 'enum',
    values: ['boolean', 'React.ReactElement'],
    responsive: false,
    description:
      'Set to true to show the default status icon, or pass a custom icon element. Set to false to hide the icon.',
  },
  isPending: {
    type: 'boolean',
    default: 'false',
    description:
      'Replaces the icon with a spinner to indicate a pending operation.',
  },
  loading: {
    type: 'boolean',
    default: 'false',
    description: 'Deprecated. Use `isPending` instead.',
  },
  title: {
    type: 'enum',
    values: ['React.ReactNode'],
    responsive: false,
    description: 'Primary message displayed in the alert.',
  },
  description: {
    type: 'enum',
    values: ['React.ReactNode'],
    responsive: false,
    description: 'Additional detail shown below the title.',
  },
  customActions: {
    type: 'enum',
    values: ['React.ReactNode'],
    responsive: false,
    description:
      'Custom action buttons displayed on the right side of the alert.',
  },
  m: {
    type: 'enum',
    values: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    responsive: true,
  },
  mx: {
    type: 'enum',
    values: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    responsive: true,
  },
  my: {
    type: 'enum',
    values: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    responsive: true,
  },
  mt: {
    type: 'enum',
    values: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    responsive: true,
  },
  mb: {
    type: 'enum',
    values: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    responsive: true,
  },
  ml: {
    type: 'enum',
    values: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    responsive: true,
  },
  mr: {
    type: 'enum',
    values: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    responsive: true,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
