import { render } from '@testing-library/react';
import { averagePassRate, durationLabel, pluralize, flakinessRate } from './utils';
import { passRateRenderer, flakyRateRenderer, ownerCellRenderer, statusRenderer } from './renderers';
import { wrapInTestApp, wrapInThemedTestApp } from 'testUtils';

describe('codehealth utils', () => {
  describe('averagePassRate', () => {
    describe('when there are no tests', () => {
      it('returns null', () => {
        expect(averagePassRate([])).toBe(null);
      });
    });

    describe('when there are no valid tests', () => {
      it('returns null', () => {
        const testRuns = [
          // This test-run of zeros will cause the passRate() function in utils
          // to return MAX_SAFE_INTEGER which should cause averagePassRate to
          // have tests, but no valid tests.
          createTestRun({ successful: 0, failed: 0 }),
        ];
        expect(averagePassRate(testRuns)).toBe(null);
      });
    });

    describe('when there are tests', () => {
      it('returns 100% on only succesful', () => {
        const testRuns = [
          createTestRun({ successful: 10 }),
          createTestRun({ successful: 20 }),
          createTestRun({ successful: 30 }),
        ];
        expect(averagePassRate(testRuns)).toBe(100);
      });
      it('correctly calculates average percentage', () => {
        const testRuns = [
          createTestRun({ successful: 150 }), // 100% passed
          createTestRun({ successful: 10, failed: 10 }), // 50% passed
          createTestRun({ failed: 30 }), // 0 passed
        ];
        expect(averagePassRate(testRuns)).toBe(50);
      });
      it('ignores entirely skipped tests', () => {
        const testRuns = [
          createTestRun({ successful: 50 }),
          createTestRun({ skipped: 200 }),
          createTestRun({ failed: 50, skipped: 200 }),
        ];
        expect(averagePassRate(testRuns)).toBe(50);
      });
    });
  });
  it('calcualtes duration', () => {
    const ms = durationLabel(200);
    const sec = durationLabel(2000);
    const min = durationLabel(120000);
    expect(ms).toBe('200 ms');
    expect(sec).toBe('2.00 sec');
    expect(min).toBe('2.00 min');
  });
  it('pluralizes', () => {
    const singular = pluralize(1, 'run');
    const plural = pluralize(2, 'run');
    expect(singular).toBe('run');
    expect(plural).toBe('runs');
  });
  it('calculates flakiness', () => {
    const noRuns = flakinessRate({ failed: 0, successful: 0, flaked: 0 });
    const notFlaky = flakinessRate({ failed: 1, successful: 1, flaked: 0 });
    const flaky = flakinessRate({ failed: 1, successful: 1, flaked: 1 });
    expect(noRuns).toBe(0);
    expect(notFlaky).toBe(0);
    expect(flaky).toBe(0.5);
  });
});

describe('renderers', () => {
  it('passRateRenderer', () => {
    const { getByTitle, getByText } = render(
      passRateRenderer({ row: createTestRun({ successful: 1, failed: 1 }), value: 50 }),
    );
    getByTitle('1 successful / 2 runs - Click to view latest invocations');
    getByText('50.00%');
  });
  it('flakyRateRenderer', () => {
    const { getByText } = render(flakyRateRenderer({ value: 0.11111 }));
    getByText('11.11%');
  });
  it('ownerCellRenderer', () => {
    const { getByText } = render(wrapInTestApp(ownerCellRenderer({ row: { owner: 'mockOwner' } })));
    getByText('mockOwner');
  });
  it('ownerCellRenderer', () => {
    const { getByText } = render(wrapInTestApp(ownerCellRenderer({ row: {} })));
    getByText('(unknown)');
  });
  it('statusRenderer', () => {
    const { getByText } = render(wrapInThemedTestApp(statusRenderer({ row: { status: 'ok' } })));
    getByText('OK');
  });
});

function createTestRun(aggregateCount) {
  return {
    aggregateCount: {
      successful: 0,
      failed: 0,
      skipped: 0,
      flaked: 0,
      clusterFlaked: 0,
      ...aggregateCount,
    },
  };
}
