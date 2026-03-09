import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const statCardPropDefs: Record<string, PropDef> = {
  label: {
    type: 'string',
    responsive: false,
    description: 'The label describing the statistic.',
    required: true,
  },
  value: {
    type: 'enum',
    values: ['string', 'number'],
    responsive: false,
    description: 'The value/metric to display.',
    required: true,
  },
  trend: {
    type: 'string',
    responsive: false,
    description: 'Optional trend indicator (e.g., "+12%", "-5%").',
  },
  status: {
    type: 'enum',
    values: ['success', 'warning', 'error', 'info', 'neutral'],
    responsive: false,
    description: 'Status indicator for the metric.',
    default: 'neutral',
  },
  icon: {
    type: 'enum',
    values: ['ReactNode'],
    responsive: false,
    description: 'Optional icon to display alongside the label.',
  },
  description: {
    type: 'string',
    responsive: false,
    description: 'Additional description or context.',
  },
  onPress: {
    type: 'enum',
    values: ['() => void'],
    responsive: false,
    description:
      'Handler called when the card is clicked. Makes the card interactive as a button.',
  },
  href: {
    type: 'string',
    responsive: false,
    description:
      'URL to navigate to. Makes the card interactive as a link. Mutually exclusive with onPress.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
