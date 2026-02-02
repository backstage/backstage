import{j as t}from"./iframe-DG9KPDCv.js";import{R as s}from"./ResponseErrorPanel-AFVrCZRC.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-CIVa9hyi.js";import"./WarningPanel-Ttu6_E0y.js";import"./ExpandMore-CqQxAXKH.js";import"./AccordionDetails-BMa1mXpE.js";import"./index-B9sM2jn7.js";import"./Collapse-B-7etz-P.js";import"./MarkdownContent-CFcdNsXY.js";import"./CodeSnippet-Bw31BDNG.js";import"./Box-CpNeY0Xu.js";import"./styled-B_dsPLrg.js";import"./CopyTextButton-CBgD5fD0.js";import"./useCopyToClipboard-_Xorwdaf.js";import"./useMountedState-B6hIrLCn.js";import"./Tooltip-DkJtZmcZ.js";import"./Popper-BuiKgC9z.js";import"./Portal-Du_aJAA6.js";import"./Grid-BalTlFvh.js";import"./List-DESWnqW5.js";import"./ListContext-Cqq2xDze.js";import"./ListItem-CdFlW9lK.js";import"./ListItemText-W0WQZlCP.js";import"./Divider-e6kSnJJ8.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
