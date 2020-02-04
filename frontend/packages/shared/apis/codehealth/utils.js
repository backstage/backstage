export const UNKNOWN_DISPLAY_VALUE = '(unknown)';

export const pluralize = (length, targetString) => {
  if (length !== 1) {
    targetString += 's';
  }
  return targetString;
};

/**
 * Get percentage of passed test runs
 * @param skipped
 * @param failed
 * @param successful
 * @param flaked
 * @returns {number} - Percentage
 */
export const passRate = ({ /* skipped,  */ failed, successful /* , flaked */ }) => {
  const totalRuns = successful + failed;
  if (totalRuns === 0) {
    return Number.MAX_SAFE_INTEGER;
  }
  return (successful / totalRuns) * 100;
};

/**
 * Get average percentage of passed test runs for all tests
 * @param tests
 * @returns {number} - Percentage
 */
export const averagePassRate = tests => {
  // no tests found for this component
  if (!tests.length) {
    return null;
  }

  const validTests = tests.map(test => passRate(test.aggregateCount)).filter(rate => rate !== Number.MAX_SAFE_INTEGER);

  // no valid tests found for this component
  if (!validTests.length) {
    return null;
  }

  return validTests.reduce((sum, rate) => sum + rate, 0) / validTests.length;
};

/**
 * Get flakiness rate
 * @param skipped
 * @param failed
 * @param successful
 * @param flaked
 * @param clusterFlaked
 * @returns {number}
 */
export const flakinessRate = ({ /* skipped,  */ failed, successful, flaked, clusterFlaked }) => {
  const totalRuns = successful + failed;
  if (totalRuns > 0) {
    return (1.0 * Math.max(flaked || 0, clusterFlaked || 0)) / totalRuns;
  }
  return 0;
};

export const durationLabel = durationMs => {
  const ms = parseInt(durationMs, 10);
  if (ms < 1000) {
    return `${ms} ms`;
  } else if (ms < 60000) {
    return `${(ms / 1000.0).toFixed(2)} sec`;
  } else {
    return `${(ms / 60000.0).toFixed(2)} min`;
  }
};
