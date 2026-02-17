import{j as t}from"./iframe-BWaAozhM.js";import{R as s}from"./ResponseErrorPanel-gfymGEF_.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-BXQqwRxM.js";import"./ErrorPanel-CpHKIhoR.js";import"./WarningPanel-Cz_PDSWX.js";import"./ExpandMore-B6NFdm12.js";import"./AccordionDetails-BO1bPuht.js";import"./index-B9sM2jn7.js";import"./Collapse-PQIWvWXL.js";import"./MarkdownContent-DDVgukGo.js";import"./CodeSnippet-CucDpp19.js";import"./Box-B9d7t8SV.js";import"./styled-BFyqjI4T.js";import"./CopyTextButton-C2yAL59V.js";import"./useCopyToClipboard-U7bSfaHE.js";import"./useMountedState-BlQS3tzi.js";import"./Tooltip-f0Mm140e.js";import"./Popper-Bx9nzt2H.js";import"./Portal-CeZ7D8j3.js";import"./Grid-Bpm_oOGo.js";import"./List-d_1gDOpt.js";import"./ListContext-KZtCLGQU.js";import"./ListItem-CwaI1EQV.js";import"./ListItemText-j6Wkxdaj.js";import"./Divider-DKWgzE0b.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
