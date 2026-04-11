import type { RunReport, EvalResult, JudgeScores } from './types';

function fmt(score: number | null): string {
  if (score === null) return '  —  ';
  const bar = score >= 80 ? '✓' : score >= 50 ? '~' : '✗';
  return `${String(score).padStart(3)}% ${bar}`;
}

function row(result: EvalResult): string {
  const { taskId, mode, scores } = result;
  const modeLabel = mode === 'mcp' ? 'MCP   ' : 'Baseline';
  return [
    taskId.padEnd(22),
    modeLabel,
    fmt(scores.importCorrectness).padEnd(8),
    fmt(scores.componentSelection).padEnd(8),
    fmt(scores.propAccuracy).padEnd(8),
    fmt(scores.recipeConformance).padEnd(8),
    fmt(scores.composite),
  ].join('  ');
}

export function printReport(report: RunReport): void {
  const header = [
    'Task'.padEnd(22),
    'Mode    ',
    'Imports '.padEnd(8),
    'Comps   '.padEnd(8),
    'Props   '.padEnd(8),
    'Recipe  '.padEnd(8),
    'Score',
  ].join('  ');

  const divider = '─'.repeat(header.length);
  console.log('\n' + divider);
  console.log(header);
  console.log(divider);

  // Group results: baseline then mcp for each task
  const taskIds = [...new Set(report.results.map(r => r.taskId))];
  for (const taskId of taskIds) {
    const taskResults = report.results.filter(r => r.taskId === taskId);
    const baseline = taskResults.find(r => r.mode === 'baseline');
    const mcp = taskResults.find(r => r.mode === 'mcp');
    if (baseline) console.log(row(baseline));
    if (mcp) console.log(row(mcp));

    // Delta line when both are available
    if (baseline && mcp) {
      const delta = mcp.scores.composite - baseline.scores.composite;
      const sign = delta >= 0 ? '+' : '';
      const symbol = delta > 5 ? '↑' : delta < -5 ? '↓' : '→';
      const pad = ''.padEnd(22 + 2 + 8 + 2 + 8 + 2 + 8 + 2 + 8 + 2 + 8 + 2);
      console.log(`${pad}${symbol} ${sign}${delta}%`);
    }
    console.log(divider);
  }

  // Overall summary
  const baselineResults = report.results.filter(r => r.mode === 'baseline');
  const mcpResults = report.results.filter(r => r.mode === 'mcp');
  const avg = (arr: EvalResult[]) =>
    arr.length === 0
      ? null
      : Math.round(
          arr.reduce((s, r) => s + r.scores.composite, 0) / arr.length,
        );

  const baselineAvg = avg(baselineResults);
  const mcpAvg = avg(mcpResults);

  console.log('\nOverall averages:');
  if (baselineAvg !== null) console.log(`  Baseline: ${baselineAvg}%`);
  if (mcpAvg !== null) {
    console.log(`  MCP:      ${mcpAvg}%`);
    if (baselineAvg !== null) {
      const lift = mcpAvg - baselineAvg;
      console.log(`  Lift:     ${lift >= 0 ? '+' : ''}${lift}%`);
    }
  }
  console.log();
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}
