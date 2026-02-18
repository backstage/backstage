import{j as t}from"./iframe-DHcBEgBH.js";import{R as s}from"./ResponseErrorPanel-Cv6zlDiw.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-pGUaJr24.js";import"./ErrorPanel-B1Su2HsZ.js";import"./WarningPanel-B8ubVF3r.js";import"./ExpandMore-acgofFN2.js";import"./AccordionDetails-79ol80ql.js";import"./index-B9sM2jn7.js";import"./Collapse-CvYPW26f.js";import"./MarkdownContent-BFzMNVaX.js";import"./CodeSnippet-AhwYYrgB.js";import"./Box-CbZQ1U2e.js";import"./styled-DMPIvYo_.js";import"./CopyTextButton-BWtlCBa4.js";import"./useCopyToClipboard-C3qsehrP.js";import"./useMountedState-f5Qy4kw8.js";import"./Tooltip-8MUD-NVH.js";import"./Popper-Bsu9O5KR.js";import"./Portal-4pR_an9W.js";import"./Grid-BgyCT4VC.js";import"./List-CzJs69wv.js";import"./ListContext-bUUGMd0s.js";import"./ListItem-CTYXOgij.js";import"./ListItemText-Dm3_nGas.js";import"./Divider-Du8vAg9L.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
