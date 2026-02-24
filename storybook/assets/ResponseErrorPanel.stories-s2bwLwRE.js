import{j as t}from"./iframe-BzU7-g6W.js";import{R as s}from"./ResponseErrorPanel-D3bQAOFR.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-S8VF_kfg.js";import"./ErrorPanel-Dgo-TBes.js";import"./WarningPanel-Ci7xOnSb.js";import"./ExpandMore-B07BKBmU.js";import"./AccordionDetails-s3m5U6U0.js";import"./index-B9sM2jn7.js";import"./Collapse-ByHAuMFu.js";import"./MarkdownContent-CV-HF-XS.js";import"./CodeSnippet-Bew-W-M8.js";import"./Box-Buols8Z9.js";import"./styled-CKk5njoZ.js";import"./CopyTextButton-Cuecx-v0.js";import"./useCopyToClipboard-CrqNhbgM.js";import"./useMountedState-kh3LYvIW.js";import"./Tooltip-DkbrsvZ9.js";import"./Popper-DYEx6Kul.js";import"./Portal-CgRRNkEQ.js";import"./Grid-B3qBpLSb.js";import"./List-_WnCGckP.js";import"./ListContext-BaISySc_.js";import"./ListItem-Cdpwxzx8.js";import"./ListItemText-joEMPdaR.js";import"./Divider-eSNn4IOg.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
