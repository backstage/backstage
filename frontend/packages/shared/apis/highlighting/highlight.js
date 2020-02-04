import React from 'react';

import 'highlight.js/styles/atom-one-dark.css';

let library;
function loadLibrary() {
  if (library) {
    return Promise.resolve(library);
  }
  const name = str => m => [str, m.default || m];

  // Full path specs are needed for supported languages so that webpack knows how to properly bundle this library.
  return Promise.all([
    import(/* webpackChunkName: "highlight-js" */ 'highlight.js/lib/highlight.js'),
    import(/* webpackChunkName: "highlight-js" */ 'highlight.js/lib/languages/bash.js').then(name('bash')),
    import(/* webpackChunkName: "highlight-js" */ 'highlight.js/lib/languages/cpp.js').then(name('cpp')),
    import(/* webpackChunkName: "highlight-js" */ 'highlight.js/lib/languages/dockerfile.js').then(name('docker')),
    import(/* webpackChunkName: "highlight-js" */ 'highlight.js/lib/languages/go.js').then(name('go')),
    import(/* webpackChunkName: "highlight-js" */ 'highlight.js/lib/languages/groovy.js').then(name('groovy')),
    import(/* webpackChunkName: "highlight-js" */ 'highlight.js/lib/languages/java.js').then(name('java')),
    import(/* webpackChunkName: "highlight-js" */ 'highlight.js/lib/languages/javascript.js').then(name('javascript')),
    import(/* webpackChunkName: "highlight-js" */ 'highlight.js/lib/languages/json.js').then(name('json')),
    import(/* webpackChunkName: "highlight-js" */ 'highlight.js/lib/languages/kotlin.js').then(name('kotlin')),
    import(/* webpackChunkName: "highlight-js" */ 'highlight.js/lib/languages/markdown.js').then(name('markdown')),
    import(/* webpackChunkName: "highlight-js" */ 'highlight.js/lib/languages/objectivec.js').then(name('objectivec')),
    import(/* webpackChunkName: "highlight-js" */ 'highlight.js/lib/languages/python.js').then(name('python')),
    import(/* webpackChunkName: "highlight-js" */ 'highlight.js/lib/languages/ruby.js').then(name('ruby')),
    import(/* webpackChunkName: "highlight-js" */ 'highlight.js/lib/languages/scala.js').then(name('scala')),
    import(/* webpackChunkName: "highlight-js" */ 'highlight.js/lib/languages/swift.js').then(name('swift')),
    import(/* webpackChunkName: "highlight-js" */ 'highlight.js/lib/languages/typescript.js').then(name('typescript')),
    import(/* webpackChunkName: "highlight-js" */ 'highlight.js/lib/languages/xml.js').then(name('xml')),
    import(/* webpackChunkName: "highlight-js" */ 'highlight.js/lib/languages/yaml.js').then(name('yaml')),
  ]).then(([highlight, ...langs]) => {
    langs.forEach(([moduleName, module]) => {
      highlight.registerLanguage(moduleName, module);
    });
    library = highlight;
    return highlight;
  });
}

/*
 * Given a file extension, repo name, and array of code lines, return a Promise resolving
 * to an array of formatted lines with html/css formatting.
 *
 * @param {String} fileExtension The extension of the source file
 * @param {String} repo The name of the code repository
 * @param {Array<String>} lines The source code lines
 *
 * @returns {Promise<Array<String>>} Promise of formatted lines
 *
 * @see http://highlightjs.readthedocs.io/en/latest/api.html#highlight-name-value-ignore-illegals-continuation
 */
export function highlightLines(fileExtension, repo, lines) {
  return loadLibrary().then(highlight => {
    const formattedLines = [];
    let state = null;

    let fileformat = fileExtension;
    // edge case for .h fileExtension
    if (fileExtension === 'h') {
      if (repo === 'client-core') {
        fileformat = 'cpp';
      } else {
        fileformat = 'objectivec';
      }
    }

    // edge case for .m fileExtension
    if (fileExtension === 'm') {
      fileformat = 'objectivec';
    }

    // make sure tsx and jsx are interpreted correctly
    if (fileExtension === 'tsx') {
      fileformat = 'typescript';
    }
    if (fileExtension === 'jsx') {
      fileformat = 'javascript';
    }
    if (fileExtension === 'kt') {
      fileformat = 'kotlin';
    }

    lines.forEach(line => {
      const result = highlight.highlight(fileformat, line, true, state);
      state = result.top;
      formattedLines.push(highlight.fixMarkup(result.value));
    });
    return formattedLines;
  });
}

/**
 * Given a block of code, return a formatted string with the code highlighted, using language detection
 *
 * @param {String} block The block of code.
 *
 * @returns {Promise<Void>} Promise resolving when highlighting is complete.
 */
export const highlightBlock = block => loadLibrary().then(highlight => highlight.highlightBlock(block));

/**
 * This React component should maintain a compatible API with the "react-highlight" module. Using our own
 * module ensures that we can
 * 1) Only load the languages we really need
 * 2) Configure the webpack async chunk in one place (the loadLibrary() function).
 */
export class Highlight extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      highlighted: [],
    };
  }

  componentDidMount() {
    const { language, children: body } = this.props;
    highlightLines(language, null, body.split('\n')).then(lines => {
      this.setState({
        highlighted: lines,
      });
    });
  }

  render() {
    return (
      <pre>
        <code className="hljs" style={{ borderRadius: 5 }} dangerouslySetInnerHTML={this.buildMarkup()} />
      </pre>
    );
  }

  buildMarkup() {
    return {
      __html: this.state.highlighted.join('<br />'),
    };
  }
}
