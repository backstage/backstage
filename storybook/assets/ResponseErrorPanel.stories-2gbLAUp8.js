import{j as t}from"./iframe-D9hL09PA.js";import{R as s}from"./ResponseErrorPanel-CSeQtz5r.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-DTQ8SdVn.js";import"./ErrorPanel-CCzawTW6.js";import"./WarningPanel-CLBpjv7W.js";import"./ExpandMore-PhPXt6NC.js";import"./AccordionDetails-D6ir3Xxo.js";import"./index-B9sM2jn7.js";import"./Collapse-ubJepro_.js";import"./MarkdownContent-DdUfmt6L.js";import"./CodeSnippet-D0eKICag.js";import"./Box-s6YRe9vN.js";import"./styled-DyvFt11P.js";import"./CopyTextButton-7z9vx-XI.js";import"./useCopyToClipboard-BDm-mC7V.js";import"./useMountedState-H9GYsHLx.js";import"./Tooltip-CMB05q-q.js";import"./Popper-DOEiwjSs.js";import"./Portal-IHwjUdnq.js";import"./Grid-D6FWqA9h.js";import"./List-DjRcYuTE.js";import"./ListContext-Brz2Wbg-.js";import"./ListItem-CnqOAGWo.js";import"./ListItemText-T3LZa7Az.js";import"./Divider-DPpr77Ph.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
  <ResponseErrorPanel
    error={new Error("Error message from error object")}
    defaultExpanded={false}
  />
);
`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const WithTitle = () => (
  <ResponseErrorPanel
    error={new Error("test")}
    defaultExpanded={false}
    title="Title prop is passed"
  />
);
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:"(args: ErrorPanelProps) => <ResponseErrorPanel {...args} />",...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:"(args: ErrorPanelProps) => <ResponseErrorPanel {...args} />",...e.parameters?.docs?.source}}};const N=["Default","WithTitle"];export{r as Default,e as WithTitle,N as __namedExportsOrder,I as default};
