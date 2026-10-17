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

import { useEffect, useRef, useState } from 'react';
import { useMatch, useNavigate, useResolvedPath } from 'react-router-dom';
import { Content, Header, Page } from '@backstage/core-components';
import { useApi } from '@backstage/frontend-plugin-api';
import {
  scmAuthApiRef,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import { aiGatewayApiRef } from '@backstage/plugin-ai-gateway-react';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { fetchPullRequestDiff, parsePullRequestUrl } from '../githubPr';
import { parseReviewResult, reviewSchema, ReviewResult } from '../review';

const SYSTEM_PROMPT =
  'You are a careful code reviewer. You are given the unified diff of a pull request. ' +
  'Report concrete problems only, referencing the file and, when known, the line in the new version.';

type Phase = 'fetching' | 'reviewing' | 'explaining';

const PHASE_LABELS: Record<Phase, string> = {
  fetching: 'Fetching the pull request diff...',
  reviewing: 'Reviewing the changes, this can take a minute...',
  explaining: 'Explaining the pull request...',
};

export function ReviewPage() {
  const scmAuth = useApi(scmAuthApiRef);
  const integrations = useApi(scmIntegrationsApiRef);
  const aiGateway = useApi(aiGatewayApiRef);

  const navigate = useNavigate();
  const basePath = useResolvedPath('.').pathname.replace(/\/$/, '');
  const match = useMatch(`${basePath}/github/:org/:repo/:number`);
  const routePrUrl = match?.params.number
    ? `https://github.com/${match.params.org}/${match.params.repo}/pull/${match.params.number}`
    : '';

  const [prUrl, setPrUrl] = useState(routePrUrl);
  const [instructions, setInstructions] = useState('');
  const [phase, setPhase] = useState<Phase>();
  const busy = phase !== undefined;
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState<string>();
  const [review, setReview] = useState<ReviewResult>();
  const [explanation, setExplanation] = useState('');
  const abort = useRef<AbortController>();

  useEffect(() => {
    if (routePrUrl) {
      setPrUrl(routePrUrl);
    }
  }, [routePrUrl]);

  const rememberPr = () => {
    try {
      const ref = parsePullRequestUrl(prUrl);
      if (ref.host === 'github.com') {
        navigate(`${basePath}/github/${ref.owner}/${ref.repo}/${ref.number}`);
      }
    } catch {
      // Invalid URLs are reported by the review run itself.
    }
  };

  const loadDiff = async () => {
    const result = await fetchPullRequestDiff({
      prUrl,
      integrations,
      getToken: async url => (await scmAuth.getCredentials({ url })).token,
    });
    setNotice(
      result.truncated
        ? `The diff of ${result.fileCount} files was truncated before being sent for review.`
        : undefined,
    );
    return result.diff;
  };

  const run = async (
    nextPhase: Phase,
    action: (diff: string) => Promise<void>,
  ) => {
    abort.current?.abort();
    rememberPr();
    setPhase('fetching');
    setError(undefined);
    try {
      const diff = await loadDiff();
      setPhase(nextPhase);
      await action(diff);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setPhase(undefined);
    }
  };

  const onReview = () =>
    run('reviewing', async diff => {
      setReview(undefined);
      const response = await aiGateway.generateObject({
        system: SYSTEM_PROMPT,
        prompt: `Review instructions: ${
          instructions || 'None'
        }\n\nPull request diff:\n${diff}`,
        schema: reviewSchema,
      });
      setReview(parseReviewResult(response.object));
    });

  const onExplain = () =>
    run('explaining', async diff => {
      setExplanation('');
      const controller = new AbortController();
      abort.current = controller;
      const stream = aiGateway.streamText(
        {
          system: 'Explain what this pull request does, in a short paragraph.',
          prompt: diff,
        },
        { signal: controller.signal },
      );
      for await (const delta of stream.textStream) {
        setExplanation(text => text + delta);
      }
    });

  return (
    <Page themeId="tool">
      <Header title="AI Code Review" subtitle="Nothing is posted to GitHub" />
      <Content>
        <TextField
          id="pr-url"
          label="Pull request URL"
          placeholder="https://github.com/owner/repo/pull/123"
          fullWidth
          margin="normal"
          value={prUrl}
          onChange={e => setPrUrl(e.target.value)}
        />
        <TextField
          id="review-instructions"
          label="Review instructions"
          fullWidth
          multiline
          margin="normal"
          value={instructions}
          onChange={e => setInstructions(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          disabled={busy || !prUrl}
          onClick={onReview}
        >
          Review
        </Button>{' '}
        <Button disabled={busy || !prUrl} onClick={onExplain}>
          Explain this PR
        </Button>
        {phase && (
          <div role="status" style={{ marginTop: 16 }}>
            <Typography>{PHASE_LABELS[phase]}</Typography>
            <LinearProgress />
          </div>
        )}
        {error && (
          <Typography color="error" role="alert" style={{ marginTop: 16 }}>
            {error}
          </Typography>
        )}
        {notice && <Typography>{notice}</Typography>}
        {explanation && (
          <Typography component="p" style={{ whiteSpace: 'pre-wrap' }}>
            {explanation}
          </Typography>
        )}
        {review && (
          <div>
            <Typography variant="h6">Summary</Typography>
            <Typography>{review.summary}</Typography>
            <Typography variant="h6">Findings</Typography>
            {review.findings.length === 0 && (
              <Typography>No findings.</Typography>
            )}
            <ul>
              {review.findings.map((f, i) => (
                <li key={i}>
                  <strong>{f.severity}</strong> {f.file}
                  {f.line ? `:${f.line}` : ''} - {f.comment}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Content>
    </Page>
  );
}
