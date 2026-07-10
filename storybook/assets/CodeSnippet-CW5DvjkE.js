const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./CodeSnippetContent-D-_CJXGK.js","./iframe-B-XWDeDQ.js","./preload-helper-PPVm8Dsz.js","./iframe-8TKB6NNd.css","./Box-B2gdNV-U.js","./styled-BkxpGzDj.js","./CopyTextButton-C1Tg5Cdg.js","./useCopyToClipboard-Bl9FFERX.js","./useMountedState-BukLh9ih.js","./Tooltip-D4Ye8L4j.js","./useObjectRef-BjeGjbpr.js","./useOverlayTriggerState-Bvm7VbjX.js","./utils-DALzhVoK.js","./useFocusRing-rcGClAZz.js","./openLink-m4-wtxGX.js","./number-CqHCUUB4.js","./I18nProvider-DDduGJCb.js","./useControlledState-BYvHYB8a.js","./animation-DroFJ5da.js","./useHover-CNCT38hS.js","./Tooltip-Dph3L7iz.css","./ButtonIcon-CLqLS6zp.js","./Button-Ce-wB0G_.js","./Label-D7GSmtfn.js","./Hidden-BedOfKsW.js","./useLabel-DttkFmAP.js","./useLabels-B3aofaea.js","./useButton-Br7mSKpa.js","./usePress-RR4GC8Vt.js","./textSelection-BxRq1vrn.js","./index-Bhxil5SO.js","./ButtonIcon-CQocIL5P.css"])))=>i.map(i=>d[i]);
import{_ as r}from"./preload-helper-PPVm8Dsz.js";import{bR as t,ca as n}from"./iframe-B-XWDeDQ.js";const i=n.lazy(()=>r(()=>import("./CodeSnippetContent-D-_CJXGK.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]),import.meta.url).then(e=>({default:e.CodeSnippet})));function s(e){return t.jsx(n.Suspense,{fallback:t.jsx("div",{}),children:t.jsx(i,{...e})})}s.__docgenInfo={description:`Thin wrapper on top of {@link https://react-syntax-highlighter.github.io/react-syntax-highlighter/ | react-syntax-highlighter}
providing consistent theming and copy code button

@public`,methods:[],displayName:"CodeSnippet",props:{text:{required:!0,tsType:{name:"string"},description:"Code Snippet text"},language:{required:!0,tsType:{name:"string"},description:"Language used by {@link CodeSnippetProps.text}"},showLineNumbers:{required:!1,tsType:{name:"boolean"},description:`Whether to show line number

@remarks

Default: false`},showCopyCodeButton:{required:!1,tsType:{name:"boolean"},description:`Whether to show button to copy code snippet

@remarks

Default: false`},highlightedNumbers:{required:!1,tsType:{name:"Array",elements:[{name:"number"}],raw:"number[]"},description:"Array of line numbers to highlight"},wrapLongLines:{required:!1,tsType:{name:"boolean"},description:"Whether to style the `<code>` block with `white-space: pre-wrap` or `white-space: pre`\n\n@remarks\n\nDefault: false (`white-space: pre`)"},customStyle:{required:!1,tsType:{name:"any"},description:`Custom styles applied to code

@remarks

Passed to {@link https://react-syntax-highlighter.github.io/react-syntax-highlighter/ | react-syntax-highlighter}`}}};export{s as C};
