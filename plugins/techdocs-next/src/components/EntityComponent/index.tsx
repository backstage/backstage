import React from 'react';
import { useParams } from 'react-router';
import { useAsync } from 'react-use';
import { Octokit } from '@octokit/core';
import renderToString from 'next-mdx-remote/render-to-string';
import hydrate from 'next-mdx-remote/hydrate';
import { Live } from './Live';
import { Counter } from './Counter';
import { Variable, VariableInput, VariablesProvider } from './Variable';

const MyContext = React.createContext(1);

const components = {
  Counter,
  Live,
  Variable,
  VariableInput,
};

function GeneralProvider({
  children,
}: {
  children: React.ReactNode;
  foo: string;
}) {
  return (
    <VariablesProvider>
      <MyContext.Provider value={2}>{children}</MyContext.Provider>
    </VariablesProvider>
  );
}

const provider = {
  component: GeneralProvider,
  props: {},
};

export function EntityComponent() {
  const params = useParams();

  const { loading, value, error } = useAsync(async () => {
    const octokit = new Octokit({
      auth: `YOUT GITHUB AUTH KEY HERE`,
      baseUrl: 'YOUR GITHUB BASE URL HERE',
    });

    const [owner, repo, ...path] = params['*'].split('/');

    const response = await octokit.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        owner,
        repo,
        path: path.join('/'),
      },
    );

    const { data } = response;

    //   @ts-ignore
    const buffer = Buffer.from(data.content, 'base64');

    const source = buffer.toString('utf8');

    const mdxSource = await renderToString(source, { components, provider });

    return mdxSource;
  });

  if (error) return <h1>{JSON.stringify(error.message)}</h1>;

  if (loading || !value) return <>Loading...</>;

  return <RemoteMDX source={value} />;
}

function RemoteMDX({ source }: { source: any }) {
  const result = hydrate(source, { components, provider });

  return (
    <main style={{ padding: 40 }}>
      <article>{result}</article>
    </main>
  );
}
