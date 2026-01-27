import{j as t}from"./iframe-D7tLk4ld.js";import{R as s}from"./ResponseErrorPanel-CCxyXB0n.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-CjfyCBSQ.js";import"./WarningPanel-waa_5WFz.js";import"./ExpandMore-Br1SomQR.js";import"./AccordionDetails-xzn6Vz4b.js";import"./index-B9sM2jn7.js";import"./Collapse-CJcP5srX.js";import"./MarkdownContent-DEtoV9Sg.js";import"./CodeSnippet-i4EOu1Cg.js";import"./Box-BQ6FCTAV.js";import"./styled-C4zBw5eq.js";import"./CopyTextButton-D-7TENHT.js";import"./useCopyToClipboard-DDHvggmk.js";import"./useMountedState-CdD92umV.js";import"./Tooltip-CJcYpKaL.js";import"./Popper-B109mB6A.js";import"./Portal-BczuNMGa.js";import"./Grid-DIKn7D0E.js";import"./List-By8TLyAJ.js";import"./ListContext-2_-4hUG0.js";import"./ListItem-bVDpz6Z-.js";import"./ListItemText-DUrf7V-S.js";import"./Divider-Dcp5X0Oe.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:"(args: ErrorPanelProps) => <ResponseErrorPanel {...args} />",...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:"(args: ErrorPanelProps) => <ResponseErrorPanel {...args} />",...e.parameters?.docs?.source}}};const I=["Default","WithTitle"];export{r as Default,e as WithTitle,I as __namedExportsOrder,F as default};
