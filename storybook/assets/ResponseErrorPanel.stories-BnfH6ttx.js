import{j as t}from"./iframe-DcD9AGXg.js";import{R as s}from"./ResponseErrorPanel-CUe2zYqU.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-aq0vcWH5.js";import"./ErrorPanel-DKBW-e0p.js";import"./WarningPanel-DD_Vegiw.js";import"./ExpandMore-C5yZVzxC.js";import"./AccordionDetails-Bf-t1aN1.js";import"./index-B9sM2jn7.js";import"./Collapse-birbGpCt.js";import"./MarkdownContent-DkZ_a2pk.js";import"./CodeSnippet-B6Kn_6pI.js";import"./Box-CD9U0JkS.js";import"./styled-Dv4Z9rlI.js";import"./CopyTextButton-Vuxttojt.js";import"./useCopyToClipboard-37bW0I2A.js";import"./useMountedState-DObEazil.js";import"./Tooltip-CK-bju_x.js";import"./Popper-DI0xczFA.js";import"./Portal-B5t-TUu9.js";import"./Grid-Cw-xaTkg.js";import"./List-CLA1LZPX.js";import"./ListContext-Bdpr0ztu.js";import"./ListItem-wfNPMux6.js";import"./ListItemText-B4ptHm4S.js";import"./Divider-BVfIhr-j.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
