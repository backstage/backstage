import{j as t}from"./iframe-DuvNW6Xv.js";import{R as s}from"./ResponseErrorPanel-rSJCc7vj.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-Z7w_QLhf.js";import"./ErrorPanel-B_EyZMxb.js";import"./WarningPanel-BR2KDMvs.js";import"./ExpandMore-sqgE5QyK.js";import"./AccordionDetails-BiJ-mohR.js";import"./index-B9sM2jn7.js";import"./Collapse-BQ2w7qDv.js";import"./MarkdownContent-Icvbeh_f.js";import"./CodeSnippet-DrhxvQnE.js";import"./Box-DzPLR1xJ.js";import"./styled-D76g4fqW.js";import"./CopyTextButton-CQP0vEjD.js";import"./useCopyToClipboard-B8sDKXDB.js";import"./useMountedState-BooP3pH9.js";import"./Tooltip-BU-jYYLq.js";import"./Popper-DYeX4n5i.js";import"./Portal-C6ZvXkAX.js";import"./Grid-DlD5tHny.js";import"./List-BJbmfEoB.js";import"./ListContext-3Q_S_JMo.js";import"./ListItem-DO5emuSw.js";import"./ListItemText-DTTp4AyK.js";import"./Divider-CKD609da.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
