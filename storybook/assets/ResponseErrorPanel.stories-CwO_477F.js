import{j as t}from"./iframe-C-coJuUP.js";import{R as s}from"./ResponseErrorPanel-DZd_3eE8.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-CiHm2TPH.js";import"./ErrorPanel-8ak56BOi.js";import"./WarningPanel-kT6KQz6k.js";import"./ExpandMore-ksCX5CD2.js";import"./AccordionDetails-B8tR2uC9.js";import"./index-B9sM2jn7.js";import"./Collapse-fbo-cbCX.js";import"./MarkdownContent-8VuNV2bl.js";import"./CodeSnippet-CQdXrMO3.js";import"./Box-DUptaEM1.js";import"./styled-a3UFYgpT.js";import"./CopyTextButton-BysfE0zg.js";import"./useCopyToClipboard-CtKTY1lC.js";import"./useMountedState-BzctEBb5.js";import"./Tooltip-DiFwxGBu.js";import"./Popper-dI_EnRqc.js";import"./Portal-7MVcqHay.js";import"./Grid-CpuCkwO3.js";import"./List-DmNK4dvp.js";import"./ListContext-DK0SRiIG.js";import"./ListItem-B38saMSF.js";import"./ListItemText-C0-H0C9-.js";import"./Divider-DFcxU8OS.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
