const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./RealLogViewer-DrOcDprI.js","./jsx-runtime-hv06LKfz.js","./index-D8-PC79C.js","./useCopyToClipboard-Bz0ScI6A.js","./typeof-ZI2KZN5z.js","./createSvgIcon-Bpme_iea.js","./capitalize-fS9uM6tv.js","./defaultTheme-NkpNA350.js","./withStyles-BsQ9H3bp.js","./hoist-non-react-statics.cjs-DtcWCWp5.js","./createChainedFunction-Da-WpsAN.js","./createSvgIcon-D-gz-Nq7.js","./debounce-DtXjJkxj.js","./isMuiElement-DKhW5xVU.js","./ownerWindow-CjzjL4wv.js","./useIsFocusVisible-BFy7UoKA.js","./index-DXvUqTe6.js","./index-BITTEREo.js","./useControlled-CliGfT3L.js","./unstable_useId-DQJte0g1.js","./useMountedState-YD35FCBK.js","./index-DlxYA1zJ.js","./FilterList-AIJ21KDK.js","./startCase-BTbTCkl4.js","./_arrayReduce-BTs_qt-z.js","./toString-Ct-j8ZqT.js","./isSymbol-DB9gu3CF.js","./upperFirst-BLy-uTki.js","./_baseSlice-DkFNCYmM.js","./Link-m8k68nLc.js","./lodash-D1GzKnrP.js","./index-B7KODvs-.js","./makeStyles-CJp8qHqH.js","./Typography-NhBf-tfS.js","./useApp-BOX1l_wP.js","./ApiRef-ByCJBjX1.js","./useAnalytics-Q-nz63z2.js","./ConfigApi-ij0WO1-Y.js","./ChevronRight-BVd_2C9x.js","./IconButton-tgA3biVt.js","./ButtonBase-DXo3xcpP.js","./TransitionGroupContext-CcnbR2YJ.js","./TextField-DmWL4a35.js","./Select-aGy7NPFn.js","./index-DnL3XN75.js","./useTheme-Dk0AiudM.js","./Popover-CKCFsMrH.js","./Grow-BOepmPk1.js","./utils-DMni-BWz.js","./Modal-m69wb1rs.js","./classCallCheck-MFKM5G8b.js","./Portal-yuzZovYw.js","./Paper-BiLxp0Cg.js","./List-Bi5n8Alr.js","./ListContext-Brz5ktZ2.js","./formControlState-ByiNFc8I.js","./useFormControl-Dd17crCt.js","./FormLabel-CjYxj4ka.js","./InputLabel-BbZEQtws.js","./TranslationApi-CV0OlCW4.js","./Box-dSpCvcz2.js","./typography-Mwc_tj4E.js"])))=>i.map(i=>d[i]);
import{j as t}from"./jsx-runtime-hv06LKfz.js";import{_ as p}from"./iframe-B0lKZbgt.js";import{r}from"./index-D8-PC79C.js";import{u as n}from"./useApp-BOX1l_wP.js";import{w as l}from"./appWrappers-9ZYivgV2.js";import"./ApiRef-ByCJBjX1.js";import"./typeof-ZI2KZN5z.js";import"./createSvgIcon-Bpme_iea.js";import"./capitalize-fS9uM6tv.js";import"./defaultTheme-NkpNA350.js";import"./withStyles-BsQ9H3bp.js";import"./hoist-non-react-statics.cjs-DtcWCWp5.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-D-gz-Nq7.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-DKhW5xVU.js";import"./ownerWindow-CjzjL4wv.js";import"./useIsFocusVisible-BFy7UoKA.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./useControlled-CliGfT3L.js";import"./unstable_useId-DQJte0g1.js";import"./UnifiedThemeProvider-CQwkhmjj.js";import"./classCallCheck-MFKM5G8b.js";import"./inherits-CG-FC_6P.js";import"./toArray-D29G-OqT.js";import"./index-DtdSELz7.js";import"./TranslationApi-CV0OlCW4.js";import"./palettes-EuACyB3O.js";import"./CssBaseline-_vmM7-EO.js";import"./ThemeProvider-CfpqDJNO.js";import"./ConfigApi-ij0WO1-Y.js";import"./useAnalytics-Q-nz63z2.js";import"./MockErrorApi-xz33VbEd.js";import"./useAsync-7M-9CJJS.js";import"./useMountedState-YD35FCBK.js";import"./componentData-DvKcogcx.js";import"./isSymbol-DB9gu3CF.js";import"./isObject--vsEa_js.js";import"./toString-Ct-j8ZqT.js";import"./index-B7KODvs-.js";import"./ApiProvider-CYh4HGR1.js";import"./index-BKN9BsH4.js";const c=r.lazy(()=>p(()=>import("./RealLogViewer-DrOcDprI.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61]),import.meta.url).then(e=>({default:e.RealLogViewer})));function m(e){const{Progress:a}=n().getComponents();return t.jsx(r.Suspense,{fallback:t.jsx(a,{}),children:t.jsx(c,{...e})})}m.__docgenInfo={description:`A component that displays logs in a scrollable text area.

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
}`,signature:{properties:[{key:"root",value:{name:"string",required:!1}}]}},description:"Styling overrides for classes within the LogViewer component."}}};const et={title:"Data Display/LogViewer",component:m,decorators:[e=>l(t.jsx(e,{}))]},s=`Starting up task with 3 steps
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
Run completed with status: failed`,i=()=>t.jsx("div",{style:{height:240},children:t.jsx(m,{text:s})}),o=()=>t.jsx("div",{style:{height:240},children:t.jsx(m,{text:s,textWrap:!0})});i.__docgenInfo={description:"",methods:[],displayName:"ExampleLogViewer"};o.__docgenInfo={description:"",methods:[],displayName:"WithTextWrap"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => <div style={{
  height: 240
}}>
    <LogViewer text={exampleLog} />
  </div>`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => <div style={{
  height: 240
}}>
    <LogViewer text={exampleLog} textWrap />
  </div>`,...o.parameters?.docs?.source}}};const it=["ExampleLogViewer","WithTextWrap"];export{i as ExampleLogViewer,o as WithTextWrap,it as __namedExportsOrder,et as default};
