import React from 'react';
import pluralize from 'pluralize';
import { renderInTestApp } from '@backstage/test-utils';
import { ProjectGrowthAlert } from './ProjectGrowthAlert';
import { ProjectGrowthData } from '../types';
import {
  MockCurrencyProvider,
  MockConfigProvider,
  MockBillingDateProvider,
} from '../utils/tests';

const mockData: ProjectGrowthData = {
  project: 'test-project',
  periodStart: '2021-01-01',
  periodEnd: '2021-02-01',
  aggregation: [0, 0],
  change: {
    ratio: 0,
    amount: 0
  },
  products: [
    {
      id: 'product-a',
      aggregation: [0, 0]
    }
  ],
};

// suppress recharts componentDidUpdate deprecation warnings
jest.spyOn(console, 'warn').mockImplementation(() => { });

async function renderInContext(children: JSX.Element) {
  return renderInTestApp(
    <MockConfigProvider>
      <MockBillingDateProvider>
        <MockCurrencyProvider>
          {children}
        </MockCurrencyProvider>
      </MockBillingDateProvider>
    </MockConfigProvider>
  )
}

class CustomProjectGrowthAlert extends ProjectGrowthAlert {
  get url() {
    return 'path/to/resource';
  }
  get title() {
    return `Investigate cost growth in ${pluralize('project', this.data.products.length, true)}`;
  }
}

describe('ProjectGrowthAlert', () => {
  describe('constructor', () => {
    it('should create a project growth alert', async () => {
      const alert = new ProjectGrowthAlert(mockData);
      const { getByText, queryByText } = await renderInContext(alert.element);

      expect(alert.url).toBe('/cost-insights/investigating-growth');
      expect(alert.title).toBe('Investigate cost growth in project test-project');
      expect(alert.subtitle).toBe('Cost growth outpacing business growth is unsustainable long-term.');
      expect(getByText('1 product')).toBeInTheDocument();
      expect(queryByText('sorted by cost')).not.toBeInTheDocument();
    });

    it('a subclass can inherit and override defaults using accessors', async () => {
      const alert = new CustomProjectGrowthAlert(mockData);
      const { getByText, queryByText } = await renderInContext(alert.element);

      expect(alert.url).toBe('path/to/resource');
      expect(alert.title).toBe('Investigate cost growth in 1 project');
      expect(alert.subtitle).toBe('Cost growth outpacing business growth is unsustainable long-term.');
      expect(getByText('1 product')).toBeInTheDocument();
      expect(queryByText('sorted by cost')).not.toBeInTheDocument();
    });
  });
})
