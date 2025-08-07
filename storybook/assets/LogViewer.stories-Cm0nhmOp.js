const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./RealLogViewer-DF8yXPlP.js","./jsx-runtime-Cw0GR0a5.js","./index-CTjT7uj6.js","./useCopyToClipboard-DSYSaj2L.js","./interopRequireDefault-Y9pwbXtE.js","./createSvgIcon-C7DOmWEG.js","./capitalize-BWjKmKKm.js","./defaultTheme-DquFOgf8.js","./withStyles-DWaS6n8x.js","./hoist-non-react-statics.cjs-DzIEFHQI.js","./createChainedFunction-Da-WpsAN.js","./createSvgIcon-CL6P1I3F.js","./debounce-DtXjJkxj.js","./isMuiElement-B_4ddUuK.js","./ownerWindow-C3iVrxHF.js","./useIsFocusVisible-BQk2_Vhe.js","./index-DwHHXP4W.js","./useControlled-B47E2WMp.js","./unstable_useId-B3Hiq1YI.js","./useMountedState-DkESzBh4.js","./index-Cqve-NHl.js","./FilterList-B1crNgSX.js","./startCase-BtJ2VDcb.js","./_arrayReduce-B24CUDp3.js","./toString-B79bsZRM.js","./isSymbol-C_KZXW2d.js","./upperFirst-DLTVdCCL.js","./_baseSlice-z0Zd1-Ev.js","./Link-CpO8OXNj.js","./lodash-CoGan1YB.js","./index-w6SBqnNd.js","./ApiRef-CqkoWjZn.js","./makeStyles-CRB_T0k9.js","./Typography-D5Gm01bp.js","./useAnalytics-DVyBXs_0.js","./ConfigApi-D1qiBdfc.js","./ChevronRight-D6cdGwfs.js","./IconButton-CFscYum-.js","./ButtonBase-BGCFQJw7.js","./TransitionGroupContext-BtzQ-Cv7.js","./TextField-BGQuX1Wm.js","./FormLabel-D6jOsxCS.js","./formControlState-ByiNFc8I.js","./useFormControl-F4cJWIkJ.js","./InputLabel-Rh6717bL.js","./Select-ChjCOIHu.js","./react-is.production.min-D0tnNtx9.js","./useTheme-0ztDbzjM.js","./Popover-D307bIKx.js","./Modal-Bp4d7pBz.js","./classCallCheck-BNzALLS0.js","./Portal-BcgI5KAA.js","./Paper-2nKWzoda.js","./Grow-CD9ZmTub.js","./utils-C5QDFBiQ.js","./List-B21WyO9K.js","./ListContext-DydK1sOh.js","./TranslationApi-DhmNHZQM.js","./Box-DU2WS7ls.js","./typography-1q_m8518.js"])))=>i.map(i=>d[i]);
import{j as t}from"./jsx-runtime-Cw0GR0a5.js";import{_ as u}from"./iframe-oFwm9MPV.js";import{r as c}from"./index-CTjT7uj6.js";import{b as f}from"./index-w6SBqnNd.js";import{w as x}from"./appWrappers-D-TRZlDS.js";import"./ApiRef-CqkoWjZn.js";import"./interopRequireDefault-Y9pwbXtE.js";import"./createSvgIcon-C7DOmWEG.js";import"./capitalize-BWjKmKKm.js";import"./defaultTheme-DquFOgf8.js";import"./withStyles-DWaS6n8x.js";import"./hoist-non-react-statics.cjs-DzIEFHQI.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-CL6P1I3F.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-B_4ddUuK.js";import"./ownerWindow-C3iVrxHF.js";import"./useIsFocusVisible-BQk2_Vhe.js";import"./index-DwHHXP4W.js";import"./useControlled-B47E2WMp.js";import"./unstable_useId-B3Hiq1YI.js";import"./MockTranslationApi-BxEIBj9k.js";import"./classCallCheck-BNzALLS0.js";import"./inherits-BBh9Yz5k.js";import"./toArray-n7tUSQe9.js";import"./index-CFaqwFgm.js";import"./TranslationApi-DhmNHZQM.js";import"./ConfigApi-D1qiBdfc.js";import"./useAnalytics-DVyBXs_0.js";import"./WebStorage-0NkRnF9s.js";import"./useAsync-CXA3qup_.js";import"./useMountedState-DkESzBh4.js";import"./componentData-B20g3K9Y.js";import"./isSymbol-C_KZXW2d.js";import"./isObject-DlTwUI3n.js";import"./toString-B79bsZRM.js";import"./ApiProvider-DlKBPm-W.js";import"./index-BRV0Se7Z.js";import"./ThemeProvider-iV7LyTO2.js";import"./CssBaseline-0XN_ELQr.js";import"./palettes-Bwgvserk.js";const g=c.lazy(()=>u(()=>import("./RealLogViewer-DF8yXPlP.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59]),import.meta.url).then(e=>({default:e.RealLogViewer})));function m(e){const{Progress:h}=f().getComponents();return t.jsx(c.Suspense,{fallback:t.jsx(h,{}),children:t.jsx(g,{...e})})}m.__docgenInfo={description:`A component that displays logs in a scrollable text area.

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
}`,signature:{properties:[{key:"root",value:{name:"string",required:!1}}]}},description:"Styling overrides for classes within the LogViewer component."}}};const rt={title:"Data Display/LogViewer",component:m,decorators:[e=>x(t.jsx(e,{}))]},d=`Starting up task with 3 steps
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
Run completed with status: failed`,i=()=>t.jsx("div",{style:{height:240},children:t.jsx(m,{text:d})}),o=()=>t.jsx("div",{style:{height:240},children:t.jsx(m,{text:d,textWrap:!0})});i.__docgenInfo={description:"",methods:[],displayName:"ExampleLogViewer"};o.__docgenInfo={description:"",methods:[],displayName:"WithTextWrap"};var r,s,a;i.parameters={...i.parameters,docs:{...(r=i.parameters)==null?void 0:r.docs,source:{originalSource:`() => <div style={{
  height: 240
}}>
    <LogViewer text={exampleLog} />
  </div>`,...(a=(s=i.parameters)==null?void 0:s.docs)==null?void 0:a.source}}};var p,n,l;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`() => <div style={{
  height: 240
}}>
    <LogViewer text={exampleLog} textWrap />
  </div>`,...(l=(n=o.parameters)==null?void 0:n.docs)==null?void 0:l.source}}};const st=["ExampleLogViewer","WithTextWrap"];export{i as ExampleLogViewer,o as WithTextWrap,st as __namedExportsOrder,rt as default};
