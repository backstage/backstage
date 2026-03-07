import{j as t}from"./iframe-B0Lf5NUM.js";import{R as s}from"./ResponseErrorPanel-CcOexGJ9.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-DeZCCiZz.js";import"./ErrorPanel-C0qAmMXb.js";import"./WarningPanel-Cs3-YQda.js";import"./ExpandMore-Be3t2jaH.js";import"./AccordionDetails-DK-HjlUf.js";import"./index-B9sM2jn7.js";import"./Collapse-DTvR1_LU.js";import"./MarkdownContent-DIPhZmwJ.js";import"./CodeSnippet-hFxAGKUU.js";import"./Box-aMxsL92-.js";import"./styled-DELPmjqg.js";import"./CopyTextButton-DSxmlaRl.js";import"./useCopyToClipboard-CJWJqtNB.js";import"./useMountedState-DEhMjaJi.js";import"./Tooltip-BNHXTKw9.js";import"./Popper-Cw5KalTs.js";import"./Portal-CFdZTsMU.js";import"./Grid-DX6cOXg5.js";import"./List-H_vSxU0X.js";import"./ListContext-71Kb5fnr.js";import"./ListItem-Cm0Qqfxw.js";import"./ListItemText-by58IRV6.js";import"./Divider-CK9FlrKj.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
