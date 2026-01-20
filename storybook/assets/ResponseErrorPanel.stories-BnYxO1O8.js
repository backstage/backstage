import{j as t}from"./iframe-BOihsBca.js";import{R as s}from"./ResponseErrorPanel-DAyQpGg-.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-NVtD5Fmz.js";import"./WarningPanel-CphllhCv.js";import"./ExpandMore-CS5zzKrc.js";import"./AccordionDetails-22y-25Aw.js";import"./index-B9sM2jn7.js";import"./Collapse-I_wLTjeF.js";import"./MarkdownContent-UpORQ4pi.js";import"./CodeSnippet-KsTffiAQ.js";import"./Box-CI5GVXvc.js";import"./styled-DdU_wQet.js";import"./CopyTextButton-D9S96eUG.js";import"./useCopyToClipboard-VRQ5LG6h.js";import"./useMountedState-BkgXJbA1.js";import"./Tooltip-DjL5rC5A.js";import"./Popper-CtKIk3Qw.js";import"./Portal-B8qEj_11.js";import"./Grid-1tirjwRV.js";import"./List-CJIQS_VF.js";import"./ListContext-CI2CUWLZ.js";import"./ListItem-CxNFHnwj.js";import"./ListItemText-7EMyhNXk.js";import"./Divider-YwFpIHuT.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
