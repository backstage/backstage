#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { config, requireApiKey } from './config';
import { tasks, getTask } from './tasks/index';
import { runBaseline } from './modes/baseline';
import { runWithMcp } from './modes/with-mcp';
import { getDocumentation, isMcpReachable } from './modes/mcp-client';
import { judge } from './judge/index';
import { printReport, formatDuration } from './reporter';
import type { EvalResult, EvalTask, RunReport } from './types';

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

function getArg(flag: string): string | undefined {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : undefined;
}

function hasFlag(flag: string): boolean {
  return args.includes(flag);
}

const modeArg = getArg('--mode') ?? 'both';
const taskArg = getArg('--task');

if (!['baseline', 'mcp', 'both'].includes(modeArg)) {
  console.error(`Invalid --mode "${modeArg}". Use: baseline | mcp | both`);
  process.exit(1);
}

const runBaselines = modeArg === 'baseline' || modeArg === 'both';
const runMcp = modeArg === 'mcp' || modeArg === 'both';
const selectedTasks: EvalTask[] = taskArg ? [getTask(taskArg)] : tasks;

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  requireApiKey();

  console.log(`\nBackstage UI MCP Evals`);
  console.log(`Tasks:  ${selectedTasks.map(t => t.id).join(', ')}`);
  console.log(`Mode:   ${modeArg}`);
  console.log(`Model:  ${config.anthropicModel}\n`);

  if (runMcp) {
    const reachable = await isMcpReachable();
    if (!reachable) {
      console.error(
        `Error: Storybook MCP server is not reachable at ${config.mcpUrl}\n` +
          `Start Storybook first: yarn storybook\n` +
          `Or run baseline-only mode: yarn eval:ui --mode baseline`,
      );
      process.exit(1);
    }
    console.log(`MCP server reachable at ${config.mcpUrl}\n`);
  }

  const results: EvalResult[] = [];

  for (const task of selectedTasks) {
    console.log(`Running task: ${task.id} [${task.tier}]`);

    // ----- Baseline -----
    if (runBaselines) {
      const start = Date.now();
      process.stdout.write(`  baseline... `);
      let baselineResult: EvalResult;
      try {
        const code = await runBaseline(task);
        const scores = judge({ task, code });
        baselineResult = {
          taskId: task.id,
          tier: task.tier,
          mode: 'baseline',
          generatedCode: code,
          scores,
          durationMs: Date.now() - start,
        };
        console.log(
          `done (${formatDuration(Date.now() - start)}) — composite: ${
            scores.composite
          }%`,
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        baselineResult = {
          taskId: task.id,
          tier: task.tier,
          mode: 'baseline',
          generatedCode: '',
          scores: {
            propAccuracy: null,
            importCorrectness: 0,
            componentSelection: 0,
            recipeConformance: null,
            composite: 0,
          },
          durationMs: Date.now() - start,
          error: msg,
        };
        console.log(`ERROR: ${msg}`);
      }
      results.push(baselineResult);
    }

    // ----- MCP -----
    if (runMcp) {
      const start = Date.now();
      process.stdout.write(`  mcp...      `);
      let mcpResult: EvalResult;
      try {
        const { code, docsUsed } = await runWithMcp(task);

        // Build the docs map for prop accuracy scoring
        const mcpDocs = new Map<string, string>();
        await Promise.allSettled(
          docsUsed.map(async component => {
            const doc = await getDocumentation(component);
            mcpDocs.set(component, doc);
          }),
        );

        const scores = judge({ task, code, mcpDocs });
        mcpResult = {
          taskId: task.id,
          tier: task.tier,
          mode: 'mcp',
          generatedCode: code,
          scores,
          mcpDocsUsed: docsUsed,
          durationMs: Date.now() - start,
        };
        console.log(
          `done (${formatDuration(Date.now() - start)}) — composite: ${
            scores.composite
          }%`,
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        mcpResult = {
          taskId: task.id,
          tier: task.tier,
          mode: 'mcp',
          generatedCode: '',
          scores: {
            propAccuracy: null,
            importCorrectness: 0,
            componentSelection: 0,
            recipeConformance: null,
            composite: 0,
          },
          durationMs: Date.now() - start,
          error: msg,
        };
        console.log(`ERROR: ${msg}`);
      }
      results.push(mcpResult);
    }
  }

  // -------------------------------------------------------------------------
  // Report
  // -------------------------------------------------------------------------

  const report: RunReport = {
    timestamp: new Date().toISOString(),
    results,
  };

  printReport(report);

  mkdirSync(config.resultsDir, { recursive: true });
  const ts = new Date()
    .toISOString()
    .replace(/:/g, '-')
    .replace(/\.\d+Z$/, 'Z');
  const outPath = join(config.resultsDir, `${ts}.json`);
  writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log(`Results saved to: ${outPath}\n`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
