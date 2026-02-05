const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./RealLogViewer-BzGoqY9i.js","./iframe-M9O-K8SB.js","./preload-helper-PPVm8Dsz.js","./iframe-DuVk3JC9.css","./useCopyToClipboard-BSGGLx0n.js","./useMountedState-CLl1ZXx0.js","./FilterList-elBNsbRp.js","./startCase-Bx25Gkjz.js","./toString-jlmj72dF.js","./isSymbol-DYihM2bc.js","./upperFirst-4VmgVgGz.js","./Link-Btc0GL0z.js","./lodash-Czox7iJy.js","./index-CuiKZooy.js","./useAnalytics-8ya555GT.js","./useApp-Citse85p.js","./ChevronRight-ZVgUIzdG.js","./TextField-Dl4vLPoK.js","./Select-ByRkfEZ7.js","./index-B9sM2jn7.js","./Popover-9y8CeMZr.js","./Modal-Bu63BRBX.js","./Portal-B9990TVI.js","./List-DFXlWgcm.js","./ListContext-CQy2fJuy.js","./formControlState-ByiNFc8I.js","./useFormControl-CnxnhVyN.js","./FormLabel-CaD7F1Na.js","./InputLabel-BRgQ3qkL.js","./Box-DrVgjJoD.js","./styled-Ddkk_tuK.js"])))=>i.map(i=>d[i]);
import{j as i,r as a}from"./iframe-M9O-K8SB.js";import{_ as n}from"./preload-helper-PPVm8Dsz.js";import{u as p}from"./useApp-Citse85p.js";import{w as l}from"./appWrappers-k5-JRCH3.js";import"./useObservable-CuDF8Tct.js";import"./useIsomorphicLayoutEffect-9yTSWmeM.js";import"./useAnalytics-8ya555GT.js";import"./useAsync-CFnaQwpM.js";import"./useMountedState-CLl1ZXx0.js";import"./componentData-lwFigNXQ.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CuiKZooy.js";const c=a.lazy(()=>n(()=>import("./RealLogViewer-BzGoqY9i.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]),import.meta.url).then(o=>({default:o.RealLogViewer})));function s(o){const{Progress:m}=p().getComponents();return i.jsx(a.Suspense,{fallback:i.jsx(m,{}),children:i.jsx(c,{...o})})}s.__docgenInfo={description:`A component that displays logs in a scrollable text area.

@remarks
The LogViewer has support for search and filtering, as well as displaying
text content with ANSI color escape codes.

Since the LogViewer uses windowing to avoid rendering all contents at once, the
log is sized automatically to fill the available vertical space. This means
it may often be needed to wrap the LogViewer in a container that provides it
with a fixed amount of space.

@public`,methods:[],displayName:"LogViewer",props:{text:{required:!0,tsType:{name:"string"},description:`The text of the logs to display.

The LogViewer component is optimized for appending content at the end of the text.`},textWrap:{required:!1,tsType:{name:"boolean"},description:"Determines if the overflow text should be wrapped or shown via a single line in a horizontal scrollbar."},classes:{required:!1,tsType:{name:"signature",type:"object",raw:`{
  root?: string;
}`,signature:{properties:[{key:"root",value:{name:"string",required:!1}}]}},description:"Styling overrides for classes within the LogViewer component."}}};const _={title:"Data Display/LogViewer",component:s,decorators:[o=>l(i.jsx(o,{}))],tags:["!manifest"]},r=`Starting up task with 3 steps
Beginning step Fetch Skeleton + Template
\x1B[32minfo\x1B[39m: Fetching template content from remote URL: https://github.com/backstage/software-templates/tree/main/scaffolder-templates/react-ssr-template/skeleton {"timestamp":"2021-12-03T15:47:11.625Z"}
\x1B[32minfo\x1B[39m: Listing files and directories in template {"timestamp":"2021-12-03T15:47:12.797Z"}
\x1B[32minfo\x1B[39m: Processing 33 template files/directories with input values {"component_id":"srnthsrthntrhsn","description":"rnthsrtnhssrthnrsthn","destination":{"host":"github.com","owner":"rtshnsrtmhrstmh","repo":"srtmhsrtmhrsthms"},"owner":"rstnhrstnhsrthn","timestamp":"2021-12-03T15:47:12.801Z"}
\x1B[32minfo\x1B[39m: Writing file .editorconfig to template output path with mode 33188. {"timestamp":"2021-12-03T15:47:12.816Z"}
\x1B[32minfo\x1B[39m: Writing file .eslintignore to template output path with mode 33188. {"timestamp":"2021-12-03T15:47:12.818Z"}
\x1B[32minfo\x1B[39m: Writing file .eslintrc.js to template output path with mode 33188. {"timestamp":"2021-12-03T15:47:12.820Z"}
\x1B[32minfo\x1B[39m: Writing directory .github/ to template output path. {"timestamp":"2021-12-03T15:47:12.823Z"}
\x1B[32minfo\x1B[39m: Writing file .gitignore to template output path with mode 33188. {"timestamp":"2021-12-03T15:47:12.824Z"}
\x1B[32minfo\x1B[39m: Writing file README.md to template output path with mode 33188. {"timestamp":"2021-12-03T15:47:12.827Z"}
\x1B[32minfo\x1B[39m: Writing file babel.config.js to template output path with mode 33188. {"timestamp":"2021-12-03T15:47:12.829Z"}
\x1B[32minfo\x1B[39m: Writing file catalog-info.yaml to template output path with mode 33188. {"timestamp":"2021-12-03T15:47:12.831Z"}
\x1B[32minfo\x1B[39m: Writing directory docs/ to template output path. {"timestamp":"2021-12-03T15:47:12.834Z"}
\x1B[32minfo\x1B[39m: Writing file jest.config.js to template output path with mode 33188. {"timestamp":"2021-12-03T15:47:12.836Z"}
\x1B[32minfo\x1B[39m: Writing file mkdocs.yml to template output path with mode 33188. {"timestamp":"2021-12-03T15:47:12.838Z"}
\x1B[32minfo\x1B[39m: Writing file next-env.d.ts to template output path with mode 33188. {"timestamp":"2021-12-03T15:47:12.841Z"}
\x1B[32minfo\x1B[39m: Writing file next.config.js to template output path with mode 33188. {"timestamp":"2021-12-03T15:47:12.844Z"}
\x1B[32minfo\x1B[39m: Writing file package.json to template output path with mode 33188. {"timestamp":"2021-12-03T15:47:12.845Z"}
\x1B[32minfo\x1B[39m: Writing file prettier.config.js to template output path with mode 33188. {"timestamp":"2021-12-03T15:47:12.848Z"}
\x1B[32minfo\x1B[39m: Writing directory public/ to template output path. {"timestamp":"2021-12-03T15:47:12.849Z"}
\x1B[32minfo\x1B[39m: Writing directory src/ to template output path. {"timestamp":"2021-12-03T15:47:12.850Z"}
\x1B[32minfo\x1B[39m: Writing file tsconfig.json to template output path with mode 33188. {"timestamp":"2021-12-03T15:47:12.851Z"}
\x1B[32minfo\x1B[39m: Writing directory .github/workflows/ to template output path. {"timestamp":"2021-12-03T15:47:12.853Z"}
\x1B[32minfo\x1B[39m: Writing file docs/index.md to template output path with mode 33188. {"timestamp":"2021-12-03T15:47:12.854Z"}
\x1B[32minfo\x1B[39m: Writing directory public/static/ to template output path. {"timestamp":"2021-12-03T15:47:12.857Z"}
\x1B[32minfo\x1B[39m: Writing directory src/__tests__/ to template output path. {"timestamp":"2021-12-03T15:47:12.858Z"}
\x1B[32minfo\x1B[39m: Writing directory src/components/ to template output path. {"timestamp":"2021-12-03T15:47:12.858Z"}
\x1B[32minfo\x1B[39m: Writing directory src/pages/ to template output path. {"timestamp":"2021-12-03T15:47:12.859Z"}
\x1B[32minfo\x1B[39m: Copying file/directory .github/workflows/build.yml without processing. {"timestamp":"2021-12-03T15:47:12.859Z"}
\x1B[32minfo\x1B[39m: Writing file .github/workflows/build.yml to template output path with mode 33188. {"timestamp":"2021-12-03T15:47:12.860Z"}
\x1B[32minfo\x1B[39m: Writing file public/static/fonts.css to template output path with mode 33188. {"timestamp":"2021-12-03T15:47:12.861Z"}
\x1B[32minfo\x1B[39m: Writing file src/components/Header.tsx to template output path with mode 33188. {"timestamp":"2021-12-03T15:47:12.863Z"}
\x1B[32minfo\x1B[39m: Writing file src/__tests__/index.test.tsx to template output path with mode 33188. {"timestamp":"2021-12-03T15:47:12.865Z"}
\x1B[32minfo\x1B[39m: Writing file src/pages/_app.tsx to template output path with mode 33188. {"timestamp":"2021-12-03T15:47:12.868Z"}
\x1B[32minfo\x1B[39m: Writing file src/pages/_document.tsx to template output path with mode 33188. {"timestamp":"2021-12-03T15:47:12.871Z"}
\x1B[32minfo\x1B[39m: Writing directory src/pages/api/ to template output path. {"timestamp":"2021-12-03T15:47:12.873Z"}
\x1B[32minfo\x1B[39m: Writing file src/pages/index.tsx to template output path with mode 33188. {"timestamp":"2021-12-03T15:47:12.874Z"}
\x1B[32minfo\x1B[39m: Writing file src/pages/api/ping.ts to template output path with mode 33188. {"timestamp":"2021-12-03T15:47:12.877Z"}
\x1B[32minfo\x1B[39m: Template result written to /var/folders/k6/9s7hd6w17115xlgwnsp0wsbr0000gn/T/5c9f8584-fded-4741-b6ef-46d94ff2cbdb {"timestamp":"2021-12-03T15:47:12.878Z"}
Finished step Fetch Skeleton + Template
Beginning step Publish
HttpError: Not Found
    at /Users/patriko/dev/backstage/node_modules/@octokit/request/dist-node/index.js:86:21
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at async Object.handler (webpack-internal:///../../plugins/scaffolder-backend/src/scaffolder/actions/builtin/publish/github.ts:156:20)
    at async HandlebarsWorkflowRunner.execute (webpack-internal:///../../plugins/scaffolder-backend/src/scaffolder/tasks/HandlebarsWorkflowRunner.ts:254:11)
    at async TaskWorker.runOneTask (webpack-internal:///../../plugins/scaffolder-backend/src/scaffolder/tasks/TaskWorker.ts:110:13)
    at async eval (webpack-internal:///../../plugins/scaffolder-backend/src/scaffolder/tasks/TaskWorker.ts:100:9)
Run completed with status: failed`,t=()=>i.jsx("div",{style:{height:240},children:i.jsx(s,{text:r})}),e=()=>i.jsx("div",{style:{height:240},children:i.jsx(s,{text:r,textWrap:!0})});t.__docgenInfo={description:"",methods:[],displayName:"ExampleLogViewer"};e.__docgenInfo={description:"",methods:[],displayName:"WithTextWrap"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{code:`const ExampleLogViewer = () => (
  <div style={{ height: 240 }}>
    <LogViewer text={exampleLog} />
  </div>
);
`,...t.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const WithTextWrap = () => (
  <div style={{ height: 240 }}>
    <LogViewer text={exampleLog} textWrap />
  </div>
);
`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => <div style={{
  height: 240
}}>
    <LogViewer text={exampleLog} />
  </div>`,...t.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => <div style={{
  height: 240
}}>
    <LogViewer text={exampleLog} textWrap />
  </div>`,...e.parameters?.docs?.source}}};const L=["ExampleLogViewer","WithTextWrap"];export{t as ExampleLogViewer,e as WithTextWrap,L as __namedExportsOrder,_ as default};
