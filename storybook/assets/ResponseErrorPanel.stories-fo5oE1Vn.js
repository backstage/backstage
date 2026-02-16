import{j as t}from"./iframe-BtR5uFk3.js";import{R as s}from"./ResponseErrorPanel-CVfiXUTa.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-BfJpy4Wy.js";import"./ErrorPanel-BN9_BTb3.js";import"./WarningPanel-Wpl4i8Ix.js";import"./ExpandMore-BC9RFylZ.js";import"./AccordionDetails-BoWkno8W.js";import"./index-B9sM2jn7.js";import"./Collapse-RDSawrgb.js";import"./MarkdownContent-DcvoPket.js";import"./CodeSnippet-DwGCrwI4.js";import"./Box-OUxpV5ZT.js";import"./styled-Dh4-ZHyx.js";import"./CopyTextButton-BiMr52YT.js";import"./useCopyToClipboard-D_DS-bMS.js";import"./useMountedState-D9gb5SvK.js";import"./Tooltip-BsjCemVc.js";import"./Popper-BZySTT6t.js";import"./Portal-n2LDmCMW.js";import"./Grid-BcwH-HFr.js";import"./List-CzkDasS3.js";import"./ListContext-BRtoW0M1.js";import"./ListItem-CfCZyyBM.js";import"./ListItemText-nCVBR7lx.js";import"./Divider-ZCHYHqdQ.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
