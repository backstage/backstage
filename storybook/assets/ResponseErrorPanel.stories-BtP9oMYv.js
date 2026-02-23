import{j as t}from"./iframe-CT0kqbtx.js";import{R as s}from"./ResponseErrorPanel-Ds6L1xfj.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-DcVFc7tY.js";import"./ErrorPanel-DZVPlRt5.js";import"./WarningPanel-DNkgwpiJ.js";import"./ExpandMore-6HFBoBc1.js";import"./AccordionDetails-CRkm3t8h.js";import"./index-B9sM2jn7.js";import"./Collapse-KXSsxD0x.js";import"./MarkdownContent-BQtSG_5P.js";import"./CodeSnippet-CsmjN4xv.js";import"./Box-D9dg6CgS.js";import"./styled-BLkpW3Mf.js";import"./CopyTextButton-CKXai8-6.js";import"./useCopyToClipboard-mQ9yCfQF.js";import"./useMountedState-uZD7XVdG.js";import"./Tooltip-w_fvyE_G.js";import"./Popper-DfZHcMCo.js";import"./Portal-BtLj93zy.js";import"./Grid-BDVcufVA.js";import"./List-CI6msm6Y.js";import"./ListContext-CFe7K_lB.js";import"./ListItem-C8Yqw-7T.js";import"./ListItemText-BCOqMdhs.js";import"./Divider-5fIY8kRf.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
