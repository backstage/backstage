/*
 * Copyright 2026 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { CSSProperties } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Hunk, Walkthrough } from '../walkthrough';

function lineStyle(line: string): CSSProperties {
  if (line.startsWith('@@')) {
    return { color: 'gray' };
  }
  if (line.startsWith('+')) {
    return { background: 'rgba(46, 160, 67, 0.2)' };
  }
  if (line.startsWith('-')) {
    return { background: 'rgba(248, 81, 73, 0.2)' };
  }
  return {};
}

function DiffHunk({ hunk }: { hunk: Hunk }) {
  return (
    <div style={{ marginTop: 12 }}>
      <Typography variant="caption">
        {hunk.file} (hunk {hunk.hunkIndex})
      </Typography>
      <pre
        style={{
          margin: 0,
          padding: 8,
          overflowX: 'auto',
          border: '1px solid rgba(128, 128, 128, 0.4)',
          fontSize: 12,
        }}
      >
        {hunk.text.split('\n').map((line, i) => (
          <div key={i} style={lineStyle(line)}>
            {line || ' '}
          </div>
        ))}
      </pre>
    </div>
  );
}

/** A linear, one step at a time walkthrough of a pull request. */
export function WalkthroughView(props: {
  walkthrough: Walkthrough;
  hunks: Hunk[];
  /** The zero based position of the step across all chapters. */
  step: number;
  onStepChange: (step: number) => void;
}) {
  const { walkthrough, hunks, onStepChange } = props;
  const flat = walkthrough.chapters.flatMap((chapter, chapterIndex) =>
    chapter.steps.map((step, stepIndex) => ({
      chapter,
      chapterIndex,
      step,
      stepIndex,
    })),
  );
  const index = Math.min(Math.max(props.step, 0), flat.length - 1);
  const { chapter, chapterIndex, step, stepIndex } = flat[index];
  const firstStepOf = (chapterNumber: number) =>
    flat.findIndex(f => f.chapterIndex === chapterNumber);

  return (
    <div style={{ display: 'flex', gap: 24, marginTop: 16, flexWrap: 'wrap' }}>
      <nav aria-label="Chapters" style={{ minWidth: 220 }}>
        <Typography variant="h6">Chapters</Typography>
        <ol style={{ paddingLeft: 20 }}>
          {walkthrough.chapters.map((c, i) => (
            <li key={i}>
              <Button
                size="small"
                color={i === chapterIndex ? 'primary' : 'default'}
                aria-current={i === chapterIndex ? 'step' : undefined}
                onClick={() => onStepChange(firstStepOf(i))}
              >
                {c.title}
              </Button>
            </li>
          ))}
        </ol>
      </nav>
      <section aria-label="Walkthrough step" style={{ flex: 1, minWidth: 300 }}>
        <Typography variant="overline">
          Chapter {chapterIndex + 1} of {walkthrough.chapters.length}, step{' '}
          {stepIndex + 1} of {chapter.steps.length}
        </Typography>
        <Typography variant="h5">{chapter.title}</Typography>
        {stepIndex === 0 && <Typography>{chapter.summary}</Typography>}
        <Typography variant="h6" style={{ marginTop: 16 }}>
          {step.title}
        </Typography>
        <Typography style={{ whiteSpace: 'pre-wrap' }}>
          {step.explanation}
        </Typography>
        {step.hunks.map(ref => {
          const hunk = hunks.find(
            h => h.file === ref.file && h.hunkIndex === ref.hunkIndex,
          );
          return hunk ? (
            <DiffHunk key={`${ref.file}#${ref.hunkIndex}`} hunk={hunk} />
          ) : null;
        })}
        <div style={{ marginTop: 16 }}>
          <Button
            disabled={index === 0}
            onClick={() => onStepChange(index - 1)}
          >
            Previous
          </Button>{' '}
          <Button
            variant="contained"
            color="primary"
            disabled={index === flat.length - 1}
            onClick={() => onStepChange(index + 1)}
          >
            Next
          </Button>{' '}
          <Typography component="span">
            {index + 1} / {flat.length}
          </Typography>
        </div>
      </section>
    </div>
  );
}
