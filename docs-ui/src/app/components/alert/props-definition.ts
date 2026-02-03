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
  },
  icon: {
    type: 'enum',
    values: ['boolean', 'React.ReactElement'],
    responsive: false,
  },
  loading: {
    type: 'enum',
    values: ['boolean'],
    responsive: false,
  },
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
  customActions: {
    type: 'enum',
    values: ['React.ReactNode'],
    responsive: false,
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
