import{j as t}from"./iframe-sMBKWU31.js";import{R as s}from"./ResponseErrorPanel-UcndcnA6.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-CxRaH0Ei.js";import"./ErrorPanel-CfbretFH.js";import"./WarningPanel-oB0_mUGM.js";import"./ExpandMore-DdjmPDN-.js";import"./AccordionDetails-kAZ0QxZ7.js";import"./index-B9sM2jn7.js";import"./Collapse-ClyK8pbD.js";import"./MarkdownContent-B1YYWAz8.js";import"./CodeSnippet-DkraU1EJ.js";import"./Box-DEmnSa5V.js";import"./styled-BMPMz7-8.js";import"./CopyTextButton-BudiSnyu.js";import"./useCopyToClipboard-zlEu4_iu.js";import"./useMountedState-BITwFL3c.js";import"./Tooltip-OhwkXjyi.js";import"./Popper-B2qoKkm9.js";import"./Portal-B2DdDtMB.js";import"./Grid-DA2cDQ0c.js";import"./List-BSQHhUkr.js";import"./ListContext-Bwj2wYBb.js";import"./ListItem-DGmFFyTj.js";import"./ListItemText-s_hEoLMP.js";import"./Divider-C88GTaaA.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
