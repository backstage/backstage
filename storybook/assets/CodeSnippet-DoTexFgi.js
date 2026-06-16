const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./CodeSnippetContent-BUK72lU-.js","./iframe-A5q7KvPV.js","./preload-helper-PPVm8Dsz.js","./iframe-8TKB6NNd.css","./Box-Do1kLFaD.js","./styled-CaiGGCTB.js","./CopyTextButton-DvCyKSRO.js","./useCopyToClipboard-BHlmIXZx.js","./useMountedState-D9Kraart.js","./Tooltip-DV_BwGfD.js","./Popper-FC50uWcj.js","./Portal-CYnqZvqi.js"])))=>i.map(i=>d[i]);
import{_ as r}from"./preload-helper-PPVm8Dsz.js";import{bR as t,ca as n}from"./iframe-A5q7KvPV.js";const i=n.lazy(()=>r(()=>import("./CodeSnippetContent-BUK72lU-.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11]),import.meta.url).then(e=>({default:e.CodeSnippet})));function s(e){return t.jsx(n.Suspense,{fallback:t.jsx("div",{}),children:t.jsx(i,{...e})})}s.__docgenInfo={description:`Thin wrapper on top of {@link https://react-syntax-highlighter.github.io/react-syntax-highlighter/ | react-syntax-highlighter}
providing consistent theming and copy code button

@public`,methods:[],displayName:"CodeSnippet",props:{text:{required:!0,tsType:{name:"string"},description:"Code Snippet text"},language:{required:!0,tsType:{name:"string"},description:"Language used by {@link CodeSnippetProps.text}"},showLineNumbers:{required:!1,tsType:{name:"boolean"},description:`Whether to show line number

@remarks

Default: false`},showCopyCodeButton:{required:!1,tsType:{name:"boolean"},description:`Whether to show button to copy code snippet

@remarks

Default: false`},highlightedNumbers:{required:!1,tsType:{name:"Array",elements:[{name:"number"}],raw:"number[]"},description:"Array of line numbers to highlight"},wrapLongLines:{required:!1,tsType:{name:"boolean"},description:"Whether to style the `<code>` block with `white-space: pre-wrap` or `white-space: pre`\n\n@remarks\n\nDefault: false (`white-space: pre`)"},customStyle:{required:!1,tsType:{name:"any"},description:`Custom styles applied to code

@remarks

Passed to {@link https://react-syntax-highlighter.github.io/react-syntax-highlighter/ | react-syntax-highlighter}`}}};export{s as C};
